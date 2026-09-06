// Shrimp — app logic: progress, belt path, unit learn screens, lessons, stripes,
// daily goal, login streak, and weak-spot practice.

const STORAGE_KEY = "shrimp_progress_v1";
const START_HEARTS = 3; // 4 questions per lesson: miss 3 and you retry
const GOAL_OPTIONS = [
  { xp: 10, name: "Casual" },
  { xp: 20, name: "Regular" },
  { xp: 40, name: "Serious" },
];
const PRACTICE_SIZE = 8;
// Preview hosts (the claude.ai artifact viewer) forbid embedded frames, so YouTube can't load there.
const EMBEDS_BLOCKED = /claude\.ai$|claudeusercontent\.com$|\.claude\.com$/i.test(location.hostname) || location.protocol === "blob:";

const $ = (id) => document.getElementById(id);
const els = {
  viewPath: $("view-path"), viewLearn: $("view-learn"), viewLesson: $("view-lesson"),
  viewComplete: $("view-complete"), viewFailed: $("view-failed"),
  brandMark: $("brand-mark"), statStreak: $("stat-streak"), statXp: $("stat-xp"),
  beltCard: $("belt-card"), todayCard: $("today-card"), practiceCard: $("practice-card"), pathContainer: $("path-container"),
  learnBack: $("learn-back"), learnEyebrow: $("learn-eyebrow"), learnHeading: $("learn-heading"),
  learnBeltChip: $("learn-belt-chip"), learnBody: $("learn-body"), learnStart: $("learn-start"), learnNote: $("learn-note"),
  lessonClose: $("lesson-close"), lessonProgress: $("lesson-progress"), lessonHearts: $("lesson-hearts"),
  questionContainer: $("question-container"), feedbackBanner: $("feedback-banner"), feedbackText: $("feedback-text"),
  actionBtn: $("action-btn"),
  completeMascot: $("complete-mascot"), completeEyebrow: $("complete-eyebrow"), completeTitle: $("complete-title"),
  completeStripe: $("complete-stripe"), completeGoal: $("complete-goal"), completeXp: $("complete-xp"), completeAccuracy: $("complete-accuracy"),
  completeContinue: $("complete-continue"),
  failedMascot: $("failed-mascot"), failedRetry: $("failed-retry"), failedLearn: $("failed-learn"),
  soundBtn: $("sound-btn"), accountBtn: $("account-btn"),
  viewAccount: $("view-account"), accountBack: $("account-back"), accountHeading: $("account-heading"), accountBody: $("account-body"),
  toast: $("toast"),
  streakOverlay: $("streak-overlay"), streakConfetti: $("streak-confetti"), streakMascot: $("streak-mascot"),
  streakFlame: $("streak-flame"), streakNumber: $("streak-number"), streakTitle: $("streak-title"),
  streakMsg: $("streak-msg"), streakWeek: $("streak-week"), streakContinue: $("streak-continue"),
};

// ---------- Dates ----------

const pad2 = (n) => String(n).padStart(2, "0");
function localDate(offsetDays = 0) {
  const d = new Date(Date.now() - offsetDays * 86400000);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
const today = () => localDate(0);

// ---------- Progress ----------

function loadProgress() {
  let p = {};
  try { p = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {}; } catch (e) { p = {}; }
  const progress = {
    xp: p.xp || 0,
    completed: p.completed || {},     // lessonId -> stars 1-3
    watched: p.watched || {},         // videoId -> true
    learnSeen: p.learnSeen || {},     // unitId -> true
    dailyGoal: GOAL_OPTIONS.some((g) => g.xp === p.dailyGoal) ? p.dailyGoal : 20,
    dailyXp: p.dailyXp && p.dailyXp.date ? p.dailyXp : { date: today(), xp: 0 },
    activeDays: p.activeDays || {},   // "YYYY-MM-DD" -> true (opened the app)
    goalDays: p.goalDays || {},       // "YYYY-MM-DD" -> true (hit the daily goal)
    misses: p.misses || {},           // questionId -> how many times missed, net of correct answers
  };
  // Migrate the old counter-based streak: credit the last recorded day as active.
  if (p.lastPlayedDate && !progress.activeDays[p.lastPlayedDate]) progress.activeDays[p.lastPlayedDate] = true;
  return progress;
}
function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (e) { /* private mode */ }
  if (typeof Cloud !== "undefined" && Cloud.currentUser()) {
    Cloud.schedulePush(() => ({ progress, summary: { xp: progress.xp, streak: streak() } }));
  }
}
let progress = loadProgress();

// Login streak: consecutive days, ending today, on which the app was opened.
// Returns true the first time the app is opened on a given day.
function markActiveToday() {
  const t = today();
  if (progress.dailyXp.date !== t) progress.dailyXp = { date: t, xp: 0 };
  const newDay = !progress.activeDays[t];
  progress.activeDays[t] = true;
  saveProgress();
  return newDay;
}
function streak() {
  let n = 0;
  while (progress.activeDays[localDate(n)]) n++;
  return n;
}
function todayXp() { return progress.dailyXp.date === today() ? progress.dailyXp.xp : 0; }
function goalMetToday() { return !!progress.goalDays[today()]; }

// Award XP and report whether this award crossed the daily goal line.
function awardXp(xp) {
  const t = today();
  if (progress.dailyXp.date !== t) progress.dailyXp = { date: t, xp: 0 };
  progress.xp += xp;
  progress.dailyXp.xp += xp;
  let goalJustMet = false;
  if (progress.dailyXp.xp >= progress.dailyGoal && !progress.goalDays[t]) {
    progress.goalDays[t] = true;
    goalJustMet = true;
  }
  return goalJustMet;
}

// ---------- Curriculum helpers ----------

