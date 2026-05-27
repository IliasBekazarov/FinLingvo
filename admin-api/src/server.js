import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { adminLogin, requireAdmin, requireUser, signUserToken } from './auth.js';
import { load, update, save, dataFilePath } from './storage.js';
import { publish } from './publish.js';
import * as users from './users.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(cors());

async function autoPublish() {
  try { await publish(); }
  catch (e) { console.error('auto-publish failed:', e.message); }
}

async function mutate(mutator) {
  const next = await update(mutator);
  await autoPublish();
  return next;
}

function makeLessonId(module) {
  const used = new Set(module.lessons.map(l => l.id));
  let n = module.lessons.length + 1;
  while (used.has(`${module.id}-${n}`)) n++;
  return `${module.id}-${n}`;
}

// === Public health & content ===
app.get('/admin/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// Public read-only content endpoint for the React site (no auth required).
app.get('/admin/api/public/content', async (_req, res) => {
  const c = await load();
  res.json({
    modules: c.modules || [],
    achievements: c.achievements || [],
    leagues: c.leagues || [],
    shop_items: c.shop_items || [],
  });
});

// === Public user auth ===
app.post('/admin/api/u/signup', async (req, res) => {
  try {
    const u = await users.signup(req.body || {});
    const token = signUserToken(u);
    res.json({ token, user: u });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/admin/api/u/login', async (req, res) => {
  try {
    const u = await users.login(req.body || {});
    const token = signUserToken(u);
    res.json({ token, user: u });
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

// Public leaderboard — anyone can see top users.
app.get('/admin/api/u/leaderboard', async (req, res) => {
  const limit = Math.min(100, +req.query.limit || 30);
  res.json(await users.leaderboard(limit));
});

// === User-authenticated endpoints ===
app.get('/admin/api/u/me', requireUser, async (req, res) => {
  const u = await users.fetchMe(req.user.sub);
  if (!u) return res.status(404).json({ error: 'not found' });
  res.json(u);
});

app.patch('/admin/api/u/me/state', requireUser, async (req, res) => {
  try {
    const u = await users.patchState(req.user.sub, req.body || {});
    res.json(u);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/admin/api/u/me/lesson', requireUser, async (req, res) => {
  try {
    const r = await users.completeLesson(req.user.sub, req.body || {});
    res.json(r);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/admin/api/u/me/buy', requireUser, async (req, res) => {
  try {
    const u = await users.buyItem(req.user.sub, req.body || {});
    res.json(u);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/admin/api/u/me/daily', requireUser, async (req, res) => {
  try {
    const r = await users.claimDailyBonus(req.user.sub);
    res.json(r);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// === Admin auth + content (existing) ===
app.post('/admin/api/login', (req, res) => {
  const token = adminLogin(req.body?.password);
  if (!token) return res.status(401).json({ error: 'wrong password' });
  res.json({ token });
});

app.use('/admin/api', requireAdmin);

app.get('/admin/api/me', (req, res) => res.json({ ok: true, role: req.user.role }));

app.get('/admin/api/content', async (_req, res) => {
  const c = await load();
  res.json(c);
});

app.put('/admin/api/content', async (req, res) => {
  const next = await save(req.body);
  await autoPublish();
  res.json(next);
});

app.get('/admin/api/modules', async (_req, res) => res.json((await load()).modules || []));
app.post('/admin/api/modules', async (req, res) => {
  const c = await mutate(c => {
    const max = c.modules.reduce((m, x) => Math.max(m, x.id), 0);
    c.modules.push({ id: max + 1, emoji: '', title: 'Жаңы модуль', color: '#58CC02', lessons: [], ...req.body });
    return c;
  });
  res.json(c.modules);
});
app.put('/admin/api/modules/:id', async (req, res) => {
  const id = +req.params.id;
  const c = await mutate(c => {
    const idx = c.modules.findIndex(m => m.id === id);
    if (idx >= 0) c.modules[idx] = { ...c.modules[idx], ...req.body, id };
    return c;
  });
  res.json(c.modules.find(m => m.id === id));
});
app.delete('/admin/api/modules/:id', async (req, res) => {
  const id = +req.params.id;
  await mutate(c => { c.modules = c.modules.filter(m => m.id !== id); return c; });
  res.json({ ok: true });
});

app.post('/admin/api/modules/:mid/lessons', async (req, res) => {
  const mid = +req.params.mid;
  const c = await mutate(c => {
    const m = c.modules.find(x => x.id === mid);
    if (!m) return c;
    const newId = makeLessonId(m);
    m.lessons.push({ id: newId, title: 'Жаңы сабак', questions: [], ...req.body });
    return c;
  });
  res.json(c.modules.find(m => m.id === mid));
});
app.put('/admin/api/lessons/:lid', async (req, res) => {
  const lid = req.params.lid;
  const c = await mutate(c => {
    for (const m of c.modules) {
      const li = m.lessons.findIndex(l => l.id === lid);
      if (li >= 0) {
        m.lessons[li] = { ...m.lessons[li], ...req.body, id: lid };
        break;
      }
    }
    return c;
  });
  let found = null;
  for (const m of c.modules) {
    const l = m.lessons.find(x => x.id === lid);
    if (l) { found = l; break; }
  }
  res.json(found);
});
app.delete('/admin/api/lessons/:lid', async (req, res) => {
  const lid = req.params.lid;
  await mutate(c => {
    for (const m of c.modules) m.lessons = m.lessons.filter(l => l.id !== lid);
    return c;
  });
  res.json({ ok: true });
});

app.put('/admin/api/achievements', async (req, res) => {
  const c = await mutate(c => { c.achievements = req.body; return c; });
  res.json(c.achievements);
});
app.put('/admin/api/shop', async (req, res) => {
  const c = await mutate(c => { c.shop_items = req.body; return c; });
  res.json(c.shop_items);
});
app.put('/admin/api/leagues', async (req, res) => {
  const c = await mutate(c => { c.leagues = req.body; return c; });
  res.json(c.leagues);
});

app.get('/admin/api/stats', async (_req, res) => {
  const c = await load();
  const totalLessons = c.modules.reduce((a, m) => a + m.lessons.length, 0);
  const totalQuestions = c.modules.reduce((a, m) => a + m.lessons.reduce((b, l) => b + l.questions.length, 0), 0);
  const userStats = await users.adminStats();
  res.json({
    modules: c.modules.length,
    lessons: totalLessons,
    questions: totalQuestions,
    achievements: c.achievements.length,
    shop_items: c.shop_items.length,
    leagues: c.leagues.length,
    users: userStats.total,
    active_users_7d: userStats.active7,
    active_users_1d: userStats.active1,
    total_user_xp: userStats.totalXp,
    total_user_lessons: userStats.totalLessons,
    content_file: dataFilePath(),
  });
});

app.post('/admin/api/publish', async (_req, res) => {
  try {
    const result = await publish();
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// === Admin user management ===
app.get('/admin/api/users', async (req, res) => {
  const list = await users.adminListUsers({ q: req.query.q, sort: req.query.sort });
  res.json(list);
});
app.get('/admin/api/users/stats', async (_req, res) => {
  res.json(await users.adminStats());
});
app.get('/admin/api/users/:id', async (req, res) => {
  const u = await users.adminGetUser(req.params.id);
  if (!u) return res.status(404).json({ error: 'not found' });
  res.json(u);
});
app.put('/admin/api/users/:id', async (req, res) => {
  try {
    const u = await users.adminUpdateUser(req.params.id, req.body || {});
    res.json(u);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.post('/admin/api/users/:id/reset', async (req, res) => {
  try {
    const u = await users.adminResetProgress(req.params.id);
    res.json(u);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/admin/api/users/:id', async (req, res) => {
  const ok = await users.adminDeleteUser(req.params.id);
  res.json({ ok });
});

// Serve frontend static files at /
const frontendDir = join(__dirname, '../../may.caim.dev_frontend');
app.use(express.static(frontendDir));
app.get(/^\/(?!admin).*/, (_req, res) => {
  res.sendFile(join(frontendDir, 'index.html'));
});

// Serve admin panel at /admin-panel
const adminDir = join(__dirname, '../../admin');
app.use('/admin-panel', express.static(adminDir));

const PORT = +(process.env.PORT || 3030);
app.listen(PORT, '127.0.0.1', () => {
  console.log(`finlingvo-admin-api listening on 127.0.0.1:${PORT}`);
  console.log(`Frontend:    http://127.0.0.1:${PORT}`);
  console.log(`Admin panel: http://127.0.0.1:${PORT}/admin-panel`);
  console.log(`data file: ${dataFilePath()}`);
});
