# Gi Path — Jiu-Jitsu Lessons

A Duolingo-style learning app for Brazilian Jiu-Jitsu. Work through a
belt-based skill tree, one bite-sized lesson at a time, answering multiple
choice questions and putting technique steps in the right order.

## How to play

Open `jiujitsu/index.html` in a browser, or serve the repo root with any
static file server and visit `/jiujitsu/`:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000/jiujitsu/`.

## Features

- **Belt-based path**: White → Blue → Purple belt units, each with four
  lessons. Lessons unlock in order as you complete the previous one.
- **Two question types**: multiple choice, and step-sequencing (tap the
  steps of a technique in the correct order).
- **Hearts**: five hearts per lesson; a wrong answer costs a heart, and
  running out sends you back to retry the lesson.
- **XP and stars**: each completed lesson earns XP and 1-3 stars based on
  accuracy.
- **Streaks**: a day streak tracked across visits.
- **Progress saved locally**: all progress lives in the browser's
  `localStorage` (key `gipath_progress_v1`) — no account or server needed.

## Files

- `index.html` — page structure (path map, lesson, and results screens)
- `style.css` — Duolingo-inspired styling
- `data.js` — the curriculum: belts, lessons, and questions
- `app.js` — app logic: progress persistence, path rendering, lesson flow

## Adding content

New belts/lessons/questions live entirely in `data.js`. Each lesson is:

```js
{
  id: "w1",
  title: "Core Positions",
  questions: [
    { type: "mc", prompt: "...", choices: ["...", "..."], answer: 0 },
    { type: "sequence", prompt: "...", steps: ["...", "...", "..."] },
  ],
}
```

Lessons unlock in the order they appear across `CURRICULUM`, so append new
lessons/belts at the end (or before the locked "Brown & Black Belt"
placeholder) to extend the path.