const FLAT = [];
CURRICULUM.forEach((belt) => belt.units.forEach((unit) => unit.lessons.forEach((lesson) => {
  FLAT.push({ belt, unit, lesson });
})));
const flatIndex = (lessonId) => FLAT.findIndex((f) => f.lesson.id === lessonId);
const isLessonDone = (lessonId) => !!progress.completed[lessonId];
function isLessonUnlocked(lessonId) {
  const i = flatIndex(lessonId);
  return i <= 0 || isLessonDone(FLAT[i - 1].lesson.id);
}
const isUnitComplete = (unit) => unit.lessons.every((l) => isLessonDone(l.id));
const isUnitUnlocked = (unit) => isLessonUnlocked(unit.lessons[0].id);
const unitsDone = (belt) => { let n = 0; for (const u of belt.units) { if (isUnitComplete(u)) n++; else break; } return n; };
const beltStripes = (belt) => belt.stripeAfterUnits.filter((t) => unitsDone(belt) >= t).length;
const isBeltComplete = (belt) => unitsDone(belt) === belt.units.length;
const currentBelt = () => CURRICULUM.find((b) => !isBeltComplete(b)) || CURRICULUM[CURRICULUM.length - 1];
function currentLesson() {
  return FLAT.find((x) => !isLessonDone(x.lesson.id) && isLessonUnlocked(x.lesson.id)) || null;
}
const ORDINALS = ["first", "second", "third", "fourth"];

function nextMilestone(belt) {
  const done = unitsDone(belt);
  const t = belt.stripeAfterUnits.find((n) => n > done);
  const targetUnits = t || belt.units.length;
  let lessonsLeft = 0;
  belt.units.slice(0, targetUnits).forEach((u) => u.lessons.forEach((l) => { if (!isLessonDone(l.id)) lessonsLeft++; }));
  const label = t ? `your ${ORDINALS[belt.stripeAfterUnits.indexOf(t)]} stripe` : "your promotion";
  return { lessonsLeft, label };
}

// Weak spots: questions from completed lessons, with the ones you've missed first.
const questionId = (lesson, i) => `${lesson.id}:${i}`;
function practicePool() {
  const pool = [];
  FLAT.forEach((f) => {
    if (!isLessonDone(f.lesson.id)) return;
    f.lesson.questions.forEach((q, i) => pool.push({ q, qid: questionId(f.lesson, i), lesson: f.lesson }));
  });
  return pool;
}
const weakCount = () => practicePool().filter((p) => (progress.misses[p.qid] || 0) > 0).length;
function pickPractice() {
  const pool = practicePool();
  const weak = pool.filter((p) => (progress.misses[p.qid] || 0) > 0)
    .sort((a, b) => (progress.misses[b.qid] || 0) - (progress.misses[a.qid] || 0));
  const rest = shuffle(pool.filter((p) => !((progress.misses[p.qid] || 0) > 0)));
  return [...weak.slice(0, PRACTICE_SIZE), ...rest].slice(0, PRACTICE_SIZE);
}

// ---------- Path ----------

function beltChip(belt) {
  return `<span class="swatch" style="background:${belt.swatch}; border-color:${belt.swatchEdge};"></span>${belt.name}`;
}

function renderBeltCard() {
  const belt = currentBelt();
  const stripes = beltStripes(belt);
  const ms = nextMilestone(belt);
  const note = isBeltComplete(belt)
    ? "Every unit complete. More belts are on the way."
    : `${ms.lessonsLeft} lesson${ms.lessonsLeft === 1 ? "" : "s"} to ${ms.label}`;
  els.beltCard.innerHTML = `
    <div class="belt-card-head"><h2>${belt.name}</h2><span class="stripes-label">${stripes} of 4 stripes</span></div>
    ${Brand.belt({ color: belt.color, stripes })}
    <div class="belt-card-note">${note}</div>`;
}

// The last seven days as dots: coral = opened the app, green = hit the goal, ring = today.
function weekStrip() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = localDate(i);
    const dt = new Date(Date.now() - i * 86400000);
    const letter = "SMTWTFS"[dt.getDay()];
    const cls = ["day", progress.activeDays[d] ? "active" : "", progress.goalDays[d] ? "goal" : "", i === 0 ? "today" : ""].filter(Boolean).join(" ");
    days.push(`<div class="${cls}" style="--i:${6 - i}" title="${d}"><span class="dot">${progress.goalDays[d] ? Brand.icons.check : ""}</span><span class="letter">${letter}</span></div>`);
  }
  return days.join("");
}

// ---------- Streak celebration ----------

function streakCopy(n) {
  if (n === 1) return { title: "day streak", msg: "Every streak starts with day one. Come back tomorrow and Shrimp will be waiting." };
  if (n < 7) return { title: "day streak", msg: [`Two days. That's a habit forming.`, `Three days in. Most people never make it here.`, `Four days. The mat misses you when you're gone.`, `Five days. You're the consistent one now.`, `Six days. One more for a full week.`][n - 2] };
  if (n === 7) return { title: "One full week", msg: "Seven days straight. That's the hardest week in jiu-jitsu, and you just did it in here too.", milestone: true };
  if (n === 30) return { title: "One month", msg: "Thirty days in a row. Coaches notice the people who keep showing up. So does Shrimp.", milestone: true };
  if (n === 100) return { title: "One hundred days", msg: "A hundred days. You've built the kind of consistency belts are made of.", milestone: true };
  if (n % 30 === 0) return { title: `${n / 30} months`, msg: `${n} days without a miss. That's not a streak anymore, that's who you are.`, milestone: true };
  if (n % 7 === 0) return { title: `${n / 7} weeks`, msg: `${n} days straight. Another full week on the mat.`, milestone: true };
  return { title: "day streak", msg: `${n} days and counting. Keep the chain going.` };
}

function spawnConfetti(count) {
  const colors = ["#EF6A4D", "#3AA6B9", "#3FB26A", "#2C6FD1", "#F6F3EC", "#F9A08B"];
  let html = "";
  for (let i = 0; i < count; i++) {
    const left = Math.random() * 100;
    const x = (Math.random() * 160 - 80).toFixed(0) + "px";
    const r = (Math.random() * 720 - 360).toFixed(0) + "deg";
    const d = (2.2 + Math.random() * 1.6).toFixed(2) + "s";
    const delay = (Math.random() * 0.9).toFixed(2) + "s";
    const c = colors[i % colors.length];
    const w = 7 + Math.round(Math.random() * 6), h = 10 + Math.round(Math.random() * 8);
    html += `<i style="left:${left}%; background:${c}; width:${w}px; height:${h}px; --x:${x}; --r:${r}; --d:${d}; --delay:${delay}"></i>`;
  }
  els.streakConfetti.innerHTML = html;
}

