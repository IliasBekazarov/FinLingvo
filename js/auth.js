// FinLingvo — auth.js
// Колдонуучу аутентификация жана маалыматтарын башкаруу

const AUTH = {
  // Демейки колдонуучу
  defaultUser: {
    name: "Жаңы Окуучу",
    email: "",
    avatar: "🦅",
    avatarId: "default",
    xp: 0,
    gems: 130,
    hearts: 5,
    maxHearts: 5,
    streak: 0,
    lastLoginDate: null,
    lastHeartRefill: null,
    league: "bronze",
    level: 1,
    achievements: [],
    progress: {},
    weeklyXP: 0,
    weeklyXPDate: null,
    createdAt: new Date().toISOString(),
    settings: {
      sound: true,
      notifications: true,
      dailyGoal: 10,
      language: "ky"
    },
    inventory: [],
    activeBoosts: []
  },

  // Колдонуучу маалыматтарын алуу
  getUser() {
    const data = localStorage.getItem('finlingvo_user');
    if (!data) return null;
    return JSON.parse(data);
  },

  // Колдонуучу маалыматтарын сактоо
  saveUser(user) {
    localStorage.setItem('finlingvo_user', JSON.stringify(user));
  },

  // Колдонуучу кирдиби?
  isLoggedIn() {
    return !!this.getUser();
  },

  // Каттоо
  register(name, email, password) {
    if (!name || !email || !password) {
      return { success: false, message: "Бардык талааларды толтуруңуз" };
    }
    if (password.length < 6) {
      return { success: false, message: "Сыр сөз кеминде 6 белгиден турушу керек" };
    }
    const user = {
      ...this.defaultUser,
      name,
      email,
      password: this.hashPassword(password),
      gems: 130,
      lastLoginDate: new Date().toDateString(),
      createdAt: new Date().toISOString()
    };
    this.saveUser(user);
    return { success: true, user };
  },

  // Кирүү
  login(email, password) {
    const user = this.getUser();
    if (!user) {
      return { success: false, message: "Аккаунт табылган жок" };
    }
    if (user.email !== email) {
      return { success: false, message: "Email туура эмес" };
    }
    if (user.password !== this.hashPassword(password)) {
      return { success: false, message: "Сыр сөз туура эмес" };
    }
    this.updateStreak(user);
    this.saveUser(user);
    return { success: true, user };
  },

  // Конок катары кирүү
  loginAsGuest() {
    const guestUser = {
      ...this.defaultUser,
      name: "Конок",
      email: "guest@finlingvo.kg",
      isGuest: true,
      lastLoginDate: new Date().toDateString()
    };
    this.saveUser(guestUser);
    return { success: true, user: guestUser };
  },

  // Чыгуу
  logout() {
    localStorage.removeItem('finlingvo_user');
    window.location.href = 'index.html';
  },

  // Streak жаңыртуу
  updateStreak(user) {
    const today = new Date().toDateString();
    const lastLogin = user.lastLoginDate;

    if (!lastLogin) {
      user.streak = 1;
    } else if (lastLogin === today) {
      // Бүгүн кирген — streak сакталат
    } else {
      const lastDate = new Date(lastLogin);
      const todayDate = new Date(today);
      const diffTime = todayDate - lastDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        // Streak freeze текшер
        const hasFreeze = user.inventory && user.inventory.includes('streak_freeze');
        if (hasFreeze) {
          user.inventory = user.inventory.filter(i => i !== 'streak_freeze');
        } else {
          user.streak = 1;
        }
      }
    }
    user.lastLoginDate = today;
    this.checkStreakAchievements(user);
  },

  // Жандарды жаңыртуу (убакытка жараша)
  refillHearts(user) {
    const now = new Date();
    const last = user.lastHeartRefill ? new Date(user.lastHeartRefill) : null;

    if (user.hearts < user.maxHearts) {
      if (!last) {
        user.hearts = user.maxHearts;
        user.lastHeartRefill = now.toISOString();
      } else {
        const diffMinutes = (now - last) / (1000 * 60);
        const heartsToAdd = Math.floor(diffMinutes / 30); // Ар 30 мүнөттөн 1 жан
        if (heartsToAdd > 0) {
          user.hearts = Math.min(user.maxHearts, user.hearts + heartsToAdd);
          user.lastHeartRefill = now.toISOString();
        }
      }
    }
    return user;
  },

  // XP кошуу
  addXP(amount) {
    const user = this.getUser();
    if (!user) return;

    // Boost текшер
    let multiplier = 1;
    if (user.activeBoosts) {
      const boost2x = user.activeBoosts.find(b => b.id === 'xp_boost_2x' && new Date(b.expires) > new Date());
      const boost3x = user.activeBoosts.find(b => b.id === 'xp_boost_3x' && new Date(b.expires) > new Date());
      if (boost3x) multiplier = 3;
      else if (boost2x) multiplier = 2;
    }

    const earned = amount * multiplier;
    user.xp += earned;

    // Жумалык XP
    const week = this.getWeekNumber();
    if (user.weeklyXPDate !== week) {
      user.weeklyXP = 0;
      user.weeklyXPDate = week;
    }
    user.weeklyXP += earned;

    // Деңгээл жаңыртуу
    user.level = this.calculateLevel(user.xp);

    // Лига жаңыртуу
    user.league = this.calculateLeague(user.xp);

    this.checkXPAchievements(user);
    this.saveUser(user);
    return earned;
  },

  // Gems кошуу
  addGems(amount) {
    const user = this.getUser();
    if (!user) return;
    user.gems += amount;
    this.saveUser(user);
  },

  // Жан жоготуу
  loseHeart() {
    const user = this.getUser();
    if (!user) return false;
    if (user.hearts > 0) {
      user.hearts -= 1;
      this.saveUser(user);
      return user.hearts;
    }
    return 0;
  },

  // Жандарды толтуруу (дүкөндөн)
  refillHeartsFromShop() {
    const user = this.getUser();
    if (!user) return false;
    if (user.gems < 350) return { success: false, message: "Gem жетишсиз" };
    user.gems -= 350;
    user.hearts = user.maxHearts;
    this.saveUser(user);
    return { success: true };
  },

  // Деңгээлди эсептөө
  calculateLevel(xp) {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  },

  // Лиганы эсептөө
  calculateLeague(xp) {
    for (let i = LEAGUES.length - 1; i >= 0; i--) {
      if (xp >= LEAGUES[i].minXP) return LEAGUES[i].id;
    }
    return 'bronze';
  },

  // Жума номери
  getWeekNumber() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7) + '-' + d.getFullYear();
  },

  // Прогрессти жаңыртуу
  updateProgress(lessonId, stars, perfect) {
    const user = this.getUser();
    if (!user) return;

    if (!user.progress[lessonId] || stars > (user.progress[lessonId].stars || 0)) {
      user.progress[lessonId] = {
        completed: true,
        stars,
        perfect,
        completedAt: new Date().toISOString()
      };
    }

    this.checkLessonAchievements(user, lessonId, perfect);
    this.saveUser(user);
  },

  // Сабак аяктадыбы?
  isLessonCompleted(lessonId) {
    const user = this.getUser();
    if (!user) return false;
    return !!(user.progress && user.progress[lessonId]?.completed);
  },

  // Кийинки сабак
  getNextLesson() {
    const user = this.getUser();
    if (!user) return null;

    for (const module of MODULES) {
      for (const lesson of module.lessons) {
        if (!this.isLessonCompleted(lesson.id)) {
          return { module, lesson };
        }
      }
    }
    return null;
  },

  // Сатып алуу
  purchaseItem(itemId) {
    const user = this.getUser();
    if (!user) return { success: false };

    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return { success: false, message: "Буюм табылган жок" };

    if (user.gems < item.price) {
      return { success: false, message: "Gem жетишсиз" };
    }

    user.gems -= item.price;

    // Буюмду колдонуу
    if (item.category === 'hearts' && item.id === 'heart_refill') {
      user.hearts = user.maxHearts;
    } else if (item.category === 'boosts') {
      const duration = item.id === 'xp_boost_2x' ? 30 : 15;
      if (!user.activeBoosts) user.activeBoosts = [];
      user.activeBoosts.push({
        id: item.id,
        expires: new Date(Date.now() + duration * 60 * 1000).toISOString()
      });
    } else if (item.category === 'streaks') {
      if (!user.inventory) user.inventory = [];
      user.inventory.push(item.id);
    } else if (item.category === 'avatars') {
      if (!user.inventory) user.inventory = [];
      user.inventory.push(item.id);
      user.avatar = item.icon;
      user.avatarId = item.id;
    }

    this.saveUser(user);
    return { success: true, item };
  },

  // Жетишкендиктерди текшерүү
  checkXPAchievements(user) {
    const xpMilestones = [
      { id: 'xp_100', threshold: 100 },
      { id: 'xp_1000', threshold: 1000 },
      { id: 'xp_5000', threshold: 5000 }
    ];
    xpMilestones.forEach(m => {
      if (user.xp >= m.threshold && !user.achievements.includes(m.id)) {
        user.achievements.push(m.id);
      }
    });
  },

  checkStreakAchievements(user) {
    const streakMilestones = [
      { id: 'streak_3', threshold: 3 },
      { id: 'streak_7', threshold: 7 },
      { id: 'streak_30', threshold: 30 }
    ];
    streakMilestones.forEach(m => {
      if (user.streak >= m.threshold && !user.achievements.includes(m.id)) {
        user.achievements.push(m.id);
      }
    });
  },

  checkLessonAchievements(user, lessonId, perfect) {
    const totalCompleted = Object.values(user.progress).filter(p => p.completed).length;

    if (totalCompleted === 1 && !user.achievements.includes('first_lesson')) {
      user.achievements.push('first_lesson');
    }
    if (perfect && !user.achievements.includes('perfect_lesson')) {
      user.achievements.push('perfect_lesson');
    }

    // Модуль аяктоо
    MODULES.forEach((m, idx) => {
      const allDone = m.lessons.every(l => user.progress[l.id]?.completed);
      const achId = `module_${idx + 1}`;
      if (allDone && !user.achievements.includes(achId)) {
        user.achievements.push(achId);
      }
    });

    // Баары аякталдыбы
    const allLessons = MODULES.flatMap(m => m.lessons);
    const allDone = allLessons.every(l => user.progress[l.id]?.completed);
    if (allDone && !user.achievements.includes('all_modules')) {
      user.achievements.push('all_modules');
    }
  },

  // Жөнөкөй hash (демо үчүн)
  hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  },

  // Авторизация текшерүү (бардык беттер үчүн)
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  },

  // Колдонуучу профилин жаңыртуу
  updateProfile(data) {
    const user = this.getUser();
    if (!user) return;
    Object.assign(user, data);
    this.saveUser(user);
  }
};
