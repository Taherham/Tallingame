# Zombie Outbreak

A simple top-down browser game. You play as patient zero, leading a growing
horde of zombies through a city, infecting citizens one by one.

## How to play

Open `index.html` in a browser (no build step, no server required), or serve
the folder with any static file server:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

**Controls:** Arrow keys or WASD to move. On touch devices, an on-screen
d-pad appears.

## Rules

- The city starts with 50 humans wandering the streets.
- You start with 3 zombie pals that follow you in formation.
- Touch a human with you or any pal to infect them — they instantly join
  your horde and start hunting on their own.
- Zombie pals autonomously chase any human that wanders within range, and
  fall back into formation around you otherwise.
- Humans flee when a zombie gets close, so use your growing horde to box
  them in.
- The level ends when all 50 citizens have been infected.

## Files

- `index.html` — page structure and HUD
- `style.css` — retro pixel-art styling
- `game.js` — game loop, AI, rendering (vanilla JS + Canvas, no dependencies)
