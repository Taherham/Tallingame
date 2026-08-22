(() => {
  'use strict';

  // ---------- Config ----------
  const TILE = 16;
  const COLS = 25;
  const ROWS = 25;
  const W = COLS * TILE;
  const H = ROWS * TILE;

  const ENTITY_R = 6;
  const FORMATION_R = 26;
  const PAL_CHASE_R = 95;
  const PANIC_R = 42;
  const SPEED_HUMAN_WANDER = 0.6;
  const SPEED_PAL_FOLLOW = 1.5;

  // Difficulty ramps across 3 levels: more people, a bigger/more alert
  // detection radius, a tighter catch radius, and a denser city each time.
  // fleeRadius is kept small on purpose: since a fleeing human is slightly
  // faster than a zombie, the real skill is closing in *before* they notice
  // you (while they're still wandering, which is much slower) rather than
  // out-running them once alerted -- that only works via cornering.
  const LEVELS = [
    { humanCount: 30, fleeSpeed: 1.15, fleeRadius: 38, catchRadius: 12, blockCount: 12 },
    { humanCount: 45, fleeSpeed: 1.30, fleeRadius: 41, catchRadius: 11, blockCount: 17 },
    { humanCount: 65, fleeSpeed: 1.45, fleeRadius: 44, catchRadius: 10, blockCount: 22 },
  ];

  // Zombies are deliberately a bit slower than a fleeing human -- catching
  // relies on cornering with your horde and cutting off routes, not on
  // out-running people in a straight line (which is mathematically
  // impossible once they're alerted: pursuer must close via geometry).
  let SPEED_HUMAN_FLEE = LEVELS[0].fleeSpeed;
  let SPEED_PLAYER = LEVELS[0].fleeSpeed * 0.94;
  let SPEED_PAL_CHASE = LEVELS[0].fleeSpeed * 0.97;
  let HUMAN_FLEE_R = LEVELS[0].fleeRadius;
  let CATCH_R = LEVELS[0].catchRadius;

  const HUMAN_PALETTES = [
    { body: '#c94f4f', head: '#e8b98a' },
    { body: '#4f8dc9', head: '#f0c9a0' },
    { body: '#c9a94f', head: '#d9a978' },
    { body: '#8a4fc9', head: '#e8b98a' },
    { body: '#4fc98d', head: '#f0c9a0' },
    { body: '#c94fa0', head: '#d9a978' },
  ];

  // ---------- Canvas ----------
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const bg = document.createElement('canvas');
  bg.width = W;
  bg.height = H;
  const bctx = bg.getContext('2d');

  // ---------- Map: 0 = walkable, 1 = building. Regenerated every level. ----------
  let map = [];
  let walkableTiles = [];

  function generateMap(blockCount) {
    const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    let placed = 0, attempts = 0;
    while (placed < blockCount && attempts < 400) {
      attempts++;
      const bw = 2 + ((Math.random() * 3) | 0);
      const bh = 2 + ((Math.random() * 3) | 0);
      const bx = 1 + ((Math.random() * (COLS - bw - 2)) | 0);
      const by = 1 + ((Math.random() * (ROWS - bh - 2)) | 0);
      let clear = true;
      for (let y = by - 1; y <= by + bh && clear; y++) {
        for (let x = bx - 1; x <= bx + bw && clear; x++) {
          if (y < 0 || x < 0 || y >= ROWS || x >= COLS) continue;
          if (grid[y][x] === 1) clear = false;
        }
      }
      if (!clear) continue;
      for (let y = by; y < by + bh; y++) {
        for (let x = bx; x < bx + bw; x++) grid[y][x] = 1;
      }
      placed++;
    }
    return grid;
  }

  function tileAt(px, py) {
    const tx = Math.floor(px / TILE);
    const ty = Math.floor(py / TILE);
    if (tx < 0 || ty < 0 || tx >= COLS || ty >= ROWS) return 1;
    return map[ty][tx];
  }

  function collides(x, y, r) {
    return (
      tileAt(x - r, y - r) === 1 ||
      tileAt(x + r, y - r) === 1 ||
      tileAt(x - r, y + r) === 1 ||
      tileAt(x + r, y + r) === 1
    );
  }

  function moveEntity(e, dx, dy) {
    const nx = e.x + dx;
    if (!collides(nx, e.y, e.r)) e.x = nx;
    const ny = e.y + dy;
    if (!collides(e.x, ny, e.r)) e.y = ny;
  }

  // Scans outward from a desired heading (0, +/-25, +/-50, ... up to a full
  // reverse) and returns the first angle whose lookahead point is open. This
  // is what keeps wanderers and chasers from freezing or vibrating in place
  // against a wall or a corner instead of sliding around it.
  const STEER_OFFSETS_DEG = [0, 25, -25, 50, -50, 75, -75, 100, -100, 125, -125, 150, -150, 180];
  const STEER_OFFSETS_RAD = STEER_OFFSETS_DEG.map((d) => (d * Math.PI) / 180);

  function steerOpen(x, y, r, desiredAngle, lookahead) {
    for (const off of STEER_OFFSETS_RAD) {
      const a = desiredAngle + off;
      const tx = x + Math.cos(a) * lookahead;
      const ty = y + Math.sin(a) * lookahead;
      if (!collides(tx, ty, r)) return a;
    }
    return desiredAngle;
  }

  function renderMap() {
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const px = x * TILE, py = y * TILE;
        if (map[y][x] === 1) {
          bctx.fillStyle = ((x + y) % 2 === 0) ? '#3a4550' : '#333d46';
          bctx.fillRect(px, py, TILE, TILE);
          bctx.fillStyle = '#242c33';
          bctx.fillRect(px + 2, py + 2, TILE - 4, TILE - 4);
          bctx.fillStyle = '#4a5764';
          bctx.fillRect(px + 3, py + 3, 3, 3);
          bctx.fillRect(px + TILE - 6, py + 3, 3, 3);
          bctx.fillRect(px + 3, py + TILE - 6, 3, 3);
          bctx.fillRect(px + TILE - 6, py + TILE - 6, 3, 3);
        } else {
          bctx.fillStyle = '#5c5f55';
          bctx.fillRect(px, py, TILE, TILE);
          if (x % 2 === 0) {
            bctx.fillStyle = '#6a6d61';
            bctx.fillRect(px + TILE / 2 - 1, py, 2, TILE);
          }
        }
      }
    }
  }

  function rebuildWalkableTiles() {
    walkableTiles = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (map[y][x] === 0) walkableTiles.push({ x, y });
      }
    }
  }

  function randomWalkablePoint() {
    const t = walkableTiles[(Math.random() * walkableTiles.length) | 0];
    return {
      x: t.x * TILE + TILE / 2,
      y: t.y * TILE + TILE / 2,
    };
  }

  // ---------- Best-time tracking (per device, via localStorage) ----------
  function loadBest(key) {
    try {
      const v = localStorage.getItem(key);
      return v ? parseFloat(v) : null;
    } catch (e) {
      return null;
    }
  }

  function saveBest(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch (e) {
      // ignore -- private browsing / storage disabled
    }
  }

  function formatTime(ms) {
    const totalSeconds = ms / 1000;
    const m = Math.floor(totalSeconds / 60);
    const s = (totalSeconds % 60).toFixed(1).padStart(4, '0');
    return `${m}:${s}`;
  }

  // performance.now() wrapper kept local to avoid polluting globals
  function performance_time() {
    return (typeof performance !== 'undefined' ? performance.now() : Date.now());
  }

  // ---------- Game state ----------
  let player, pals, humans, particles;
  let caught, running;
  let level = 1;
  let stage = 'intro'; // 'intro' | 'playing' | 'levelComplete' | 'gameComplete'
  let levelStartTime = 0;
  let totalElapsed = 0;

  function setupLevel(n) {
    const cfg = LEVELS[n - 1];
    level = n;
    SPEED_HUMAN_FLEE = cfg.fleeSpeed;
    SPEED_PLAYER = cfg.fleeSpeed * 0.94;
    SPEED_PAL_CHASE = cfg.fleeSpeed * 0.97;
    HUMAN_FLEE_R = cfg.fleeRadius;
    CATCH_R = cfg.catchRadius;

    map = generateMap(cfg.blockCount);
    rebuildWalkableTiles();
    renderMap();

    const p0 = randomWalkablePoint();
    player = { x: p0.x, y: p0.y, r: ENTITY_R, dir: 'down' };
    pals = [];
    particles = [];

    humans = [];
    for (let i = 0; i < cfg.humanCount; i++) {
      const pt = randomWalkablePoint();
      humans.push({
        id: i,
        x: pt.x,
        y: pt.y,
        r: ENTITY_R - 1,
        vx: 0,
        vy: 0,
        wanderT: 0,
        fleeing: false,
        fleeJitter: 0,
        fleeJitterT: 0,
        skin: HUMAN_PALETTES[i % HUMAN_PALETTES.length],
      });
    }

    caught = 0;
    document.getElementById('level').textContent = String(level);
    document.getElementById('caught').textContent = '0';
    document.getElementById('total').textContent = String(cfg.humanCount);
    document.getElementById('horde').textContent = String(pals.length + 1);
    document.getElementById('time').textContent = formatTime(0);
  }

  function beginLevel(n) {
    setupLevel(n);
    levelStartTime = performance_time();
    stage = 'playing';
  }

  // ---------- Input ----------
  const keys = { up: false, down: false, left: false, right: false };
  const KEY_MAP = {
    ArrowUp: 'up', KeyW: 'up',
    ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right',
  };

  window.addEventListener('keydown', (e) => {
    const d = KEY_MAP[e.code];
    if (d) { keys[d] = true; e.preventDefault(); startIfNeeded(); }
  });
  window.addEventListener('keyup', (e) => {
    const d = KEY_MAP[e.code];
    if (d) { keys[d] = false; e.preventDefault(); }
  });

  // Circular analog joystick: drag the knob, direction + pull distance become the move vector.
  const joystickBase = document.getElementById('joystick-base');
  const joystickKnob = document.getElementById('joystick-knob');
  let joystickActive = false;
  let joystickVec = { x: 0, y: 0 };

  function updateJoystick(clientX, clientY) {
    const rect = joystickBase.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const d = Math.hypot(dx, dy);
    const maxR = rect.width / 2 - 6;
    if (d > maxR) {
      dx = (dx / d) * maxR;
      dy = (dy / d) * maxR;
    }
    joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
    joystickVec = { x: dx / maxR, y: dy / maxR };
  }

  function resetJoystick() {
    joystickActive = false;
    joystickVec = { x: 0, y: 0 };
    joystickKnob.style.transform = 'translate(0px, 0px)';
  }

  joystickBase.addEventListener('pointerdown', (e) => {
    joystickActive = true;
    joystickBase.setPointerCapture(e.pointerId);
    updateJoystick(e.clientX, e.clientY);
    startIfNeeded();
    e.preventDefault();
  });
  joystickBase.addEventListener('pointermove', (e) => {
    if (!joystickActive) return;
    updateJoystick(e.clientX, e.clientY);
    e.preventDefault();
  });
  joystickBase.addEventListener('pointerup', resetJoystick);
  joystickBase.addEventListener('pointercancel', resetJoystick);

  // Safari ignores preventDefault() on pointer events for suppressing native
  // scroll/bounce; it only respects preventDefault() on the touch event itself.
  // The page never scrolls, so block touchmove's default action everywhere.
  document.addEventListener('touchmove', (e) => { e.preventDefault(); }, { passive: false });
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });

  function getInputVector() {
    if (joystickActive) return joystickVec;
    let dx = 0, dy = 0;
    if (keys.up) dy -= 1;
    if (keys.down) dy += 1;
    if (keys.left) dx -= 1;
    if (keys.right) dx += 1;
    if (dx !== 0 || dy !== 0) {
      const len = Math.hypot(dx, dy);
      dx /= len; dy /= len;
    }
    return { x: dx, y: dy };
  }

  // ---------- Audio: synthesized sounds, no external assets ----------
  let audioCtx = null, masterGain = null;
  let activeScreams = 0;
  const MAX_CONCURRENT_SCREAMS = 5;
  let activeInfects = 0;
  const MAX_CONCURRENT_INFECTS = 4;

  function ensureAudio() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = new Ctx();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.22;
      masterGain.connect(audioCtx.destination);
    } else if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function pannerFor(px) {
    if (!audioCtx.createStereoPanner) return null;
    const pan = audioCtx.createStereoPanner();
    pan.pan.value = Math.max(-1, Math.min(1, (px / W) * 2 - 1));
    return pan;
  }

  function playScream(px) {
    if (!audioCtx || activeScreams >= MAX_CONCURRENT_SCREAMS) return;
    if (Math.random() > 0.5) return;
    activeScreams++;
    const now = audioCtx.currentTime;
    const dur = 0.16 + Math.random() * 0.14;

    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    const baseFreq = 480 + Math.random() * 260;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + dur);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.32, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    const pan = pannerFor(px);
    let node = gain;
    if (pan) { gain.connect(pan); node = pan; }
    node.connect(masterGain);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + dur + 0.02);
    osc.onended = () => { activeScreams--; };
  }

  function playInfectSound(px) {
    if (!audioCtx || activeInfects >= MAX_CONCURRENT_INFECTS) return;
    activeInfects++;
    const now = audioCtx.currentTime;
    const dur = 0.22;

    const osc = audioCtx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + dur);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.26, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    const pan = pannerFor(px);
    let node = gain;
    if (pan) { gain.connect(pan); node = pan; }
    node.connect(masterGain);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + dur + 0.02);
    osc.onended = () => { activeInfects--; };
  }

  function startIfNeeded() {
    ensureAudio();
    if (running) return;
    if (stage === 'intro') {
      totalElapsed = 0;
      beginLevel(1);
    } else if (stage === 'levelComplete') {
      beginLevel(level + 1);
    } else if (stage === 'gameComplete') {
      totalElapsed = 0;
      beginLevel(1);
    }
    running = true;
    document.getElementById('overlay').classList.add('hidden');
  }

  document.getElementById('start-btn').addEventListener('click', startIfNeeded);

  // ---------- Update ----------
  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function updatePlayer() {
    const v = getInputVector();
    if (v.x !== 0 || v.y !== 0) {
      const dx = v.x * SPEED_PLAYER;
      const dy = v.y * SPEED_PLAYER;
      moveEntity(player, dx, dy);
      if (Math.abs(dx) > Math.abs(dy)) player.dir = dx > 0 ? 'right' : 'left';
      else if (dy !== 0) player.dir = dy > 0 ? 'down' : 'up';
    }
  }

  function nearestZombieTo(pos) {
    let best = player, bd = dist(pos, player);
    for (const p of pals) {
      const d = dist(pos, p);
      if (d < bd) { bd = d; best = p; }
    }
    return { entity: best, d: bd };
  }

  function updatePals() {
    const count = pals.length;
    pals.forEach((pal, i) => {
      let target = null, td = Infinity;
      for (const h of humans) {
        const d = dist(pal, h);
        if (d < PAL_CHASE_R && d < td) { td = d; target = h; }
      }
      if (target) {
        const desired = Math.atan2(target.y - pal.y, target.x - pal.x);
        const angle = steerOpen(pal.x, pal.y, pal.r, desired, pal.r + 8);
        moveEntity(pal, Math.cos(angle) * SPEED_PAL_CHASE, Math.sin(angle) * SPEED_PAL_CHASE);
      } else {
        const orbit = (i / Math.max(count, 1)) * Math.PI * 2 + performance_time() * 0.0005;
        const tx = player.x + Math.cos(orbit) * FORMATION_R;
        const ty = player.y + Math.sin(orbit) * FORMATION_R;
        const dx = tx - pal.x, dy = ty - pal.y;
        const d = Math.hypot(dx, dy);
        if (d > 4) {
          const desired = Math.atan2(dy, dx);
          const angle = steerOpen(pal.x, pal.y, pal.r, desired, pal.r + 8);
          moveEntity(pal, Math.cos(angle) * SPEED_PAL_FOLLOW, Math.sin(angle) * SPEED_PAL_FOLLOW);
        }
      }
    });
  }

  function updateHumans() {
    for (const h of humans) {
      const { entity, d } = nearestZombieTo(h);
      let fleeFrom = null;

      if (d < HUMAN_FLEE_R) {
        fleeFrom = entity;
      } else {
        // Crowd panic: a human who isn't directly threatened still bolts if
        // someone nearby is already fleeing -- fear spreads through a crowd.
        for (const other of humans) {
          if (other === h || !other.fleeing) continue;
          if (dist(h, other) < PANIC_R) { fleeFrom = other; break; }
        }
      }

      if (fleeFrom) {
        if (!h.fleeing) playScream(h.x);
        h.fleeing = true;
        h.fleeJitterT -= 1;
        if (h.fleeJitterT <= 0) {
          // Panicked people don't run in a perfectly optimal straight line --
          // this wobble is also what keeps a lone, slightly-slower chaser
          // from facing a mathematically uncatchable target.
          h.fleeJitter = (Math.random() - 0.5) * 0.7;
          h.fleeJitterT = 15 + Math.random() * 20;
        }
        const desired = Math.atan2(h.y - fleeFrom.y, h.x - fleeFrom.x) + h.fleeJitter;
        const angle = steerOpen(h.x, h.y, h.r, desired, h.r + 8);
        h.vx = Math.cos(angle) * SPEED_HUMAN_FLEE;
        h.vy = Math.sin(angle) * SPEED_HUMAN_FLEE;
        h.wanderT = 0;
      } else {
        h.fleeing = false;
        h.wanderT -= 1;
        if (h.wanderT <= 0) {
          const desired = Math.random() * Math.PI * 2;
          const angle = steerOpen(h.x, h.y, h.r, desired, h.r + 8);
          h.vx = Math.cos(angle) * SPEED_HUMAN_WANDER;
          h.vy = Math.sin(angle) * SPEED_HUMAN_WANDER;
          h.wanderT = 60 + Math.random() * 90;
        } else if (h.vx !== 0 || h.vy !== 0) {
          // Proactively steer away from an oncoming wall each frame, instead
          // of reacting only after actually hitting it (which is what let
          // people get pinned in corners and along edges).
          const curAngle = Math.atan2(h.vy, h.vx);
          const lookX = h.x + h.vx * 6, lookY = h.y + h.vy * 6;
          if (collides(lookX, lookY, h.r)) {
            const angle = steerOpen(h.x, h.y, h.r, curAngle, h.r + 8);
            const speed = Math.hypot(h.vx, h.vy);
            h.vx = Math.cos(angle) * speed;
            h.vy = Math.sin(angle) * speed;
          }
        }
      }

      moveEntity(h, h.vx, h.vy);
    }
  }

  function spawnCatchBurst(x, y) {
    const n = 10;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 0.8 + Math.random() * 1.4;
      particles.push({
        x, y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        life: 1,
        decay: 0.045 + Math.random() * 0.02,
        color: Math.random() < 0.55 ? '#7ee787' : '#c94f4f',
      });
    }
  }

  function updateParticles() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.9;
      p.vy *= 0.9;
      p.life -= p.decay;
    }
    particles = particles.filter((p) => p.life > 0);
  }

  function finishLevel() {
    const levelTime = performance_time() - levelStartTime;
    totalElapsed += levelTime;
    running = false;

    const lvKey = 'zombieOutbreakBestLevel' + level;
    const prevBest = loadBest(lvKey);
    const isNewBest = prevBest === null || levelTime < prevBest;
    if (isNewBest) saveBest(lvKey, levelTime);

    const overlay = document.getElementById('overlay');
    const startBtn = document.getElementById('start-btn');

    if (level < LEVELS.length) {
      stage = 'levelComplete';
      document.getElementById('overlay-title').textContent = `Level ${level} Complete!`;
      document.getElementById('overlay-msg').innerHTML =
        `Time: <b>${formatTime(levelTime)}</b>` +
        (isNewBest ? ' &mdash; new best!' : ` (best: ${formatTime(prevBest)})`) +
        `<br>Horde grown to <b>${pals.length + 1}</b>. Next up: Level ${level + 1}, ` +
        `a new city with ${LEVELS[level].humanCount} people.`;
      startBtn.textContent = 'Next Level';
    } else {
      stage = 'gameComplete';
      const prevTotalBest = loadBest('zombieOutbreakBestTotal');
      const isNewTotalBest = prevTotalBest === null || totalElapsed < prevTotalBest;
      if (isNewTotalBest) saveBest('zombieOutbreakBestTotal', totalElapsed);
      document.getElementById('overlay-title').textContent = 'Outbreak Complete!';
      document.getElementById('overlay-msg').innerHTML =
        `All 3 levels cleared! Total time: <b>${formatTime(totalElapsed)}</b>` +
        (isNewTotalBest ? ' &mdash; new best!' : ` (best: ${formatTime(prevTotalBest)})`) +
        `<br>Final horde size: <b>${pals.length + 1}</b>.`;
      startBtn.textContent = 'Play Again';
    }
    overlay.classList.remove('hidden');
  }

  function checkCatches() {
    const zombies = [player, ...pals];
    const stillFree = [];
    for (const h of humans) {
      let wasCaught = false;
      for (const z of zombies) {
        if (dist(h, z) < CATCH_R) {
          wasCaught = true;
          pals.push({ x: h.x, y: h.y, r: ENTITY_R, hue: 'pal' });
          caught += 1;
          spawnCatchBurst(h.x, h.y);
          playInfectSound(h.x);
          break;
        }
      }
      if (!wasCaught) stillFree.push(h);
    }
    humans = stillFree;
    document.getElementById('caught').textContent = String(caught);
    document.getElementById('horde').textContent = String(pals.length + 1);

    if (humans.length === 0) finishLevel();
  }

  function update() {
    if (!running) return;
    updatePlayer();
    updatePals();
    updateHumans();
    checkCatches();
    document.getElementById('time').textContent = formatTime(performance_time() - levelStartTime);
  }

  // ---------- Drawing ----------
  function drawHumanoid(x, y, bodyColor, headColor, dir) {
    const bx = Math.round(x - 4), by = Math.round(y - 6);
    ctx.fillStyle = '#000';
    ctx.fillRect(bx, by + 9, 8, 2);
    ctx.fillStyle = bodyColor;
    ctx.fillRect(bx, by + 4, 8, 6);
    ctx.fillStyle = headColor;
    ctx.fillRect(bx + 1, by, 6, 5);
    ctx.fillStyle = '#fff';
    let ex = bx + 4, ey = by + 2;
    if (dir === 'left') ex = bx + 1;
    else if (dir === 'right') ex = bx + 6;
    else if (dir === 'up') ey = by + 1;
    ctx.fillRect(ex, ey, 1, 1);
  }

  function drawPlayerGlow(x, y) {
    const pulse = 0.5 + 0.5 * Math.sin(performance_time() * 0.004);
    const r = 15 + pulse * 5;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(170, 255, 170, ${0.55 + 0.25 * pulse})`);
    grad.addColorStop(1, 'rgba(170, 255, 170, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawParticles() {
    for (const p of particles) {
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
    }
    ctx.globalAlpha = 1;
  }

  function draw() {
    ctx.drawImage(bg, 0, 0);

    for (const h of humans) {
      const dir = Math.abs(h.vx) > Math.abs(h.vy) ? (h.vx > 0 ? 'right' : 'left') : (h.vy > 0 ? 'down' : 'up');
      drawHumanoid(h.x, h.y, h.skin.body, h.skin.head, dir);
    }

    for (const p of pals) {
      drawHumanoid(p.x, p.y, '#3f7a3f', '#6fae4f', 'down');
    }

    drawPlayerGlow(player.x, player.y);
    ctx.save();
    ctx.shadowColor = '#9dffa0';
    ctx.shadowBlur = 8;
    drawHumanoid(player.x, player.y, '#1f5f2f', '#9dffa0', player.dir);
    ctx.restore();

    drawParticles();
  }

  // ---------- Main loop ----------
  function loop() {
    update();
    updateParticles();
    draw();
    requestAnimationFrame(loop);
  }

  // Set up level 1 for an idle preview behind the start overlay; actual play
  // (with a fresh map + timer) begins on the first real Start/input.
  beginLevel(1);
  stage = 'intro';
  running = false;
  draw();
  loop();
})();
