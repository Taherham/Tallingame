# Shrimp

Jiu-jitsu, one small move at a time. A Duolingo-style learning app for
Brazilian Jiu-Jitsu hobbyists: a belt-based lesson path, short curated videos
per unit, quizzes with illustrated positions, hearts, XP, streaks, and stripes.

Named after the hip escape: the first movement every white belt learns and
never stops drilling. Works for gi and no-gi.

## Run it

It's a static site with no build step. Open `shrimp/index.html`, or serve the
repo root and visit `/shrimp/`:

```
python3 -m http.server 8000
```

Video embeds need a real `http://` or `https://` origin, so use the server
rather than opening the file directly when testing the Learn screens.

## How it works

- **Belts and units.** White belt (survival and fundamentals) and blue belt
  (systems and depth), nine units each, three lessons per unit. Lessons unlock
  in order.
- **Learn screens.** Every unit opens with hand-picked YouTube videos, each
  under five minutes, plus three key ideas. Videos are embedded with YouTube's
  own player; nothing is re-hosted.
- **Lessons.** Four questions each: multiple choice, step sequencing, and
  "name the position" questions with illustrated figure pairs. Coral is always
  you; ink is always the partner.
- **Stripes.** Each belt has four stripes. Finishing units 2, 4, 6 and 8 earns
  one; finishing all nine promotes you to the next belt. The mascot's belt
  ranks up with you.
- **Hearts, XP, stars.** Three hearts per lesson (four questions, so missing
  three sends you back to retry). XP and 1-3 stars per lesson based on accuracy.
- **Daily goal.** An XP target per day: Casual 10, Regular 20 (default), or
  Serious 40. Tap the goal name on the Today card to change it. Hitting it
  marks the day green on the week strip.
- **Login streak.** A day counts when you open the app. The streak is the run
  of consecutive days ending today.
- **Practice weak spots.** Every wrong answer is remembered per question. A
  practice session serves up to 8 questions from lessons you've completed,
  missed ones first. A correct answer clears one miss; no hearts in practice,
  but XP counts toward the daily goal.
- **Progress** lives in the browser's `localStorage` under `shrimp_progress_v1`.

## Files

```
index.html          page shell (path, learn, lesson, results)
style.css           brand tokens, light + dark themes
js/brand.js         mascot, icon mark, icon set, belt graphic
js/figures.js       position illustration renderer + position data
js/white.js         white belt units, lessons, questions, video slots
js/blue.js          blue belt units, lessons, questions, video slots
js/curriculum.js    belt metadata and stripe thresholds
js/app.js           progress, path rendering, learn and lesson flow
tools/curate-videos.mjs   YouTube Data API curation script
```

## Adding content

Units and lessons live in `js/white.js` and `js/blue.js`. A lesson is:

```js
{
  id: "w2a",
  title: "Shrimping",
  questions: [
    { type: "mc", prompt: "...", choices: ["...", "..."], answer: 0 },
    { type: "sequence", prompt: "...", steps: ["first", "second", "third"] },
    { type: "position", position: "mount", prompt: "...", choices: ["Mount", "..."], answer: 0 },
  ],
}
```

`answer` is the index into `choices` as written; the app shuffles choices at
runtime. Positions available for `position` questions are the keys of
`POSITIONS` in `js/figures.js`. Adding a position is adding coordinates, not
drawing: two figures, each with a head, torso, and near/far arm and leg chains.

## Curating videos

Videos are picked offline so there is no API key in the page and every clip is
reviewed by a human.

1. Get a YouTube Data API v3 key from Google Cloud and restrict it to that API.
2. Search and shortlist (about 7,200 of the free 10,000 daily quota units):

   ```
   YOUTUBE_API_KEY=... node shrimp/tools/curate-videos.mjs
   ```

   This writes `shrimp/tools/shortlist.json` with up to four chosen videos and
   eight alternates per unit, all embeddable and under five minutes, ranked with
   a boost for trusted instructional channels.
3. Edit the shortlist if you want to swap any picks, then apply:

   ```
   node shrimp/tools/curate-videos.mjs --apply shrimp/tools/shortlist.json
   ```

4. Later, check that everything still exists and embeds:

   ```
   YOUTUBE_API_KEY=... node shrimp/tools/curate-videos.mjs --verify
   ```

Never commit the API key. The shortlist file is fine to commit.
