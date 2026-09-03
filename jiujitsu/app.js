// Gi Path — app logic: progress persistence, path rendering, lesson flow.

const STORAGE_KEY = "gipath_progress_v1";
const START_HEARTS = 5;

const els = {
  viewPath: document.getElementById("view-path"),
  viewLesson: document.getElementById("view-lesson"),
  viewComplete: document.getElementById("view-complete"),
  viewFailed: document.getElementById("view-failed"),
  pathContainer: document.getElementById("path-container"),
  statStreak: document.getElementById("stat-streak"),
  statXp: document.getElementById("stat-xp"),
  lessonClose: document.getElementById("lesson-close"),
  lessonProgress: document.getElementById("lesson-progress"),
  lessonHearts: document.getElementById("lesson-hearts"),
  questionContainer: document.getElementById("question-container"),
  feedbackBanner: document.getElementById("feedback-banner"),
  feedbackText: document.getElementById("feedback-text"),
  actionBtn: document.getElementById("action-btn"),
  completeEmoji: document.getElementById("complete-emoji"),
  completeTitle: document.getElementById("complete-title"),
  completeStars: document.getElementById("complete-stars"),
  completeXp: document.getElementById("complete-xp"),
  completeAccuracy: document.getElementById("complete-accuracy"),
  completeContinue: document.getElementById("complete-continue"),
  failedRetry: document.getElementById("failed-retry"),
};