function showStreakCelebration(n) {
  const copy = streakCopy(n);
  const belt = currentBelt();
  els.streakOverlay.classList.toggle("milestone", !!copy.milestone);
  els.streakMascot.innerHTML = Brand.mascot({ size: 180, stripes: beltStripes(belt), belt: belt.color, mood: copy.milestone ? "excited" : "happy" });
  els.streakFlame.innerHTML = Brand.icons.flame;
  els.streakTitle.textContent = copy.title;
  els.streakMsg.textContent = copy.msg;
  els.streakWeek.innerHTML = weekStrip();
  els.streakContinue.textContent = n === 1 ? "Let's roll" : copy.milestone ? "Oss!" : "Keep it going";
  spawnConfetti(copy.milestone ? 90 : n >= 3 ? 24 : 0);
  els.streakOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  // Roll the number up, ticking as it goes.
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const steps = reduced ? 1 : Math.min(n, 24);
  let i = 0;
  els.streakNumber.textContent = "0";
  const step = () => {
    i++;
    els.streakNumber.textContent = String(Math.round((n * i) / steps));
    if (i < steps) { if (i % 2 === 0) Sfx.play("tick"); setTimeout(step, 45); }
    else Sfx.play("streak", n);
  };
  setTimeout(step, 350);
}

function hideStreakCelebration() {
  els.streakOverlay.classList.add("hidden");
  els.streakConfetti.innerHTML = "";
  document.body.style.overflow = "";
}

function renderTodayCard() {
  const goal = progress.dailyGoal;
  const xp = todayXp();
  const pct = Math.min(100, Math.round((xp / goal) * 100));
  const met = goalMetToday();
  const goalName = (GOAL_OPTIONS.find((g) => g.xp === goal) || GOAL_OPTIONS[1]).name;
  const days = [weekStrip()];
  const s = streak();
  els.todayCard.innerHTML = `
    <div class="today-head">
      <div><div class="eyebrow">Today's goal</div><div class="today-xp"><strong>${xp}</strong> / ${goal} XP</div></div>
      <button class="goal-btn" id="goal-btn" aria-label="Change daily goal">${goalName}</button>
    </div>
    <div class="goal-track"><div class="goal-fill${met ? " met" : ""}" style="width:${pct}%"></div></div>
    <div class="today-foot">
      <div class="week">${days.join("")}</div>
      <div class="streak-note">${s === 0 ? "Start a streak today" : s === 1 ? "1 day streak" : `${s} day streak`}</div>
    </div>`;
  $("goal-btn").addEventListener("click", () => {
    const i = GOAL_OPTIONS.findIndex((g) => g.xp === progress.dailyGoal);
    progress.dailyGoal = GOAL_OPTIONS[(i + 1) % GOAL_OPTIONS.length].xp;
    if (todayXp() >= progress.dailyGoal) progress.goalDays[today()] = true;
    saveProgress();
    renderTodayCard();
  });
}

function renderPracticeCard() {
  const pool = practicePool();
  const weak = weakCount();
  const enabled = pool.length > 0;
  const sub = !enabled
    ? "Finish a lesson first and your misses will show up here."
    : weak > 0
      ? `${weak} question${weak === 1 ? "" : "s"} you've missed, plus a few you've learned.`
      : "Nothing missed right now. Review what you've learned.";
  els.practiceCard.innerHTML = `
    <button class="practice-card${enabled ? "" : " disabled"}" id="practice-btn" ${enabled ? "" : "disabled"}>
      <div class="practice-icon">${weak > 0 ? `<span class="badge">${weak}</span>` : ""}${Brand.icons.target}</div>
      <div class="practice-text"><div class="practice-title">Practice weak spots</div><div class="practice-sub">${sub}</div></div>
      <div class="practice-go">${Brand.icons.play}</div>
    </button>`;
  if (enabled) $("practice-btn").addEventListener("click", startPractice);
}

