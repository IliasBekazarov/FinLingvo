// FinLingvo — Lesson Engine
// Handles all lesson logic: rendering questions, scoring, feedback

(function() {

/* ═══ STATE ═══ */
let lessonData    = null;   // { moduleId, lesson }
let questions     = [];
let currentIndex  = 0;
let hearts        = 5;
let score         = 0;      // correct answers
let xpEarned      = 0;
let mistakes      = 0;
let answered      = false;
let selectedAnswer= null;
let startTime     = 0;
let xpBoostActive = false;

/* ═══ DOM REFS ═══ */
const $ = id => document.getElementById(id);

/* ═══ INIT ═══ */
async function init() {
  // Parse URL: ?module=1&lesson=1-1
  const params   = new URLSearchParams(location.search);
  const moduleId = parseInt(params.get('module')) || 1;
  const lessonId = params.get('lesson') || '1-1';

  const mod = FL_MODULES.find(m => m.id === moduleId);
  const lesson = mod?.lessons.find(l => l.id === lessonId);
  if (!mod || !lesson) { window.location.href = '/learn.html'; return; }

  lessonData = { mod, lesson };
  questions  = shuffleArray([...lesson.questions]);
  hearts     = Store.state.hearts ?? 5;
  xpBoostActive = !!(Store.state.xpBoost);
  startTime  = Date.now();

  // Build UI
  document.title = `${lesson.title} — FinLingvo`;
  renderHeader();
  renderQuestion();
}

/* ═══ RENDER HEADER ═══ */
function renderHeader() {
  const headerEl = $('lesson-header-inner');
  if (!headerEl) return;
  headerEl.innerHTML = `
    <button onclick="confirmExit()" class="lesson-close-btn" aria-label="Чыгуу">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    </button>
    <div class="lesson-progress" id="lesson-progress-wrap">
      <div class="progress-bar">
        <div class="progress-fill green" id="lesson-progress-fill" style="width:0%"></div>
      </div>
    </div>
    <div class="lesson-hearts" id="hearts-display"></div>`;
  renderHearts();
  updateProgress();
}

function renderHearts() {
  const el = $('hearts-display');
  if (!el) return;
  el.innerHTML = Array.from({length: 5}, (_, i) =>
    `<span class="heart ${i >= hearts ? 'lost' : ''}">❤️</span>`
  ).join('');
}

function updateProgress() {
  const fill = $('lesson-progress-fill');
  if (!fill) return;
  const pct = Math.round((currentIndex / questions.length) * 100);
  fill.style.width = pct + '%';
}

/* ═══ RENDER QUESTION ═══ */
function renderQuestion() {
  if (currentIndex >= questions.length) { showCompletion(); return; }
  answered = false; selectedAnswer = null;

  const q   = questions[currentIndex];
  const area = $('question-area');
  if (!area) return;

  const typeLabel = { mc: 'Туура жоопту тандоо', tf: 'Туура же Жалган', fill: 'Бош жерди толтур' };

  area.innerHTML = `
    <div class="question-type-badge animate-fadeIn">
      <span>${typeLabel[q.type] || 'Суроо'}</span>
      <span style="color:var(--yellow);font-weight:900">+${getQXP()} XP</span>
    </div>
    <div class="question-text animate-slideUp">${q.q}</div>
    <div id="answers-container" class="animate-slideUp"></div>
    <div style="margin-top:auto;padding-top:16px">
      <button id="check-btn" class="btn btn-surface btn-full btn-lg" onclick="checkAnswer()" disabled>
        Текшерүү
      </button>
    </div>`;

  area.style.cssText = 'flex:1;display:flex;flex-direction:column;padding:20px 0';

  if (q.type === 'mc')   renderMC(q);
  else if (q.type === 'tf') renderTF(q);
}

function renderMC(q) {
  const container = $('answers-container');
  const letters = ['A','B','C','D'];
  container.className = `answer-grid ${q.opts.length <= 2 ? 'single-col' : ''}`;
  container.innerHTML = q.opts.map((opt, i) => `
    <button class="answer-option" onclick="selectAnswer(${i})" data-index="${i}">
      <span class="answer-letter">${letters[i]}</span>
      <span>${opt}</span>
    </button>`).join('');
}

function renderTF(q) {
  const container = $('answers-container');
  container.className = 'tf-options';
  container.innerHTML = `
    <button class="tf-option true-opt" onclick="selectAnswer(true)">✅ Туура</button>
    <button class="tf-option false-opt" onclick="selectAnswer(false)">❌ Жалган</button>`;
}

/* ═══ SELECT ANSWER ═══ */
window.selectAnswer = function(value) {
  if (answered) return;
  selectedAnswer = value;
  const q = questions[currentIndex];

  if (q.type === 'mc') {
    document.querySelectorAll('.answer-option').forEach((el, i) => {
      el.classList.toggle('selected', i === value);
    });
  } else {
    document.querySelectorAll('.tf-option').forEach(el => {
      el.classList.remove('selected');
    });
    const btn = value === true
      ? document.querySelector('.true-opt')
      : document.querySelector('.false-opt');
    if (btn) btn.classList.add('selected');
  }

  const checkBtn = $('check-btn');
  if (checkBtn) {
    checkBtn.disabled = false;
    checkBtn.className = 'btn btn-green btn-full btn-lg';
    checkBtn.textContent = 'Текшерүү';
  }
};

/* ═══ CHECK ANSWER ═══ */
window.checkAnswer = function() {
  if (answered || selectedAnswer === null) return;
  answered = true;

  const q       = questions[currentIndex];
  const correct = q.a === selectedAnswer;

  if (correct) {
    score++;
    xpEarned += getQXP();
    playSound('correct');
    showFeedback(true, q.explain);
    markAnswerUI(true, q);
  } else {
    mistakes++;
    const remaining = Store.loseHeart();
    hearts = remaining;
    renderHearts();
    playSound('wrong');
    showFeedback(false, q.explain);
    markAnswerUI(false, q);
    if (hearts <= 0) {
      setTimeout(() => showNoHearts(), 1500);
      return;
    }
  }
};

function markAnswerUI(correct, q) {
  if (q.type === 'mc') {
    document.querySelectorAll('.answer-option').forEach((el, i) => {
      if (i === q.a) el.classList.add('correct');
      else if (el.classList.contains('selected') && !correct) el.classList.add('wrong');
      el.onclick = null;
    });
  } else {
    document.querySelectorAll('.tf-option').forEach(el => {
      const isCorrect = (el.classList.contains('true-opt') && q.a === true) ||
                        (el.classList.contains('false-opt') && q.a === false);
      if (isCorrect) el.classList.add('correct');
      else if (el.classList.contains('selected') && !correct) el.classList.add('wrong');
      el.onclick = null;
    });
  }
}

/* ═══ FEEDBACK BAR ═══ */
function showFeedback(correct, explain) {
  const bar = $('feedback-bar');
  if (!bar) return;
  bar.className = `feedback-bar ${correct ? 'correct-bar' : 'wrong-bar'}`;
  bar.innerHTML = `
    <div class="feedback-inner">
      <div class="feedback-icon">${correct ? '✅' : '❌'}</div>
      <div>
        <div class="feedback-title ${correct ? 'feedback-correct-title' : 'feedback-wrong-title'}">
          ${correct ? 'Кемчилсиз!' : 'Туура жооп:'}
        </div>
        ${!correct && explain ? `<div class="feedback-detail">${explain}</div>` : ''}
        ${correct && explain ? `<div class="feedback-detail" style="color:var(--green);opacity:0.8">${explain}</div>` : ''}
      </div>
      <button class="btn btn-${correct ? 'green' : 'red'} btn-sm feedback-btn" onclick="nextQuestion()">
        Улантуу →
      </button>
    </div>`;
  requestAnimationFrame(() => bar.classList.add('show'));

  // Also update check button
  const checkBtn = $('check-btn');
  if (checkBtn) checkBtn.style.visibility = 'hidden';
}

function hideFeedback() {
  const bar = $('feedback-bar');
  if (bar) { bar.classList.remove('show'); bar.innerHTML = ''; }
  const checkBtn = $('check-btn');
  if (checkBtn) checkBtn.style.visibility = 'visible';
}

/* ═══ NEXT QUESTION ═══ */
window.nextQuestion = function() {
  hideFeedback();
  currentIndex++;
  updateProgress();
  setTimeout(renderQuestion, 200);
};

/* ═══ NO HEARTS SCREEN ═══ */
function showNoHearts() {
  const overlay = $('overlay-screen');
  if (!overlay) return;
  overlay.innerHTML = `
    <div style="text-align:center;padding:40px 20px;max-width:360px;margin:auto">
      <div style="font-size:4rem;margin-bottom:16px">💔</div>
      <h2 style="font-size:1.8rem;font-weight:900;margin-bottom:8px">Жүрөгүң бүттү!</h2>
      <p style="color:var(--muted);font-weight:600;margin-bottom:32px">Жүрөктөрдү дүкөндөн алып, кайра кел!</p>
      <div style="display:flex;flex-direction:column;gap:12px">
        <a href="/shop.html?refill=1" class="btn btn-red btn-full btn-lg">❤️ Жүрөк толтур — 350💎</a>
        <a href="/learn.html" class="btn btn-ghost btn-full">Жолго кайт</a>
      </div>
    </div>`;
  overlay.style.display = 'flex';
}

/* ═══ COMPLETION SCREEN ═══ */
async function showCompletion() {
  const elapsed = Math.round((Date.now() - startTime) / 1000);
  const accuracy = Math.round((score / questions.length) * 100);
  const perfect  = mistakes === 0;
  const baseXP   = lessonData.lesson.xp || 50;
  const bonusXP  = perfect ? 25 : 0;
  const totalXP  = (xpEarned + baseXP + bonusXP) * (xpBoostActive ? 2 : 1);
  const gemBonus = Math.floor(totalXP / 10);

  playSound('complete');
  fireConfetti();

  await Store.addXP(totalXP, lessonData.lesson.id, perfect);

  const screen = $('completion-screen');
  if (!screen) return;
  screen.innerHTML = `
    <div class="completion-trophy animate-scaleIn">
      ${perfect ? '🏆' : accuracy >= 70 ? '⭐' : '📚'}
    </div>
    <h1 class="completion-title animate-slideUp">
      ${perfect ? 'Кемчилсиз!' : accuracy >= 70 ? 'Жакшы иш!' : 'Аяктадың!'}
    </h1>
    <p class="completion-subtitle animate-slideUp">
      ${lessonData.lesson.title} сабагы аяктады
    </p>
    <div class="completion-stats">
      <div class="completion-stat animate-scaleIn" style="animation-delay:.1s">
        <div class="completion-stat-value xp-gained">+${totalXP}</div>
        <div class="completion-stat-label">⭐ XP</div>
      </div>
      <div class="completion-stat animate-scaleIn" style="animation-delay:.2s">
        <div class="completion-stat-value accuracy">${accuracy}%</div>
        <div class="completion-stat-label">🎯 Тактык</div>
      </div>
      <div class="completion-stat animate-scaleIn" style="animation-delay:.3s">
        <div class="completion-stat-value time-taken">${formatTime(elapsed)}</div>
        <div class="completion-stat-label">⏱️ Убакыт</div>
      </div>
      <div class="completion-stat animate-scaleIn" style="animation-delay:.4s">
        <div class="completion-stat-value" style="color:var(--blue)">+${gemBonus}</div>
        <div class="completion-stat-label">💎 Жем</div>
      </div>
    </div>
    ${perfect ? `<div class="badge badge-yellow animate-fadeIn" style="margin-bottom:16px;font-size:.9rem">✨ Кемчилсиз өттүң! +25 XP бонус</div>` : ''}
    <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
      <a href="/learn.html" class="btn btn-green btn-lg">Жолго кайт 🗺️</a>
      <button onclick="retryLesson()" class="btn btn-ghost">Кайта жаса 🔄</button>
    </div>`;
  screen.classList.add('show');
}

window.retryLesson = function() {
  location.reload();
};

window.confirmExit = function() {
  if (currentIndex === 0 || confirm('Сабактан чыгасыңбы? Прогресс сакталбайт.')) {
    window.location.href = '/learn.html';
  }
};

/* ═══ HELPERS ═══ */
function getQXP() { return xpBoostActive ? 20 : 10; }

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}м ${sec}с` : `${sec}с`;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ═══ START ═══ */
document.addEventListener('DOMContentLoaded', async () => {
  Store.loadCache();
  await init();
  startHeartRegen();
});

})();