// ---------- Progress persistence ----------

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("none");
    const parsed = JSON.parse(raw);
    return {
      xp: parsed.xp || 0,
      streak: parsed.streak || 0,
      lastPlayedDate: parsed.lastPlayedDate || null,
      completed: parsed.completed || {}, // lessonId -> stars (1-3)
    };
  } catch (e) {
    return { xp: 0, streak: 0, lastPlayedDate: null, completed: {} };
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function bumpStreak() {
  const today = todayStr();
  if (progress.lastPlayedDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (progress.lastPlayedDate === yesterday) {
    progress.streak += 1;
  } else {
    progress.streak = 1;
  }
  progress.lastPlayedDate = today;
}

let progress = loadProgress();

// ---------- Flatten lessons for unlock logic ----------

function flattenLessons() {
  const flat = [];
  CURRICULUM.forEach((belt) => {
    belt.lessons.forEach((lesson) => {
      flat.push({ belt, lesson });
    });
  });
  return flat;
}

const FLAT_LESSONS = flattenLessons();

function isLessonUnlocked(lessonId) {
  const idx = FLAT_LESSONS.findIndex((f) => f.lesson.id === lessonId);
  if (idx <= 0) return true;
  const prev = FLAT_LESSONS[idx - 1].lesson;
  return !!progress.completed[prev.id];
}

// ---------- Path rendering ----------

function renderPath() {
  els.statStreak.textContent = progress.streak;
  els.statXp.textContent = progress.xp;

  els.pathContainer.innerHTML = "";

  CURRICULUM.forEach((belt) => {
    const header = document.createElement("div");
    header.className = "belt-header" + (belt.locked ? " locked" : "");
    header.style.background = belt.color;
    header.style.color = belt.textColor;
    header.innerHTML = `<h2>${belt.name}</h2><p>${belt.subtitle}</p>`;
    els.pathContainer.appendChild(header);

    if (belt.locked || belt.lessons.length === 0) return;

    const pathWrap = document.createElement("div");
    pathWrap.className = "lesson-path";

    belt.lessons.forEach((lesson, i) => {
      const row = document.createElement("div");
      const offsetClass = i % 3 === 1 ? "offset-left" : i % 3 === 2 ? "offset-right" : "";
      row.className = "node-row " + offsetClass;

      const unlocked = isLessonUnlocked(lesson.id);
      const completedStars = progress.completed[lesson.id];
      const isCurrent = unlocked && !completedStars;

      const wrap = document.createElement("div");
      wrap.className = "node-wrap";

      const btn = document.createElement("button");
      btn.className = "lesson-node" + (!unlocked ? " locked" : isCurrent ? " current" : "");
      btn.innerHTML = !unlocked ? "🔒" : completedStars ? "✓" : "▶";
      btn.disabled = !unlocked;
      btn.addEventListener("click", () => startLesson(lesson.id));

      if (completedStars) {
        const stars = document.createElement("div");
        stars.className = "node-stars";
        stars.textContent = "⭐".repeat(completedStars);
        btn.appendChild(stars);
      }

      const label = document.createElement("div");
      label.className = "node-label";
      label.textContent = lesson.title;

      wrap.appendChild(btn);
      wrap.appendChild(label);
      row.appendChild(wrap);
      pathWrap.appendChild(row);
    });

    els.pathContainer.appendChild(pathWrap);
  });
}

// ---------- Lesson session ----------

let session = null;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function prepareQuestions(lesson) {
  return lesson.questions.map((q) => {
    if (q.type === "mc") {
      const order = shuffle(q.choices.map((_, i) => i));
      return {
        type: "mc",
        prompt: q.prompt,
        order,
        choices: order.map((i) => q.choices[i]),
        correctShuffledIndex: order.indexOf(q.answer),
      };
    }
    // sequence
    const poolOrder = shuffle(q.steps.map((_, i) => i));
    return {
      type: "sequence",
      prompt: q.prompt,
      steps: q.steps,
      poolOrder,
    };
  });
}

function startLesson(lessonId) {
  const found = FLAT_LESSONS.find((f) => f.lesson.id === lessonId);
  if (!found) return;
  session = {
    lessonId,
    lessonTitle: found.lesson.title,
    questions: prepareQuestions(found.lesson),
    index: 0,
    hearts: START_HEARTS,
    mistakes: 0,
    correctFirstTry: 0,
    answered: false,
    mcSelected: null,
    seqAnswer: [], // array of original step indices, in chosen order
  };
  showView("lesson");
  renderQuestion();
}

function renderHearts() {
  els.lessonHearts.textContent = "❤️".repeat(session.hearts) + "🖤".repeat(START_HEARTS - session.hearts);
}

function renderQuestion() {
  const total = session.questions.length;
  els.lessonProgress.style.width = `${(session.index / total) * 100}%`;
  renderHearts();
  els.feedbackBanner.classList.add("hidden");
  els.actionBtn.textContent = "Check";
  els.actionBtn.disabled = true;
  session.answered = false;
  session.mcSelected = null;
  session.seqAnswer = [];

  const q = session.questions[session.index];
  const container = els.questionContainer;
  container.innerHTML = "";

  const prompt = document.createElement("div");
  prompt.className = "question-prompt";
  prompt.textContent = q.prompt;
  container.appendChild(prompt);

  if (q.type === "mc") {
    const list = document.createElement("div");
    list.className = "choice-list";
    q.choices.forEach((choiceText, i) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choiceText;
      btn.addEventListener("click", () => {
        if (session.answered) return;
        session.mcSelected = i;
        list.querySelectorAll(".choice-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        els.actionBtn.disabled = false;
      });
      list.appendChild(btn);
    });
    container.appendChild(list);
  } else {
    const answerBox = document.createElement("div");
    answerBox.className = "sequence-answer";
    const pool = document.createElement("div");
    pool.className = "sequence-pool";

    function renderSeq() {
      answerBox.innerHTML = "";
      if (session.seqAnswer.length === 0) {
        const ph = document.createElement("div");
        ph.className = "placeholder";
        ph.textContent = "Tap the steps below, in the order they happen";
        answerBox.appendChild(ph);
      } else {
        session.seqAnswer.forEach((stepIdx, pos) => {
          const item = document.createElement("div");
          item.className = "sequence-step";
          item.innerHTML = `<span class="step-num">${pos + 1}</span><span>${q.steps[stepIdx]}</span>`;
          item.addEventListener("click", () => {
            if (session.answered) return;
            session.seqAnswer.splice(pos, 1);
            renderSeq();
          });
          answerBox.appendChild(item);
        });
      }

      pool.innerHTML = "";
      q.poolOrder
        .filter((stepIdx) => !session.seqAnswer.includes(stepIdx))
        .forEach((stepIdx) => {
          const item = document.createElement("div");
          item.className = "sequence-step";
          item.innerHTML = `<span>${q.steps[stepIdx]}</span>`;
          item.addEventListener("click", () => {
            if (session.answered) return;
            session.seqAnswer.push(stepIdx);
            renderSeq();
          });
          pool.appendChild(item);
        });

      els.actionBtn.disabled = session.seqAnswer.length !== q.steps.length;
    }

    renderSeq();
    container.appendChild(answerBox);
    container.appendChild(pool);
  }
}

function checkAnswer() {
  const q = session.questions[session.index];
  let correct = false;

  if (q.type === "mc") {
    correct = session.mcSelected === q.correctShuffledIndex;
    const buttons = els.questionContainer.querySelectorAll(".choice-btn");
    buttons.forEach((b, i) => {
      b.classList.add("disabled");
      if (i === q.correctShuffledIndex) b.classList.add("correct");
      else if (i === session.mcSelected) b.classList.add("incorrect");
    });
  } else {
    correct = session.seqAnswer.every((stepIdx, pos) => stepIdx === pos);
    const items = els.questionContainer.querySelectorAll(".sequence-answer .sequence-step");
    items.forEach((item, pos) => {
      item.classList.add(session.seqAnswer[pos] === pos ? "correct-final" : "incorrect-final");
    });
  }

  session.answered = true;
  if (correct) {
    session.correctFirstTry += 1;
  } else {
    session.mistakes += 1;
    session.hearts -= 1;
  }

  els.feedbackBanner.classList.remove("hidden");
  els.feedbackBanner.classList.toggle("correct", correct);
  els.feedbackBanner.classList.toggle("incorrect", !correct);
  els.feedbackText.textContent = correct
    ? "Nice! That's correct."
    : q.type === "mc"
      ? "Not quite — the right answer is highlighted in green."
      : "Not quite — the steps marked red are out of place.";

  els.actionBtn.disabled = false;
  els.actionBtn.textContent = session.hearts <= 0 ? "Continue" : session.index === session.questions.length - 1 ? "Finish" : "Continue";
}

function advance() {
  if (session.hearts <= 0) {
    showView("failed");
    return;
  }
  session.index += 1;
  if (session.index >= session.questions.length) {
    finishLesson();
  } else {
    renderQuestion();
  }
}

function finishLesson() {
  els.lessonProgress.style.width = "100%";
  const total = session.questions.length;
  const accuracy = Math.round((session.correctFirstTry / total) * 100);
  let stars = 3;
  if (session.mistakes >= 3) stars = 1;
  else if (session.mistakes >= 1) stars = 2;

  const xpEarned = Math.max(10, 20 - session.mistakes * 3);

  const prevStars = progress.completed[session.lessonId] || 0;
  progress.completed[session.lessonId] = Math.max(prevStars, stars);
  progress.xp += xpEarned;
  bumpStreak();
  saveProgress();

  els.completeStars.textContent = "⭐".repeat(stars) + "☆".repeat(3 - stars);
  els.completeXp.textContent = `+${xpEarned}`;
  els.completeAccuracy.textContent = `${accuracy}%`;
  showView("complete");
}

// ---------- View switching ----------

function showView(name) {
  els.viewPath.classList.toggle("hidden", name !== "path");
  els.viewLesson.classList.toggle("hidden", name !== "lesson");
  els.viewComplete.classList.toggle("hidden", name !== "complete");
  els.viewFailed.classList.toggle("hidden", name !== "failed");
  if (name === "path") renderPath();
}

// ---------- Event wiring ----------

els.actionBtn.addEventListener("click", () => {
  if (!session.answered) {
    checkAnswer();
  } else {
    advance();
  }
});

els.lessonClose.addEventListener("click", () => {
  session = null;
  showView("path");
});

els.completeContinue.addEventListener("click", () => {
  session = null;
  showView("path");
});

els.failedRetry.addEventListener("click", () => {
  const lessonId = session.lessonId;
  session = null;
  startLesson(lessonId);
});

// ---------- Init ----------

showView("path");