function renderPath() {
  els.statStreak.textContent = streak();
  els.statXp.textContent = progress.xp;
  renderBeltCard();
  renderTodayCard();
  renderPracticeCard();

  const cur = currentLesson();
  const frag = document.createDocumentFragment();

  CURRICULUM.forEach((belt, beltIdx) => {
    if (beltIdx > 0) {
      const div = document.createElement("div");
      div.className = "belt-divider";
      div.innerHTML = `<div class="belt-divider-line"></div><div class="belt-chip">${beltChip(belt)}</div><div class="belt-divider-line"></div>`;
      frag.appendChild(div);
    }

    belt.units.forEach((unit, unitIdx) => {
      const unlocked = isUnitUnlocked(unit);
      const section = document.createElement("section");
      section.className = "unit" + (unlocked ? "" : " locked");
      section.innerHTML = `<div class="unit-chip">Unit ${unitIdx + 1} · ${unit.title}</div>`;

      const nodes = document.createElement("div");
      nodes.className = "unit-nodes";
      nodes.innerHTML = `<svg class="unit-path" aria-hidden="true"></svg>`;

      const unitHasProgress = unit.lessons.some((l) => isLessonDone(l.id));
      const learnSeen = !!progress.learnSeen[unit.id];
      const learnCurrent = unlocked && !learnSeen && !unitHasProgress;
      const items = [{ kind: "learn" }, ...unit.lessons.map((l) => ({ kind: "lesson", lesson: l }))];

      items.forEach((item, i) => {
        const pos = ["c", "l", "c", "r"][i % 4];
        const row = document.createElement("div");
        row.className = `node-row ${pos}`;
        const wrap = document.createElement("div");
        wrap.className = "node-wrap";
        const btn = document.createElement("button");
        btn.className = "lesson-node";

        if (item.kind === "learn") {
          btn.classList.add("learn");
          btn.innerHTML = Brand.icons.video;
          btn.setAttribute("aria-label", `Learn: ${unit.title}`);
          if (!unlocked) { btn.classList.add("locked"); btn.disabled = true; btn.innerHTML = Brand.icons.lock; wrap.classList.add("locked"); }
          else { if (learnSeen) btn.classList.add("done"); if (learnCurrent) btn.classList.add("current"); btn.addEventListener("click", () => openLearn(unit)); }
          wrap.appendChild(btn);
          wrap.insertAdjacentHTML("beforeend", `<div class="node-label">Learn</div>`);
        } else {
          const l = item.lesson;
          const done = isLessonDone(l.id);
          const lUnlocked = isLessonUnlocked(l.id);
          const isCurrent = cur && cur.lesson.id === l.id;
          if (!lUnlocked) { btn.classList.add("locked"); btn.disabled = true; btn.innerHTML = Brand.icons.lock; wrap.classList.add("locked"); }
          else {
            btn.innerHTML = done ? Brand.icons.check : Brand.icons.play;
            if (done) btn.classList.add("done");
            if (isCurrent) btn.classList.add("current");
            btn.addEventListener("click", () => startLesson(l.id));
          }
          btn.setAttribute("aria-label", l.title);
          if (isCurrent) {
            const callout = document.createElement("div");
            callout.className = "callout";
            callout.innerHTML = `${Brand.mascot({ size: 54, stripes: beltStripes(belt), belt: belt.color })}<div class="callout-bubble">Up next: ${l.title}. ${l.questions.length} quick questions.</div>`;
            nodes.appendChild(callout);
          }
          wrap.appendChild(btn);
          wrap.insertAdjacentHTML("beforeend", `<div class="node-label">${l.title}</div>`);
          if (done) wrap.insertAdjacentHTML("beforeend", `<div class="node-stars">${Brand.icons.star.repeat(progress.completed[l.id])}</div>`);
        }
        row.appendChild(wrap);
        nodes.appendChild(row);
      });

      section.appendChild(nodes);
      frag.appendChild(section);
    });
  });

  const promo = document.createElement("div");
  promo.className = "promo-card";
  promo.innerHTML = `${Brand.mascot({ size: 72, stripes: 4, belt: "blue" })}<div><h3>Purple belt and beyond</h3><p>More belts arrive once white and blue are solid. Finish what's here and you'll be well ahead of your first year on the mats.</p></div>`;
  frag.appendChild(promo);

  els.pathContainer.innerHTML = "";
  els.pathContainer.appendChild(frag);
  requestAnimationFrame(drawConnectors);
}

function drawConnectors() {
  document.querySelectorAll(".unit-nodes").forEach((container) => {
    const svg = container.querySelector(".unit-path");
    const rect = container.getBoundingClientRect();
    if (!svg || rect.width === 0) return;
    const nodes = [...container.querySelectorAll(".lesson-node")];
    const pts = nodes.map((n) => {
      const r = n.getBoundingClientRect();
      return { x: r.left - rect.left + r.width / 2, y: r.top - rect.top + r.height / 2, done: n.classList.contains("done") };
    });
    svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
    let base = "", done = "";
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], my = (a.y + b.y) / 2;
      const d = `M${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y} `;
      base += d;
      if (a.done && b.done) done += d;
    }
    svg.innerHTML = `<path d="${base}" stroke="var(--line)" stroke-width="8" fill="none" stroke-linecap="round"/>` +
      (done ? `<path d="${done}" stroke="var(--teal)" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="1 14"/>` : "");
  });
}
window.addEventListener("resize", () => { if (!els.viewPath.classList.contains("hidden")) drawConnectors(); });

// ---------- Learn ----------

let learnUnit = null;
let learnPlaying = null;

function openLearn(unit) {
  learnUnit = unit;
  learnPlaying = null;
  progress.learnSeen[unit.id] = true;
  saveProgress();
  const belt = CURRICULUM.find((b) => b.units.includes(unit));
  const unitIdx = belt.units.indexOf(unit) + 1;
  els.learnEyebrow.textContent = `Unit ${unitIdx}`;
  els.learnHeading.textContent = unit.title;
  els.learnBeltChip.innerHTML = beltChip(belt);
  els.learnNote.textContent = `${unit.lessons.length} lessons · about ${unit.lessons.length * 3} minutes`;
  renderLearnBody();
  showView("learn");
}

