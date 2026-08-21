(() => {
  'use strict';

  // ---------- Config ----------
  const TILE = 16;
  const COLS = 25;
  const ROWS = 25;
  const W = COLS * TILE;
  const H = ROWS * TILE;

  const HUMAN_COUNT = 50;
  const START_PALS = 0;

  const ENTITY_R = 6;
  const CATCH_R = 10;
  const PAL_CHASE_R = 95;
  const HUMAN_FLEE_R = 70;
  const FORMATION_R = 26;

  const SPEED_PLAYER = 1.7;
  const SPEED_PAL_FOLLOW = 1.5;
  const SPEED_PAL_CHASE = 1.9;
  const SPEED_HUMAN_WANDER = 0.6;
  const SPEED_HUMAN_FLEE = 1.35;

  // ---------- Canvas ----------
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const bg = document.createElement('canvas');
  bg.width = W;
  bg.height = H;
  const bctx = bg.getContext('2d');

  // ---------- Map: 0 = walkable, 1 = building ----------
  const map = [];
  for (let y = 0; y < ROWS; y++) {
    const row = [];
    for (let x = 0; x < COLS; x++) {
      const inBlock = (x % 5) < 3 && (y % 5) < 3;
      row.push(inBlock ? 1 : 0);
    }
    map.push(row);
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

  // Prerender the city once
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
  renderMap();

  // ---------- Spawning helpers ----------
  const walkableTiles = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (map[y][x] === 0) walkableTiles.push({ x, y });
    }
  }

  function randomWalkablePoint() {
    const t = walkableTiles[(Math.random() * walkableTiles.length) | 0];
    return {
      x: t.x * TILE + TILE / 2,
      y: t.y * TILE + TILE / 2,
    };
  }

  // ---------- Game state ----------
  let player, pals, humans, caught, running, won;

  function reset() {
    const p0 = randomWalkablePoint();
    player = { x: p0.x, y: p0.y, r: ENTITY_R, dir: 'down' };

    pals = [];
    for (let i = 0; i < START_PALS; i++) {
      const pt = randomWalkablePoint();
      pals.push({ x: pt.x, y: pt.y, r: ENTITY_R, hue: 'pal' });
    }

    humans = [];
    for (let i = 0; i < HUMAN_COUNT; i++) {
      const pt = randomWalkablePoint();
      humans.push({
        x: pt.x,
        y: pt.y,
        r: ENTITY_R - 1,
        vx: 0,
        vy: 0,
        wanderT: 0,
        fleeing: false,
        skin: HUMAN_PALETTES[i % HUMAN_PALETTES.length],
      });
    }

    caught = 0;
    won = false;
    running = false;
    document.getElementById('caught').textContent = '0';
    document.getElementById('total').textContent = String(HUMAN_COUNT);
    document.getElementById('horde').textContent = String(pals.length + 1);
  }

  const HUMAN_PALETTES = [
    { body: '#c94f4f', head: '#e8b98a' },
    { body: '#4f8dc9', head: '#f0c9a0' },
    { body: '#c9a94f', head: '#d9a978' },
    { body: '#8a4fc9', head: '#e8b98a' },
    { body: '#4fc98d', head: '#f0c9a0' },
    { body: '#c94fa0', head: '#d9a978' },
  ];

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

  // ---------- Audio: synthesized fear screams, no external assets ----------
  let audioCtx = null, masterGain = null;
  let activeScreams = 0;
  const MAX_CONCURRENT_SCREAMS = 5;

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

    let node = gain;
    if (audioCtx.createStereoPanner) {
      const pan = audioCtx.createStereoPanner();
      pan.pan.value = Math.max(-1, Math.min(1, (px / W) * 2 - 1));
      gain.connect(pan);
      node = pan;
    }
    node.connect(masterGain);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + dur + 0.02);
    osc.onended = () => { activeScreams--; };
  }

  function startIfNeeded() {
    ensureAudio();
    if (!running && !won) {
      running = true;
      document.getElementById('overlay').classList.add('hidden');
    }
  }

  document.getElementById('start-btn').addEventListener('click', () => {
    if (won) reset();
    startIfNeeded();
  });

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
        const dx = target.x - pal.x, dy = target.y - pal.y;
        const len = Math.hypot(dx, dy) || 1;
        moveEntity(pal, (dx / len) * SPEED_PAL_CHASE, (dy / len) * SPEED_PAL_CHASE);
      } else {
        const angle = (i / Math.max(count, 1)) * Math.PI * 2 + performance_time() * 0.0005;
        const tx = player.x + Math.cos(angle) * FORMATION_R;
        const ty = player.y + Math.sin(angle) * FORMATION_R;
        const dx = tx - pal.x, dy = ty - pal.y;
        const d = Math.hypot(dx, dy);
        if (d > 4) {
          moveEntity(pal, (dx / d) * SPEED_PAL_FOLLOW, (dy / d) * SPEED_PAL_FOLLOW);
        }
      }
    });
  }

  // performance.now() wrapper kept local to avoid polluting globals
  function performance_time() {
    return (typeof performance !== 'undefined' ? performance.now() : Date.now());
  }

  function updateHumans() {
    for (const h of humans) {
      const { entity, d } = nearestZombieTo(h);
      if (d < HUMAN_FLEE_R) {
        if (!h.fleeing) playScream(h.x);
        h.fleeing = true;
        const dx = h.x - entity.x, dy = h.y - entity.y;
        const len = Math.hypot(dx, dy) || 1;
        h.vx = (dx / len) * SPEED_HUMAN_FLEE;
        h.vy = (dy / len) * SPEED_HUMAN_FLEE;
        h.wanderT = 0;
      } else {
        h.fleeing = false;
        h.wanderT -= 1;
        if (h.wanderT <= 0) {
          const angle = Math.random() * Math.PI * 2;
          h.vx = Math.cos(angle) * SPEED_HUMAN_WANDER;
          h.vy = Math.sin(angle) * SPEED_HUMAN_WANDER;
          h.wanderT = 60 + Math.random() * 90;
        }
      }
      const beforeX = h.x, beforeY = h.y;
      moveEntity(h, h.vx, h.vy);
      if (Math.abs(h.x - beforeX) < 0.01 && Math.abs(h.vx) > 0.01) h.vx *= -1;
      if (Math.abs(h.y - beforeY) < 0.01 && Math.abs(h.vy) > 0.01) h.vy *= -1;
    }
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
          break;
        }
      }
      if (!wasCaught) stillFree.push(h);
    }
    humans = stillFree;
    document.getElementById('caught').textContent = String(caught);
    document.getElementById('horde').textContent = String(pals.length + 1);

    if (humans.length === 0 && !won) {
      won = true;
      running = false;
      const overlay = document.getElementById('overlay');
      document.getElementById('overlay-title').textContent = 'Outbreak Complete!';
      document.getElementById('overlay-msg').innerHTML =
        `The city has fallen. Final horde size: <b>${pals.length + 1}</b>.`;
      document.getElementById('start-btn').textContent = 'Play Again';
      overlay.classList.remove('hidden');
    }
  }

  function update() {
    if (!running) return;
    updatePlayer();
    updatePals();
    updateHumans();
    checkCatches();
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
  }

  // ---------- Main loop ----------
  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  reset();
  draw();
  loop();
})();
