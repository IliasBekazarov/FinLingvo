// FinLingvo — app.js
// Негизги колдонмо логикасы

const APP = {
  // Тыбыш системасы
  audio: {
    ctx: null,
    enabled: true,

    init() {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {}
    },

    play(type) {
      if (!this.enabled || !this.ctx) return;
      const user = AUTH.getUser();
      if (user && user.settings && !user.settings.sound) return;

      try {
        const oscillator = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        switch(type) {
          case 'correct':
            oscillator.frequency.setValueAtTime(523, this.ctx.currentTime);
            oscillator.frequency.setValueAtTime(659, this.ctx.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(784, this.ctx.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.3, this.ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
            oscillator.start(this.ctx.currentTime);
            oscillator.stop(this.ctx.currentTime + 0.4);
            break;
          case 'wrong':
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(200, this.ctx.currentTime);
            oscillator.frequency.setValueAtTime(150, this.ctx.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
            oscillator.start(this.ctx.currentTime);
            oscillator.stop(this.ctx.currentTime + 0.3);
            break;
          case 'levelup':
            [523, 659, 784, 1047].forEach((freq, i) => {
              const osc = this.ctx.createOscillator();
              const g = this.ctx.createGain();
              osc.connect(g);
              g.connect(this.ctx.destination);
              osc.frequency.value = freq;
              g.gain.setValueAtTime(0.3, this.ctx.currentTime + i * 0.15);
              g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.15 + 0.3);
              osc.start(this.ctx.currentTime + i * 0.15);
              osc.stop(this.ctx.currentTime + i * 0.15 + 0.3);
            });
            break;
          case 'click':
            oscillator.frequency.value = 800;
            gainNode.gain.setValueAtTime(0.1, this.ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
            oscillator.start(this.ctx.currentTime);
            oscillator.stop(this.ctx.currentTime + 0.05);
            break;
          case 'complete':
            [784, 988, 1175, 1568].forEach((freq, i) => {
              const osc = this.ctx.createOscillator();
              const g = this.ctx.createGain();
              osc.connect(g);
              g.connect(this.ctx.destination);
              osc.frequency.value = freq;
              g.gain.setValueAtTime(0.25, this.ctx.currentTime + i * 0.12);
              g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.12 + 0.3);
              osc.start(this.ctx.currentTime + i * 0.12);
              osc.stop(this.ctx.currentTime + i * 0.12 + 0.4);
            });
            break;
        }
      } catch (e) {}
    }
  },

  // Конфетти анимациясы
  confetti: {
    canvas: null,
    ctx: null,
    particles: [],
    animFrame: null,

    start() {
      this.canvas = document.getElementById('confetti-canvas');
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'confetti-canvas';
        this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
        document.body.appendChild(this.canvas);
      }
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];

      const colors = ['#58CC02', '#FFD900', '#1CB0F6', '#FF4B4B', '#FF9600', '#9B59B6', '#ffffff'];
      for (let i = 0; i < 150; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: -10,
          w: Math.random() * 12 + 6,
          h: Math.random() * 6 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: Math.random() * 4 + 2,
          angle: Math.random() * 360,
          spin: (Math.random() - 0.5) * 8,
          dx: (Math.random() - 0.5) * 3
        });
      }
      this.animate();
      setTimeout(() => this.stop(), 4000);
    },

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.forEach(p => {
        p.y += p.speed;
        p.x += p.dx;
        p.angle += p.spin;
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.angle * Math.PI / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        this.ctx.restore();
      });
      this.particles = this.particles.filter(p => p.y < this.canvas.height + 20);
      if (this.particles.length > 0) {
        this.animFrame = requestAnimationFrame(() => this.animate());
      } else {
        this.stop();
      }
    },

    stop() {
      if (this.animFrame) cancelAnimationFrame(this.animFrame);
      if (this.canvas) {
        this.canvas.style.opacity = '0';
        this.canvas.style.transition = 'opacity 0.5s';
        setTimeout(() => {
          if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
          }
        }, 500);
      }
    }
  },

  // Toast билдирүүлөр
  toast: {
    show(message, type = 'info', duration = 3000) {
      const existing = document.querySelector('.fl-toast');
      if (existing) existing.remove();

      const colors = {
        success: 'from-green-500 to-green-600',
        error: 'from-red-500 to-red-600',
        info: 'from-blue-500 to-blue-600',
        warning: 'from-yellow-500 to-yellow-600',
        xp: 'from-purple-500 to-purple-600'
      };

      const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️', xp: '⭐' };

      const toast = document.createElement('div');
      toast.className = `fl-toast fixed top-6 left-1/2 transform -translate-x-1/2 z-50
        px-6 py-3 rounded-2xl text-white font-bold text-sm shadow-2xl
        bg-gradient-to-r ${colors[type]}
        flex items-center gap-2 transition-all duration-300 translate-y-[-100px] opacity-0`;
      toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
      document.body.appendChild(toast);

      requestAnimationFrame(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
        toast.style.opacity = '1';
      });

      setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(-100px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
  },

  // Колдонуучу статусун жаңыртуу (header үчүн)
  updateHeaderStats() {
    const user = AUTH.getUser();
    if (!user) return;

    const xpEl = document.getElementById('stat-xp');
    const gemsEl = document.getElementById('stat-gems');
    const heartsEl = document.getElementById('stat-hearts');
    const streakEl = document.getElementById('stat-streak');

    if (xpEl) xpEl.textContent = user.xp;
    if (gemsEl) gemsEl.textContent = user.gems;
    if (heartsEl) heartsEl.textContent = user.hearts;
    if (streakEl) streakEl.textContent = user.streak;
  },

  // XP анимациясы
  animateXP(amount, element) {
    if (!element) return;
    const start = parseInt(element.textContent) || 0;
    const end = start + amount;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  },

  // Прогресс тилкесин жаңыртуу
  updateProgressBar(element, current, total) {
    if (!element) return;
    const pct = Math.round((current / total) * 100);
    element.style.width = pct + '%';
    element.setAttribute('aria-valuenow', pct);
  },

  // Анимация класстарын кошуу/алуу
  animate(element, className, duration = 600) {
    if (!element) return;
    element.classList.add(className);
    setTimeout(() => element.classList.remove(className), duration);
  },

  // Жооп туура болгондо анимация
  showCorrectFeedback(element, explanation) {
    APP.audio.play('correct');
    const feedback = document.getElementById('feedback-panel');
    if (feedback) {
      feedback.className = 'feedback-panel correct';
      document.getElementById('feedback-icon').textContent = '🎉';
      document.getElementById('feedback-title').textContent = 'Туура!';
      document.getElementById('feedback-text').textContent = explanation || 'Мыкты жооп бердиң!';
      document.getElementById('feedback-btn').textContent = 'УЛАНТУУ';
      document.getElementById('feedback-btn').className = 'feedback-btn correct-btn';
      feedback.style.display = 'flex';
      requestAnimationFrame(() => feedback.classList.add('visible'));
    }
  },

  // Жооп туура эмес болгондо анимация
  showWrongFeedback(correctAnswer, explanation) {
    APP.audio.play('wrong');
    const feedback = document.getElementById('feedback-panel');
    if (feedback) {
      feedback.className = 'feedback-panel wrong';
      document.getElementById('feedback-icon').textContent = '💔';
      document.getElementById('feedback-title').textContent = 'Туура эмес!';
      document.getElementById('feedback-text').textContent = explanation || `Туура жооп: ${correctAnswer}`;
      document.getElementById('feedback-btn').textContent = 'УЛАНТУУ';
      document.getElementById('feedback-btn').className = 'feedback-btn wrong-btn';
      feedback.style.display = 'flex';
      requestAnimationFrame(() => feedback.classList.add('visible'));
    }
  },

  // Урок маалыматтарын localStorage'га сактоо
  saveLessonState(state) {
    sessionStorage.setItem('fl_lesson', JSON.stringify(state));
  },

  getLessonState() {
    const data = sessionStorage.getItem('fl_lesson');
    return data ? JSON.parse(data) : null;
  },

  clearLessonState() {
    sessionStorage.removeItem('fl_lesson');
  },

  // Натыйжаны сактоо
  saveResult(data) {
    sessionStorage.setItem('fl_result', JSON.stringify(data));
  },

  getResult() {
    const data = sessionStorage.getItem('fl_result');
    return data ? JSON.parse(data) : null;
  },

  // Modulga байланыштуу сабакты табуу
  findLesson(lessonId) {
    for (const module of MODULES) {
      for (const lesson of module.lessons) {
        if (lesson.id === lessonId) {
          return { module, lesson };
        }
      }
    }
    return null;
  },

  // Сабак ачык болгонун текшерүү
  isLessonUnlocked(lessonId) {
    // Биринчи сабак дайыма ачык
    let prev = null;
    for (const module of MODULES) {
      for (const lesson of module.lessons) {
        if (lesson.id === lessonId) {
          if (!prev) return true;
          return AUTH.isLessonCompleted(prev);
        }
        prev = lesson.id;
      }
    }
    return false;
  },

  // Жалпы прогрессти эсептөө
  calculateTotalProgress() {
    const user = AUTH.getUser();
    if (!user) return 0;
    const total = MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
    const completed = Object.values(user.progress || {}).filter(p => p.completed).length;
    return Math.round((completed / total) * 100);
  },

  // Модуль прогрессин эсептөө
  calculateModuleProgress(moduleId) {
    const user = AUTH.getUser();
    if (!user) return { completed: 0, total: 0, pct: 0 };
    const module = MODULES.find(m => m.id === moduleId);
    if (!module) return { completed: 0, total: 0, pct: 0 };
    const total = module.lessons.length;
    const completed = module.lessons.filter(l => user.progress?.[l.id]?.completed).length;
    return { completed, total, pct: Math.round((completed / total) * 100) };
  },

  // Ар кандай беттер үчүн колдонуучу маалыматтарын рендер кылуу
  renderUserInfo(containerEl) {
    const user = AUTH.getUser();
    if (!user || !containerEl) return;
    const league = LEAGUES.find(l => l.id === user.league) || LEAGUES[0];
    containerEl.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg">${user.avatar}</div>
        <div>
          <div class="font-bold text-white">${user.name}</div>
          <div class="text-xs text-gray-400">${league.icon} ${league.name} Лигасы</div>
        </div>
      </div>
    `;
  },

  // Навигация активдүү линкин белгилөө
  setActiveNav(page) {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.remove('active');
      if (el.dataset.page === page) el.classList.add('active');
    });
  },

  // Колдонмону инициализация
  init() {
    this.audio.init();

    // Авторизация талап кылуучу беттер
    const protectedPages = ['learn.html', 'lesson.html', 'result.html', 'profile.html', 'leaderboard.html', 'shop.html', 'settings.html'];
    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage)) {
      AUTH.requireAuth();
    }

    // Жандарды авто-толтуруу
    const user = AUTH.getUser();
    if (user) {
      AUTH.refillHearts(user);
      AUTH.saveUser(user);
    }

    this.updateHeaderStats();
  }
};

// Беттин жүктөлүшүндө инициализация
document.addEventListener('DOMContentLoaded', () => {
  APP.init();
});
