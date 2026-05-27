// FinLingvo — API Client + State Store
// Handles all API calls and localStorage state

const API_BASE = '/admin/api';
const TOKEN_KEY = 'fl_user_token';
const USER_KEY  = 'fl_user_cache';

/* ═══════════════ API HELPERS ═══════════════ */
function getToken() { return localStorage.getItem(TOKEN_KEY); }
function setToken(t) { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); }
function clearToken() { setToken(null); }

async function apiFetch(method, path, body) {
  const token = getToken();
  const res = await fetch(API_BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (res.status === 401) { clearToken(); throw Object.assign(new Error('unauthorized'), { status: 401 }); }
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

const API = {
  signup:         body  => apiFetch('POST', '/u/signup', body),
  login:          body  => apiFetch('POST', '/u/login',  body),
  me:             ()    => apiFetch('GET',  '/u/me'),
  patchState:     patch => apiFetch('PATCH','/u/me/state', patch),
  daily:          ()    => apiFetch('POST', '/u/me/daily'),
  completeLesson: body  => apiFetch('POST', '/u/me/lesson', body),
  buy:            body  => apiFetch('POST', '/u/me/buy', body),
  leaderboard:    (n=30)=> apiFetch('GET',  `/u/leaderboard?limit=${n}`),
  publicContent:  ()    => apiFetch('GET',  '/public/content'),
};

/* ═══════════════ DEFAULT STATE ═══════════════ */
function defaultState() {
  return {
    xp: 0, hearts: 5, heartsRefilledAt: Date.now(),
    gems: 150, streak: 0, lastActiveDate: null, lastDailyBonusDate: null,
    completedLessons: [], perfectLessons: [], achievements: [],
    ownedShop: [], settings: { sound: true, notifications: true, theme: 'dark' }
  };
}

/* ═══════════════ STORE ═══════════════ */
const Store = {
  _user: null,
  _listeners: [],

  on(fn)  { this._listeners.push(fn); return () => this._listeners = this._listeners.filter(f=>f!==fn); },
  emit()  { this._listeners.forEach(fn => fn(this._user)); },

  get user()  { return this._user; },
  get state() { return this._user?.state || defaultState(); },
  get isAuth(){ return !!getToken() && !!this._user; },

  setUser(u) {
    this._user = u;
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else   localStorage.removeItem(USER_KEY);
    this.emit();
  },

  loadCache() {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) { try { this._user = JSON.parse(raw); } catch{} }
  },

  async init() {
    this.loadCache();
    if (!getToken()) return null;
    try {
      const me = await API.me();
      this.setUser(me);
      return me;
    } catch(e) {
      if (e.status === 401) this.logout();
      return null;
    }
  },

  async login(email, password) {
    const res = await API.login({ email, password });
    setToken(res.token);
    this.setUser(res.user);
    // Claim daily bonus
    try {
      const daily = await API.daily();
      if (daily?.user) this.setUser(daily.user);
    } catch {}
    return res.user;
  },

  async signup(name, email, password) {
    const res = await API.signup({ name, email, password });
    setToken(res.token);
    this.setUser(res.user);
    return res.user;
  },

  async loginAsGuest() {
    const guest = {
      guest: true, name: 'Конок', avatar: '🦅',
      state: defaultState(),
      id: 'guest'
    };
    this.setUser(guest);
    return guest;
  },

  logout() {
    clearToken();
    this.setUser(null);
    window.location.href = '/';
  },

  async patchState(patch) {
    const user = this._user;
    if (!user) return;
    const newState = { ...user.state, ...patch };
    if (user.guest) {
      this.setUser({ ...user, state: newState });
      return;
    }
    try {
      const updated = await API.patchState(patch);
      if (updated) this.setUser(updated);
    } catch {
      // optimistic
      this.setUser({ ...user, state: newState });
    }
  },

  async addXP(amount, lessonId, perfect) {
    const s = this.state;
    const newXP    = (s.xp || 0) + amount;
    const newGems  = (s.gems || 0) + Math.floor(amount / 10);
    const doneLessons = s.completedLessons || [];
    const perfLessons = s.perfectLessons   || [];
    const patch = {
      xp: newXP, gems: newGems,
      completedLessons: lessonId && !doneLessons.includes(lessonId) ? [...doneLessons, lessonId] : doneLessons,
      perfectLessons:   perfect  && !perfLessons.includes(lessonId)  ? [...perfLessons, lessonId]  : perfLessons,
    };
    await this.patchState(patch);
    this.checkAchievements();
  },

  loseHeart() {
    const s = this.state;
    const hearts = Math.max(0, (s.hearts || 0) - 1);
    this.patchState({ hearts });
    return hearts;
  },

  async buyItem(itemId, price, kind) {
    const s = this.state;
    if ((s.gems || 0) < price) throw new Error('Жем жетишпейт!');
    const patch = { gems: s.gems - price };
    if (kind === 'hearts')   patch.hearts = 5;
    if (kind === 'xp_boost') patch.xpBoost = (s.xpBoost || 1) * 2;
    if (kind === 'gems')     patch.gems = s.gems - price + 100;
    if (kind === 'avatar')   patch.avatar = itemId;
    if (kind === 'freeze')   patch.streakFreeze = true;
    const ownedShop = [...(s.ownedShop || [])];
    if (!ownedShop.includes(itemId)) ownedShop.push(itemId);
    patch.ownedShop = ownedShop;
    if (this._user?.guest) { await this.patchState(patch); return; }
    try { const u = await API.buy({ itemId, price, kind }); if (u) this.setUser(u); }
    catch { await this.patchState(patch); }
  },

  checkAchievements() {
    const u = this._user;
    if (!u) return;
    const s = u.state;
    const done = new Set(s.achievements || []);
    const newOnes = [];
    for (const ach of FL_ACHIEVEMENTS) {
      if (!done.has(ach.id) && ach.condition(s)) {
        done.add(ach.id);
        newOnes.push(ach);
      }
    }
    if (newOnes.length) {
      this.patchState({ achievements: [...done] });
      newOnes.forEach(a => showAchievementToast(a));
    }
  },

  async fetchLeaderboard() {
    if (getToken()) return API.leaderboard();
    // Mock data for guests
    return mockLeaderboard();
  }
};

/* ═══════════════ UI HELPERS ═══════════════ */
function requireAuth(redirectTo) {
  Store.loadCache();
  if (!getToken() && !Store.user?.guest) {
    window.location.href = redirectTo || '/login.html';
    return false;
  }
  return true;
}

function updateNavStats() {
  const s = Store.state;
  const els = {
    streak: document.getElementById('nav-streak'),
    hearts: document.getElementById('nav-hearts'),
    gems:   document.getElementById('nav-gems'),
    xp:     document.getElementById('nav-xp'),
  };
  if (els.streak) els.streak.textContent = s.streak || 0;
  if (els.hearts) els.hearts.textContent = s.hearts ?? 5;
  if (els.gems)   els.gems.textContent   = s.gems   || 0;
  if (els.xp)     els.xp.textContent     = s.xp     || 0;
}

function showToast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function showAchievementToast(ach) {
  let el = document.getElementById('achievement-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'achievement-toast';
    el.className = 'achievement-toast';
    el.innerHTML = `
      <div class="achievement-toast-icon"></div>
      <div>
        <div class="achievement-toast-label">🏅 Жетишкендик!</div>
        <div class="achievement-toast-title"></div>
      </div>`;
    document.body.appendChild(el);
  }
  el.querySelector('.achievement-toast-icon').textContent = ach.emoji;
  el.querySelector('.achievement-toast-title').textContent = ach.name;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 4000);
}