function fmtDuration(sec) {
  if (!sec && sec !== 0) return "";
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function renderLearnBody() {
  const unit = learnUnit;
  const hasVideos = unit.videos && unit.videos.length > 0;
  let html = "";

  if (hasVideos) {
    html += `<p class="learn-intro">Watch these first. ${unit.videos.length} short video${unit.videos.length === 1 ? "" : "s"}, each under five minutes, then the lessons quiz you on them.</p>`;
    if (learnPlaying) {
      const v = unit.videos.find((x) => x.id === learnPlaying);
      const start = v && v.start ? `&start=${v.start}` : "";
      const watchUrl = `https://www.youtube.com/watch?v=${learnPlaying}${v && v.start ? `&t=${v.start}` : ""}`;
      if (EMBEDS_BLOCKED) {
        html += `<div class="video-player blocked"><div class="blocked-msg">${Brand.icons.video}<div><strong>Video can't play inside this preview.</strong><br>Open it on YouTube, or use the app at its own address.</div></div></div>`;
      } else {
        html += `<div class="video-player"><iframe src="https://www.youtube-nocookie.com/embed/${learnPlaying}?rel=0&modestbranding=1&playsinline=1${start}" title="${v ? v.title : "Video"}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
      }
      html += `<a class="open-youtube" href="${watchUrl}" target="_blank" rel="noopener">${EMBEDS_BLOCKED ? "Open on YouTube" : "Not playing? Open on YouTube"}${Brand.icons.external}</a>`;
    }
    html += `<div class="video-list">` + unit.videos.map((v) => `
      <button class="video-card" data-video="${v.id}">
        <div class="video-thumb"><img src="https://i.ytimg.com/vi/${v.id}/mqdefault.jpg" alt="" loading="lazy"><span class="play">${Brand.icons.play}</span>${v.duration ? `<span class="video-duration">${fmtDuration(v.duration)}</span>` : ""}</div>
        <div class="video-text"><div class="video-title">${v.title}</div><div class="video-channel">${v.channel || ""}</div></div>
        <div class="video-status${progress.watched[v.id] ? " watched" : ""}">${progress.watched[v.id] ? Brand.icons.check : ""}</div>
      </button>`).join("") + `</div>`;
  } else {
    html += `<p class="learn-intro">Short videos for this unit are being hand-picked, each under five minutes. Until then, here's what the lessons cover.</p>`;
    html += `<div class="video-list">` + unit.lessons.map((l) => `
      <div class="video-card placeholder">
        <div class="video-thumb">${Brand.icons.video.replace("<svg", '<svg width="26" height="26"')}</div>
        <div class="video-text"><div class="video-title">${l.title}</div><div class="video-channel">Video coming soon</div></div>
      </div>`).join("") + `</div>`;
  }

  html += `<div class="key-ideas"><h2>Key ideas</h2><ul>${unit.keyIdeas.map((k) => `<li>${k}</li>`).join("")}</ul></div>`;
  els.learnBody.innerHTML = html;

  els.learnBody.querySelectorAll(".video-card[data-video]").forEach((card) => {
    card.addEventListener("click", () => {
      learnPlaying = card.dataset.video;
      progress.watched[learnPlaying] = true;
      saveProgress();
      renderLearnBody();
      els.learnBody.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function startFromLearn() {
  const next = learnUnit.lessons.find((l) => !isLessonDone(l.id) && isLessonUnlocked(l.id));
  if (next) startLesson(next.id);
  else showView("path");
}

// ---------- Lesson & practice sessions ----------

let session = null;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// items: [{ q, qid }] -> prepared questions with shuffled choices
function prepareQuestions(items) {
  return items.map(({ q, qid }) => {
    if (q.type === "sequence") {
      return { qid, type: "sequence", prompt: q.prompt, steps: q.steps, poolOrder: shuffle(q.steps.map((_, i) => i)) };
    }
    const order = shuffle(q.choices.map((_, i) => i));
    return { qid, type: q.type, prompt: q.prompt, position: q.position, choices: order.map((i) => q.choices[i]), correctIndex: order.indexOf(q.answer) };
  });
}

function startLesson(lessonId) {
  const f = FLAT.find((x) => x.lesson.id === lessonId);
  if (!f) return;
  session = {
    mode: "lesson", lessonId, unit: f.unit, belt: f.belt,
    questions: prepareQuestions(f.lesson.questions.map((q, i) => ({ q, qid: questionId(f.lesson, i) }))),
    index: 0, hearts: START_HEARTS, mistakes: 0, correct: 0,
    answered: false, selected: null, seqAnswer: [],
    stripesBefore: beltStripes(f.belt), beltCompleteBefore: isBeltComplete(f.belt),
  };
  showView("lesson");
  renderQuestion();
}

function startPractice() {
  const items = pickPractice();
  if (!items.length) return;
  session = {
    mode: "practice", lessonId: null, unit: null, belt: currentBelt(),
    questions: prepareQuestions(items),
    index: 0, hearts: START_HEARTS, mistakes: 0, correct: 0,
    answered: false, selected: null, seqAnswer: [],
  };
  showView("lesson");
  renderQuestion();
}

function renderHearts() {
  if (session.mode === "practice") {
    els.lessonHearts.innerHTML = `<span class="practice-tag">${Brand.icons.target}Practice</span>`;
    return;
  }
  els.lessonHearts.innerHTML = Brand.icons.heart.repeat(session.hearts) + Brand.icons.heartOutline.repeat(START_HEARTS - session.hearts);
}

function renderQuestion() {
  const q = session.questions[session.index];
  els.lessonProgress.style.width = `${(session.index / session.questions.length) * 100}%`;
  renderHearts();
  els.feedbackBanner.classList.add("hidden");
  els.actionBtn.textContent = "Check";
  els.actionBtn.disabled = true;
  session.answered = false; session.selected = null; session.seqAnswer = [];

  const c = els.questionContainer;
  c.innerHTML = "";

  if (session.mode === "practice" && (progress.misses[q.qid] || 0) > 0) {
    c.insertAdjacentHTML("beforeend", `<div class="eyebrow weak">Weak spot</div>`);
  } else if (q.type === "position") {
    c.insertAdjacentHTML("beforeend", `<div class="eyebrow">Name the position</div>`);
  }
  c.insertAdjacentHTML("beforeend", `<div class="question-prompt">${q.prompt}</div>`);

  if (q.type === "position") {
    c.insertAdjacentHTML("beforeend", `<div class="illustration-card">${Figures.render(q.position)}
      <div class="legend"><span><i style="background:#EF6A4D"></i>You</span><span><i style="background:#1B2A3A"></i>Partner</span></div></div>`);
  }

  if (q.type === "mc" || q.type === "position") {
    const list = document.createElement("div");
    list.className = q.type === "position" ? "choice-grid" : "choice-list";
    q.choices.forEach((text, i) => {
      const b = document.createElement("button");
      b.className = "choice-btn";
      b.textContent = text;
      b.addEventListener("click", () => {
        if (session.answered) return;
        Sfx.play("tap");
        session.selected = i;
        list.querySelectorAll(".choice-btn").forEach((x) => x.classList.remove("selected"));
        b.classList.add("selected");
        els.actionBtn.disabled = false;
      });
      list.appendChild(b);
    });
    c.appendChild(list);
    return;
  }

  const answerBox = document.createElement("div");
  answerBox.className = "sequence-answer";
  const pool = document.createElement("div");
  pool.className = "sequence-pool";
  const renderSeq = () => {
    answerBox.innerHTML = "";
    if (session.seqAnswer.length === 0) {
      answerBox.innerHTML = `<div class="placeholder">Tap the steps below in the order they happen</div>`;
    } else {
      session.seqAnswer.forEach((stepIdx, pos) => {
        const item = document.createElement("button");
        item.className = "sequence-step";
        item.innerHTML = `<span class="step-num">${pos + 1}</span><span>${q.steps[stepIdx]}</span>`;
        item.addEventListener("click", () => { if (session.answered) return; session.seqAnswer.splice(pos, 1); renderSeq(); });
        answerBox.appendChild(item);
      });
    }
    pool.innerHTML = "";
    q.poolOrder.filter((i) => !session.seqAnswer.includes(i)).forEach((stepIdx) => {
      const item = document.createElement("button");
      item.className = "sequence-step";
      item.innerHTML = `<span>${q.steps[stepIdx]}</span>`;
      item.addEventListener("click", () => { if (session.answered) return; Sfx.play("tap"); session.seqAnswer.push(stepIdx); renderSeq(); });
      pool.appendChild(item);
    });
    els.actionBtn.disabled = session.seqAnswer.length !== q.steps.length;
  };
  renderSeq();
  c.appendChild(answerBox);
  c.appendChild(pool);
}

function recordResult(qid, correct) {
  const n = progress.misses[qid] || 0;
  if (correct) { if (n <= 1) delete progress.misses[qid]; else progress.misses[qid] = n - 1; }
  else progress.misses[qid] = n + 1;
}

function checkAnswer() {
  const q = session.questions[session.index];
  let correct;
  if (q.type === "sequence") {
    correct = session.seqAnswer.every((s, pos) => s === pos);
    els.questionContainer.querySelectorAll(".sequence-answer .sequence-step").forEach((item, pos) => {
      item.classList.add(session.seqAnswer[pos] === pos ? "correct-final" : "incorrect-final");
    });
  } else {
    correct = session.selected === q.correctIndex;
    els.questionContainer.querySelectorAll(".choice-btn").forEach((b, i) => {
      b.classList.add("disabled");
      if (i === q.correctIndex) b.classList.add("correct");
      else if (i === session.selected) b.classList.add("incorrect");
    });
  }
  session.answered = true;
  if (correct) session.correct++; else { session.mistakes++; if (session.mode === "lesson") session.hearts--; }
  recordResult(q.qid, correct);
  saveProgress();
  Sfx.play(correct ? "correct" : "wrong");

  els.feedbackBanner.classList.remove("hidden");
  els.feedbackBanner.classList.toggle("correct", correct);
  els.feedbackBanner.classList.toggle("incorrect", !correct);
  els.feedbackText.textContent = correct
    ? ["Nice.", "Oss.", "That's it.", "Clean."][Math.floor(Math.random() * 4)]
    : q.type === "sequence" ? "Not quite. The steps marked red are out of place." : "Not quite. The right answer is in green.";
  renderHearts();
  els.actionBtn.disabled = false;
  const last = session.index === session.questions.length - 1;
  els.actionBtn.textContent = session.mode === "lesson" && session.hearts <= 0 ? "Continue" : last ? "Finish" : "Continue";
}

function advance() {
  if (session.mode === "lesson" && session.hearts <= 0) {
    els.failedMascot.innerHTML = Brand.mascot({ size: 160, stripes: beltStripes(session.belt), belt: session.belt.color, mood: "sad" });
    showView("failed");
    Sfx.play("fail");
    return;
  }
  session.index++;
  if (session.index >= session.questions.length) {
    if (session.mode === "practice") finishPractice(); else finishLesson();
  } else renderQuestion();
}

function showGoalBanner(goalJustMet) {
  if (goalJustMet) {
    els.completeGoal.innerHTML = `${Brand.icons.flame}<div><strong>Daily goal reached.</strong> ${streak()} day streak and counting.</div>`;
    els.completeGoal.classList.remove("hidden");
  } else {
    const left = Math.max(0, progress.dailyGoal - todayXp());
    if (left > 0 && !goalMetToday()) {
      els.completeGoal.innerHTML = `${Brand.icons.target}<div>${left} XP to today's goal.</div>`;
      els.completeGoal.classList.remove("hidden");
    } else {
      els.completeGoal.classList.add("hidden");
    }
  }
}

function finishLesson() {
  els.lessonProgress.style.width = "100%";
  const total = session.questions.length;
  const accuracy = Math.round((session.correct / total) * 100);
  const stars = session.mistakes === 0 ? 3 : session.mistakes <= 2 ? 2 : 1;
  const xp = Math.max(10, 20 - session.mistakes * 3);

  progress.completed[session.lessonId] = Math.max(progress.completed[session.lessonId] || 0, stars);
  const goalJustMet = awardXp(xp);
  saveProgress();

  const belt = session.belt;
  const stripesNow = beltStripes(belt);
  const promoted = !session.beltCompleteBefore && isBeltComplete(belt);
  const earnedStripe = stripesNow > session.stripesBefore;
  const nextBelt = CURRICULUM[CURRICULUM.indexOf(belt) + 1];

  els.completeMascot.innerHTML = Brand.mascot({
    size: 160, stripes: promoted ? 0 : stripesNow,
    belt: promoted && nextBelt ? nextBelt.color : belt.color, mood: "excited",
  });
  els.completeEyebrow.textContent = promoted ? "Promotion" : earnedStripe ? "Stripe earned" : "Lesson complete";
  els.completeTitle.textContent = promoted
    ? `Welcome to ${nextBelt ? nextBelt.name.toLowerCase() : "the next level"}`
    : earnedStripe ? `Your ${ORDINALS[stripesNow - 1]} stripe` : ["Nice work", "Oss", "Keep rolling", "Good round"][Math.floor(Math.random() * 4)];

  if (promoted && nextBelt) {
    els.completeStripe.innerHTML = `<div>Every white belt unit done. ${nextBelt.name} unlocked.</div>${Brand.belt({ color: nextBelt.color, stripes: 0, width: "70%" })}`;
    els.completeStripe.classList.remove("hidden");
  } else if (earnedStripe) {
    els.completeStripe.innerHTML = `<div>${stripesNow} of 4 stripes on your ${belt.name.toLowerCase()}</div>${Brand.belt({ color: belt.color, stripes: stripesNow, width: "70%" })}`;
    els.completeStripe.classList.remove("hidden");
  } else {
    els.completeStripe.classList.add("hidden");
  }
  showGoalBanner(goalJustMet);

  els.completeXp.textContent = `+${xp}`;
  els.completeAccuracy.textContent = `${accuracy}%`;
  showView("complete");
  Sfx.play(promoted ? "promotion" : earnedStripe ? "stripe" : goalJustMet ? "goal" : "complete");
}

function finishPractice() {
  els.lessonProgress.style.width = "100%";
  const total = session.questions.length;
  const accuracy = Math.round((session.correct / total) * 100);
  const xp = 4 + session.correct * 2;
  const goalJustMet = awardXp(xp);
  saveProgress();

  const belt = session.belt;
  els.completeMascot.innerHTML = Brand.mascot({ size: 160, stripes: beltStripes(belt), belt: belt.color, mood: "excited" });
  els.completeEyebrow.textContent = "Practice complete";
  const remaining = weakCount();
  els.completeTitle.textContent = remaining === 0 ? "No weak spots left" : session.correct === total ? "Every one of them" : "Sharper than before";
  els.completeStripe.classList.toggle("hidden", remaining !== 0 && session.correct !== total);
  if (remaining === 0) els.completeStripe.innerHTML = `<div>You've cleared every question you'd missed. Come back after your next lesson.</div>`;
  else if (session.correct === total) els.completeStripe.innerHTML = `<div>${remaining} weak spot${remaining === 1 ? "" : "s"} still to clear.</div>`;
  showGoalBanner(goalJustMet);

  els.completeXp.textContent = `+${xp}`;
  els.completeAccuracy.textContent = `${accuracy}%`;
  showView("complete");
  Sfx.play(goalJustMet ? "goal" : "practice");
}

// ---------- Views ----------

function showView(name) {
  const map = { path: els.viewPath, learn: els.viewLearn, lesson: els.viewLesson, complete: els.viewComplete, failed: els.viewFailed, account: els.viewAccount };
  Object.entries(map).forEach(([k, el]) => el.classList.toggle("hidden", k !== name));
  window.scrollTo(0, 0);
  if (name === "path") renderPath();
}

// ---------- Wiring ----------

els.brandMark.innerHTML = `${Brand.mascot({ size: 34 })}<span>Shrimp</span>`;
$("icon-flame").innerHTML = Brand.icons.flame;
$("icon-star").innerHTML = Brand.icons.star;
els.learnBack.innerHTML = Brand.icons.back;
els.lessonClose.innerHTML = Brand.icons.close;

const fav = document.createElement("link");
fav.rel = "icon"; fav.type = "image/svg+xml"; fav.href = Brand.faviconHref();
document.head.appendChild(fav);

els.actionBtn.addEventListener("click", () => (session.answered ? advance() : checkAnswer()));
els.lessonClose.addEventListener("click", () => { session = null; showView("path"); });
els.learnBack.addEventListener("click", () => showView("path"));
els.learnStart.addEventListener("click", startFromLearn);
els.completeContinue.addEventListener("click", () => { session = null; showView("path"); });
els.failedRetry.addEventListener("click", () => { const id = session.lessonId; session = null; startLesson(id); });
els.failedLearn.addEventListener("click", () => { const u = session.unit; session = null; openLearn(u); });

// ---------- Toast ----------

let toastTimer = null;
function toast(msg, ms = 2600) {
  els.toast.textContent = msg;
  els.toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.add("hidden"), ms);
}

// ---------- Account & sync ----------

let profile = null;
let accountNote = null; // { text, kind }

function renderAccountBtn() {
  const configured = Cloud.isConfigured();
  els.accountBtn.classList.toggle("hidden", !configured);
  if (!configured) return;
  const u = Cloud.currentUser();
  els.accountBtn.innerHTML = Brand.icons.user;
  els.accountBtn.classList.toggle("signed-in", !!u);
  els.accountBtn.setAttribute("aria-label", u ? "Account: signed in" : "Account: save your progress");
}

function openAccount() { accountNote = null; renderAccount(); showView("account"); }

function fmtSince(ts) {
  if (!ts) return "not yet";
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function renderAccount() {
  const u = Cloud.currentUser();
  const belt = currentBelt();
  const mascot = `<div class="account-mascot">${Brand.mascot({ size: 120, stripes: beltStripes(belt), belt: belt.color })}</div>`;
  const note = accountNote ? `<div class="account-note ${accountNote.kind || ""}">${accountNote.kind === "ok" ? Brand.icons.check : accountNote.kind === "err" ? Brand.icons.close : Brand.icons.mail}<span>${accountNote.text}</span></div>` : "";

  if (!u) {
    els.accountHeading.textContent = "Save your progress";
    const providers = (CONFIG.providers || []).map((p) => `<button class="secondary-btn provider-btn" data-provider="${p}">${Brand.icons.user}Continue with ${p.charAt(0).toUpperCase() + p.slice(1)}</button>`).join("");
    els.accountBody.innerHTML = `
      <div class="account-card">
        ${mascot}
        <h2>Keep your streak on every device</h2>
        <p>Sign in and your belt, stripes, streak and weak spots are saved to your account and synced between your phone and any other device. No password: we email you a sign-in link.</p>
        <form id="email-form" class="field">
          <label for="email-input">Email</label>
          <input id="email-input" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com" required>
        </form>
        <button id="email-send" class="primary-btn teal" form="email-form">Email me a sign-in link</button>
        ${providers}
        ${note}
      </div>
      <div class="account-card">
        <h2>Nothing is lost either way</h2>
        <p>Everything you've done so far stays on this phone. When you sign in, it's merged with anything already in your account, and the higher score wins.</p>
      </div>`;
    const form = $("email-form");
    const send = async (e) => {
      if (e) e.preventDefault();
      const email = $("email-input").value.trim();
      if (!email) return;
      Sfx.play("tap");
      $("email-send").disabled = true;
      try {
        await Cloud.signInWithEmail(email);
        accountNote = { text: `Check ${email} for your sign-in link. Open it on this device.`, kind: "ok" };
      } catch (err) {
        accountNote = { text: err.message || "Couldn't send the link. Try again.", kind: "err" };
      }
      renderAccount();
    };
    form.addEventListener("submit", send);
    $("email-send").addEventListener("click", send);
    els.accountBody.querySelectorAll("[data-provider]").forEach((b) => b.addEventListener("click", async () => {
      try { await Cloud.signInWithProvider(b.dataset.provider); } catch (err) { accountNote = { text: err.message, kind: "err" }; renderAccount(); }
    }));
    return;
  }

  const st = Cloud.getStatus();
  els.accountHeading.textContent = "Your account";
  const syncText = st.error ? `Sync failed: ${st.error}` : st.pending ? "Syncing…" : `Synced ${fmtSince(st.lastSync)}`;
  els.accountBody.innerHTML = `
    <div class="account-card">
      ${mascot}
      <div class="account-row"><span>Signed in as</span><span class="muted">${u.email || u.id.slice(0, 8)}</span></div>
      <div class="account-note ${st.error ? "err" : "ok"}">${Brand.icons.cloud}<span>${syncText}</span></div>
      <div class="field-row">
        <div class="field"><label for="name-input">Display name</label><input id="name-input" maxlength="24" placeholder="What the leaderboard will call you" value="${(profile && profile.display_name) || ""}"></div>
        <button id="name-save" class="secondary-btn">Save</button>
      </div>
      ${note}
    </div>
    <div class="account-card">
      <div class="account-row"><span>Total XP</span><span>${progress.xp}</span></div>
      <div class="account-row"><span>Streak</span><span>${streak()} day${streak() === 1 ? "" : "s"}</span></div>
      <div class="account-row"><span>Lessons done</span><span>${Object.keys(progress.completed).length} of ${FLAT.length}</span></div>
    </div>
    <button id="sync-now" class="secondary-btn">Sync now</button>
    <button id="sign-out" class="secondary-btn danger-btn">Sign out</button>`;
  $("name-save").addEventListener("click", async () => {
    const name = $("name-input").value.trim();
    if (!name) return;
    try { await Cloud.setDisplayName(name); profile = { display_name: name }; accountNote = { text: "Name saved.", kind: "ok" }; }
    catch (err) { accountNote = { text: err.message, kind: "err" }; }
    renderAccount();
  });
  $("sync-now").addEventListener("click", async () => {
    try {
      const cloud = await Cloud.pull();
      progress = Cloud.merge(progress, cloud);
      await Cloud.push(progress, { xp: progress.xp, streak: streak() });
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (e) { /* ignore */ }
      accountNote = { text: "Everything is up to date.", kind: "ok" };
    } catch (err) { accountNote = { text: err.message, kind: "err" }; }
    renderAccount();
  });
  $("sign-out").addEventListener("click", async () => {
    await Cloud.signOut();
    profile = null;
    toast("Signed out. Your progress stays on this device.");
    showView("path");
  });
}

// When someone signs in, merge the cloud copy with what's on this device, save, and push.
async function onSignedIn() {
  try {
    const cloud = await Cloud.pull();
    const before = progress.xp;
    progress = Cloud.merge(progress, cloud);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (e) { /* ignore */ }
    await Cloud.push(progress, { xp: progress.xp, streak: streak() });
    profile = await Cloud.getProfile();
    toast(cloud && progress.xp > before ? "Signed in. Progress merged from your account." : "Signed in. Your progress is now saved to your account.");
  } catch (err) {
    toast("Signed in, but sync failed. We'll retry.");
  }
  renderAccountBtn();
  if (!els.viewPath.classList.contains("hidden")) renderPath();
  if (!els.viewAccount.classList.contains("hidden")) renderAccount();
}

if (Cloud.init()) {
  Cloud.subscribe((u, event) => {
    renderAccountBtn();
    if (u && (event === "SIGNED_IN" || event === "INITIAL")) onSignedIn();
    else if (event === "SYNC" && !els.viewAccount.classList.contains("hidden")) renderAccount();
  });
}
renderAccountBtn();
els.accountBtn.addEventListener("click", openAccount);
els.accountBack.innerHTML = Brand.icons.back;
els.accountBack.addEventListener("click", () => showView("path"));

// Sound: browsers only allow audio after a user gesture, so unlock on the first tap anywhere.
function renderSoundBtn() {
  els.soundBtn.innerHTML = Sfx.isEnabled() ? Brand.icons.soundOn : Brand.icons.soundOff;
  els.soundBtn.classList.toggle("on", Sfx.isEnabled());
  els.soundBtn.setAttribute("aria-label", Sfx.isEnabled() ? "Sound on. Tap to mute." : "Sound off. Tap to unmute.");
}
els.soundBtn.addEventListener("click", () => { Sfx.setEnabled(!Sfx.isEnabled()); renderSoundBtn(); });
renderSoundBtn();
document.addEventListener("pointerdown", () => Sfx.unlock(), { once: true, capture: true });

els.streakContinue.addEventListener("click", () => { Sfx.play("tap"); hideStreakCelebration(); });

// A day counts toward the streak when you open the app. The first open of the day gets a celebration.
// Re-check when the tab comes back after midnight.
function checkNewDay() {
  const newDay = markActiveToday();
  if (newDay) {
    if (!els.viewPath.classList.contains("hidden")) renderPath();
    showStreakCelebration(streak());
  }
  return newDay;
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") checkNewDay();
});

markActiveToday() ? (showView("path"), showStreakCelebration(streak())) : showView("path");
