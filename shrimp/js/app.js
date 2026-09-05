// Shrimp — app logic: progress, belt path, unit learn screens, lessons, stripes.

const STORAGE_KEY = "shrimp_progress_v1";
const START_HEARTS = 3; // 4 questions per lesson: miss 3 and you retry

const $ = (id) => document.getElementById(id);
const els = {
  viewPath: $("view-path"), viewLearn: $("view-learn"), viewLesson: $("view-lesson"),
  viewComplete: $("view-complete"), viewFailed: $("view-failed"),
  brandMark: $("brand-mark"), statStreak: $("stat-streak"), statXp: $("stat-xp"),
  beltCard: $("belt-card"), pathContainer: $("path-container"),
  learnBack: $("learn-back"), learnEyebrow: $("learn-eyebrow"), learnHeading: $("learn-heading"),
  learnBeltChip: $("learn-belt-chip"), learnBody: $("learn-body"), learnStart: $("learn-start"), learnNote: $("learn-note"),
  lessonClose: $("lesson-close"), lessonProgress: $("lesson-progress"), lessonHearts: $("lesson-hearts"),
  questionContainer: $("question-container"), feedbackBanner: $("feedback-banner"), feedbackText: $("feedback-text"),
  actionBtn: $("action-btn"),
  completeMascot: $("complete-mascot"), completeEyebrow: $("complete-eyebrow"), completeTitle: $("complete-title"),
  completeStripe: $("complete-stripe"), completeXp: $("complete-xp"), completeAccuracy: $("complete-accuracy"),
  completeContinue: $("complete-continue"),
  failedMascot: $("failed-mascot"), failedRetry: $("failed-retry"), failedLearn: $("failed-learn"),
};

// ---------- Progress ----------

function loadProgress() {
  try {
    const p = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      xp: p.xp || 0,
      streak: p.streak || 0,
      lastPlayedDate: p.lastPlayedDate || null,
      completed: p.completed || {},   // lessonId -> stars 1-3
      watched: p.watched || {},       // videoId -> true
      learnSeen: p.learnSeen || {},   // unitId -> true
    };
  } catch (e) {
    return { xp: 0, streak: 0, lastPlayedDate: null, completed: {}, watched: {}, learnSeen: {} };
  }
}
function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (e) { /* private mode */ }
}
const todayStr = () => new Date().toISOString().slice(0, 10);
function bumpStreak() {
  const today = todayStr();
  if (progress.lastPlayedDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  progress.streak = progress.lastPlayedDate === yesterday ? progress.streak + 1 : 1;
  progress.lastPlayedDate = today;
}
let progress = loadProgress();

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
  const f = FLAT.find((x) => !isLessonDone(x.lesson.id) && isLessonUnlocked(x.lesson.id));
  return f || null;
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

function renderPath() {
  els.statStreak.textContent = progress.streak;
  els.statXp.textContent = progress.xp;
  renderBeltCard();

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
      html += `<div class="video-player"><iframe src="https://www.youtube-nocookie.com/embed/${learnPlaying}?rel=0&modestbranding=1&playsinline=1${start}" title="${v ? v.title : "Video"}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
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

// ---------- Lesson ----------

let session = null;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function prepareQuestions(lesson) {
  return lesson.questions.map((q) => {
    if (q.type === "sequence") {
      return { type: "sequence", prompt: q.prompt, steps: q.steps, poolOrder: shuffle(q.steps.map((_, i) => i)) };
    }
    const order = shuffle(q.choices.map((_, i) => i));
    return {
      type: q.type, prompt: q.prompt, position: q.position,
      choices: order.map((i) => q.choices[i]), correctIndex: order.indexOf(q.answer),
    };
  });
}

function startLesson(lessonId) {
  const f = FLAT.find((x) => x.lesson.id === lessonId);
  if (!f) return;
  session = {
    lessonId, unit: f.unit, belt: f.belt,
    questions: prepareQuestions(f.lesson),
    index: 0, hearts: START_HEARTS, mistakes: 0, correct: 0,
    answered: false, selected: null, seqAnswer: [],
    stripesBefore: beltStripes(f.belt), beltCompleteBefore: isBeltComplete(f.belt),
  };
  showView("lesson");
  renderQuestion();
}

function renderHearts() {
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

  if (q.type === "position") {
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

  // sequence
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
      item.addEventListener("click", () => { if (session.answered) return; session.seqAnswer.push(stepIdx); renderSeq(); });
      pool.appendChild(item);
    });
    els.actionBtn.disabled = session.seqAnswer.length !== q.steps.length;
  };
  renderSeq();
  c.appendChild(answerBox);
  c.appendChild(pool);
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
  if (correct) session.correct++; else { session.mistakes++; session.hearts--; }

  els.feedbackBanner.classList.remove("hidden");
  els.feedbackBanner.classList.toggle("correct", correct);
  els.feedbackBanner.classList.toggle("incorrect", !correct);
  els.feedbackText.textContent = correct
    ? ["Nice.", "Oss.", "That's it.", "Clean."][Math.floor(Math.random() * 4)]
    : q.type === "sequence" ? "Not quite. The steps marked red are out of place." : "Not quite. The right answer is in green.";
  renderHearts();
  els.actionBtn.disabled = false;
  els.actionBtn.textContent = session.hearts <= 0 ? "Continue" : session.index === session.questions.length - 1 ? "Finish" : "Continue";
}

function advance() {
  if (session.hearts <= 0) {
    els.failedMascot.innerHTML = Brand.mascot({ size: 160, stripes: beltStripes(session.belt), belt: session.belt.color, mood: "sad" });
    showView("failed");
    return;
  }
  session.index++;
  if (session.index >= session.questions.length) finishLesson(); else renderQuestion();
}

function finishLesson() {
  els.lessonProgress.style.width = "100%";
  const total = session.questions.length;
  const accuracy = Math.round((session.correct / total) * 100);
  const stars = session.mistakes === 0 ? 3 : session.mistakes <= 2 ? 2 : 1;
  const xp = Math.max(10, 20 - session.mistakes * 3);

  progress.completed[session.lessonId] = Math.max(progress.completed[session.lessonId] || 0, stars);
  progress.xp += xp;
  bumpStreak();
  saveProgress();

  const belt = session.belt;
  const stripesNow = beltStripes(belt);
  const promoted = !session.beltCompleteBefore && isBeltComplete(belt);
  const earnedStripe = stripesNow > session.stripesBefore;
  const nextBelt = CURRICULUM[CURRICULUM.indexOf(belt) + 1];

  els.completeMascot.innerHTML = Brand.mascot({
    size: 160,
    stripes: promoted ? 0 : stripesNow,
    belt: promoted && nextBelt ? nextBelt.color : belt.color,
    mood: "excited",
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

  els.completeXp.textContent = `+${xp}`;
  els.completeAccuracy.textContent = `${accuracy}%`;
  showView("complete");
}

// ---------- Views ----------

function showView(name) {
  const map = { path: els.viewPath, learn: els.viewLearn, lesson: els.viewLesson, complete: els.viewComplete, failed: els.viewFailed };
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

showView("path");