/* ═══════════════ CONFETTI ═══════════════ */
function fireConfetti(count = 80) {
  const colors = ['#58CC02','#FFD900','#1CB0F6','#FF4B4B','#CE82FF','#FF9600'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: -20px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration: ${1.5 + Math.random() * 2}s;
      animation-delay: ${Math.random() * 0.8}s;
      transform: rotate(${Math.random() * 360}deg);
    `;
    document.body.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove());
  }
}

/* ═══════════════ MOCK LEADERBOARD (guest) ═══════════════ */
function mockLeaderboard() {
  const names = ['Айгерим','Бакыт','Чынара','Данияр','Эльмира','Фарид','Гүлнара','Хасан','Индира','Жоомарт'];
  const avatars = ['🦅','🦊','🦁','🐺','🦉','🐯','🦋','🐬','🦚','🌟'];
  return names.map((name, i) => ({
    rank: i + 1, name,
    avatar: avatars[i],
    xp: Math.floor(2000 - i * 150 + Math.random() * 100),
    league: FL_LEAGUES[Math.min(9, Math.floor(Math.random() * 5))].name
  }));
}

/* ═══════════════ HEART REGEN ═══════════════ */
function startHeartRegen() {
  setInterval(() => {
    const s = Store.state;
    if (!s || s.hearts >= 5) return;
    const elapsed = Date.now() - (s.heartsRefilledAt || Date.now());
    const regenMs = 20 * 60 * 1000; // 20 min per heart
    const gained  = Math.floor(elapsed / regenMs);
    if (gained > 0) {
      Store.patchState({
        hearts: Math.min(5, s.hearts + gained),
        heartsRefilledAt: Date.now() - (elapsed % regenMs)
      });
      updateNavStats();
    }
  }, 30000);
}

/* ═══════════════ SOUND EFFECTS ═══════════════ */
function playSound(type) {
  const s = Store.state;
  if (!s?.settings?.sound) return;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  if (type === 'correct') {
    osc.frequency.setValueAtTime(523, ctx.currentTime);
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start(); osc.stop(ctx.currentTime + 0.4);
  } else if (type === 'wrong') {
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(); osc.stop(ctx.currentTime + 0.3);
  } else if (type === 'complete') {
    [523,659,784,1047].forEach((f, i) => {
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.connect(g2); g2.connect(ctx.destination);
      o2.frequency.value = f;
      g2.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12);
      g2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.25);
      o2.start(ctx.currentTime + i * 0.12);
      o2.stop(ctx.currentTime + i * 0.12 + 0.25);
    });
  }
}

/* ═══════════════ ACTIVE NAV LINK ═══════════════ */
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.classList.toggle('active', el.dataset.nav === path);
  });
}

/* ═══════════════ SVG ICONS ═══════════════ */
const ICONS = {
  learn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
  profile: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
  leaderboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4a2 2 0 00-2 2v9h4V9z"/><path d="M14 4h-4a2 2 0 00-2 2v15h8V6a2 2 0 00-2-2z"/><path d="M20 13h-2a2 2 0 00-2 2v6h4v-6a2 2 0 00-.006-.2L20 13z"/></svg>`,
  shop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
  streak: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>`,
  hearts: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z"/></svg>`,
  gems: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  xp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
  eagle: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>`,
};

/* ═══════════════ RENDER NAV ═══════════════ */
function renderTopNav(container) {
  const s = Store.state;
  if (!container) return;
  container.innerHTML = `
    <a href="/learn.html" class="topnav-logo">
      <img src="/mascot.svg" alt="FinLingvo" style="height:32px;width:auto;vertical-align:middle;">
      <span>FinLingvo</span>
    </a>
    <div class="nav-stats">
      <div class="nav-stat streak" title="Стрик">
        <span class="nav-stat-icon nav-icon-streak">${ICONS.streak}</span>
        <span id="nav-streak">${s.streak || 0}</span>
      </div>
      <div class="nav-stat hearts" title="Жүрөктөр">
        <span class="nav-stat-icon nav-icon-hearts">${ICONS.hearts}</span>
        <span id="nav-hearts">${s.hearts ?? 5}</span>
      </div>
      <div class="nav-stat gems" title="Жемдер">
        <span class="nav-stat-icon nav-icon-gems">${ICONS.gems}</span>
        <span id="nav-gems">${s.gems || 0}</span>
      </div>
      <div class="nav-stat xp" title="XP">
        <span class="nav-stat-icon nav-icon-xp">${ICONS.xp}</span>
        <span id="nav-xp">${s.xp || 0}</span>
      </div>
    </div>`;
}

function renderSideNav(container) {
  if (!container) return;
  // Apply the .sidenav class to the mount element so CSS flex/display rules apply
  container.className = 'sidenav';
  const path = window.location.pathname.split('/').pop() || 'learn.html';
  const items = [
    { nav: 'learn.html',       icon: ICONS.learn,       label: 'Үйрөнүү'    },
    { nav: 'profile.html',     icon: ICONS.profile,     label: 'Профиль'    },
    { nav: 'leaderboard.html', icon: ICONS.leaderboard, label: 'Лидерлер'   },
    { nav: 'shop.html',        icon: ICONS.shop,        label: 'Дүкөн'      },
    { nav: 'settings.html',    icon: ICONS.settings,    label: 'Орнотуулар' },
  ];
  container.innerHTML = `
    <a href="/learn.html" class="sidenav-logo">
      <img src="/mascot.svg" alt="mascot">
      <span>FinLingvo</span>
    </a>
    ${items.map(item => `
    <a href="/${item.nav}" class="sidenav-item ${path===item.nav?'active':''}" data-nav="${item.nav}">
      <span class="sidenav-icon">${item.icon}</span>
      <span>${item.label}</span>
    </a>`).join('')}`;
}

function renderBottomNav(container) {
  if (!container) return;
  // Apply the .bottom-nav class to the mount element so CSS can control visibility
  container.className = 'bottom-nav';
  const path = window.location.pathname.split('/').pop() || 'learn.html';
  const items = [
    { nav: 'learn.html',       icon: ICONS.learn,       label: 'Жол'     },
    { nav: 'leaderboard.html', icon: ICONS.leaderboard, label: 'Рейтинг' },
    { nav: 'profile.html',     icon: ICONS.profile,     label: 'Профиль' },
    { nav: 'shop.html',        icon: ICONS.shop,        label: 'Дүкөн'   },
    { nav: 'settings.html',    icon: ICONS.settings,    label: 'Орнотоо' },
  ];
  container.innerHTML = `<div class="bottom-nav-inner">${
    items.map(item => `
      <a href="/${item.nav}" class="bottom-nav-item ${path===item.nav?'active':''}" data-nav="${item.nav}">
        <span class="bottom-nav-icon">${item.icon}</span>
        <span>${item.label}</span>
      </a>`).join('')
  }</div>`;
}
