# Tallingame

This repo hosts small, dependency-free browser games/apps. Each lives in its
own folder (or the root) with a static `index.html` — no build step, no
server required.

- **Zombie Outbreak** (this folder) — a top-down infection game. See below.
- **[Gi Path](jiujitsu/)** — a Duolingo-style jiu-jitsu learning app with a
  belt-based lesson tree, quizzes, hearts, XP, and streaks.

## Zombie Outbreak

A simple top-down browser game. You play as patient zero, leading a growing
horde of zombies through a city, infecting citizens one by one.

## How to play

Open `index.html` in a browser (no build step, no server required), or serve
the folder with any static file server:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

**Controls:** Drag the circular joystick, or use arrow keys / WASD.

## Rules

- The city starts with 50 humans wandering the streets.
- You start alone — the glowing zombie is you.
- Touch a human to infect them — they instantly join your horde and start
  hunting on their own.
- Zombie pals autonomously chase any human that wanders within range, and
  fall back into formation around you otherwise.
- Humans flee (screaming) when a zombie gets close, so use your growing
  horde to box them in.
- The level ends when all 50 citizens have been infected.

## Files

- `index.html` — page structure and HUD
- `style.css` — retro pixel-art styling
- `game.js` — game loop, AI, rendering (vanilla JS + Canvas, no dependencies)
