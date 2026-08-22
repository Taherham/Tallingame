(() => {
  'use strict';

  // ---------- Config ----------
  const TILE = 16;
  const COLS = 25;
  const ROWS = 25;
  const W = COLS * TILE;
  const H = ROWS * TILE;
  const RENDER_SCALE = 3; // internal supersampling for crisp, non-pixelated art

  const ENTITY_R = 6;
  const FORMATION_R = 26;
  const PAL_CHASE_R = 95;
  const PANIC_R = 42;
  const SPEED_HUMAN_WANDER = 0.6;
  const SPEED_PAL_FOLLOW = 1.5;

  const SPRINT_COOLDOWN_MS = 30000;
  const SPRINT_DURATION_MS = 3000;
  const SPRINT_MULT = 2;

  // Difficulty ramps across 3 levels: more people, a bigger/more alert
  // detection radius, a tighter catch radius, and a denser street grid
  // each time. fleeRadius is kept small on purpose: since a fleeing human
  // is slightly faster than a zombie, the real skill is closing in
  // *before* they notice you (while they're still wandering, which is
  // much slower) rather than out-running them once alerted -- that only
  // works via cornering.
  //
  // Each level has a fixed seed, so the city layout, its decor, and every
  // spawn point are identical on every playthrough -- best times are
  // actually comparable, and there's no chance of a random layout being
  // unfair.
  const LEVELS = [
    { humanCount: 30, fleeSpeed: 1.15, fleeRadius: 38, catchRadius: 12, minBlock: 3, maxBlock: 4, seed: 1001 },
    { humanCount: 45, fleeSpeed: 1.30, fleeRadius: 41, catchRadius: 11, minBlock: 3, maxBlock: 5, seed: 2002 },
    { humanCount: 65, fleeSpeed: 1.45, fleeRadius: 44, catchRadius: 10, minBlock: 4, maxBlock: 6, seed: 3003 },
  ];

  // Zombies are deliberately a bit slower than a fleeing human -- catching
  // relies on cornering with your horde and cutting off routes, not on
  // out-running people in a straight line (which is mathematically
  // impossible once they're alerted: pursuer must close via geometry).
  // Sprint is the tactical exception: a short, cooldown-gated burst.
  let SPEED_HUMAN_FLEE = LEVELS[0].fleeSpeed;
  let SPEED_PLAYER = LEVELS[0].fleeSpeed * 0.94;
  let SPEED_PAL_CHASE = LEVELS[0].fleeSpeed * 0.97;
  let HUMAN_FLEE_R = LEVELS[0].fleeRadius;
  let CATCH_R = LEVELS[0].catchRadius;

  // Humans stay dark/muted so they read clearly as "not yours"; horde pals
  // are bright green, and the player is a distinct bright blue so you can
  // always pick yourself out from your own horde at a glance.
  const HUMAN_PALETTES = [
    { bodyLight: '#5a4a42', bodyDark: '#241c18', headLight: '#7a675a', headDark: '#4a3d34' },
    { bodyLight: '#3f4a58', bodyDark: '#181d24', headLight: '#5c6b7a', headDark: '#33404c' },
    { bodyLight: '#4a3f52', bodyDark: '#1d181f', headLight: '#6b5c73', headDark: '#40354a' },
    { bodyLight: '#5c5449', bodyDark: '#26221c', headLight: '#7d7367', headDark: '#4c453a' },
    { bodyLight: '#523f3f', bodyDark: '#1f1818', headLight: '#735c5c', headDark: '#4a3333' },
  ];
  const PAL_COLORS = { bodyLight: '#5be08c', bodyDark: '#175c34', headLight: '#8dffb8', headDark: '#2f8a55', glow: '#4be08c' };
  const PLAYER_COLORS = { bodyLight: '#bdeeff', bodyDark: '#1f7aa8', headLight: '#eafcff', headDark: '#3fa9d6', glow: '#5cc8ff' };

  // ---------- Canvas (rendered at RENDER_SCALE for a smooth, non-pixelated look) ----------
  const canvas = document.getElementById('board');
  canvas.width = W * RENDER_SCALE;
  canvas.height = H * RENDER_SCALE;
  const ctx = canvas.getContext('2d');
  ctx.scale(RENDER_SCALE, RENDER_SCALE);
  ctx.imageSmoothingEnabled = true;

  const bg = document.createElement('canvas');
  bg.width = W * RENDER_SCALE;
  bg.height = H * RENDER_SCALE;
  const bctx = bg.getContext('2d');
  bctx.scale(RENDER_SCALE, RENDER_SCALE);
  bctx.imageSmoothingEnabled = true;

  // ---------- Deterministic per-level randomness ----------
  // A tiny seedable PRNG (mulberry32) so each level's city, decor, and
  // spawn points are pixel-identical every time it's played. Reseeded at
  // the top of setupLevel(); everything generated during level setup pulls
  // from this instead of Math.random(). Live gameplay AI (wander timing,
  // flee wobble, panic, particles) keeps using plain Math.random() -- only
  // the initial layout needs to be reproducible.
  function mulberry32(seed) {
    let s = seed >>> 0;
    return function () {
      s |= 0; s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  let levelRand = Math.random;

  // ---------- Map: 0 = walkable, 1 = building. Built once per level from its seed. ----------
  let map = [];
  let walkableTiles = [];

  // Splits a length into alternating street/block segments (street, block,
  // street, block, ..., street), with block sizes randomized per level
  // difficulty. This is what turns the city into a real street grid instead
  // of scattered obstacles.
  function subdivide(total, minBlock, maxBlock, streetWidth) {
    const segs = [{ type: 'street', start: 0, size: streetWidth }];
    let pos = streetWidth;
    while (pos < total - streetWidth) {
      const size = Math.min(
        minBlock + Math.floor(levelRand() * (maxBlock - minBlock + 1)),
        total - streetWidth - pos
      );
      if (size < 2) break;
      segs.push({ type: 'block', start: pos, size });
      pos += size;
      if (pos >= total - streetWidth) break;
      const sSize = Math.min(streetWidth, total - streetWidth - pos);
      if (sSize <= 0) break;
      segs.push({ type: 'street', start: pos, size: sSize });
      pos += sSize;
    }
    if (pos < total) segs.push({ type: 'street', start: pos, size: total - pos });
    return segs;
  }

  const CAR_COLORS = ['#7a3f3f', '#3f5a7a', '#5a5a5a', '#6b5a3f', '#3f5a4f'];
  const PROP_TYPES = ['trashcan', 'suitcase', 'skidmarks'];

  function generateCity(cfg) {
    const STREET_W = 2;
    const colSegs = subdivide(COLS, cfg.minBlock, cfg.maxBlock, STREET_W);
    const rowSegs = subdivide(ROWS, cfg.minBlock, cfg.maxBlock, STREET_W);

    const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    const buildingRects = [];
    function addBuilding(x, y, w, h) {
      if (w < 1 || h < 1) return;
      for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) grid[yy][xx] = 1;
      buildingRects.push({ x, y, w, h });
    }

    for (const rowSeg of rowSegs) {
      if (rowSeg.type !== 'block') continue;
      for (const colSeg of colSegs) {
        if (colSeg.type !== 'block') continue;
        const cx = colSeg.start, cy = rowSeg.start, cw = colSeg.size, ch = rowSeg.size;
        // Streets already separate every block from its neighbors, so a
        // building can fill essentially the whole cell -- no interior tile
        // margin needed (the sidewalk is drawn as a few-pixel visual pad in
        // renderMap, not carved out of the collision grid).
        const roll = levelRand();
        if (roll < 0.12) {
          continue; // open plaza -- no building this block
        } else if (roll < 0.32 && cw >= 4 && ch >= 3) {
          // Split into two side-by-side buildings, 1 tile apart, for skyline variety.
          const w1 = Math.max(1, Math.floor((cw - 1) / 2));
          const w2 = Math.max(1, cw - 1 - w1);
          addBuilding(cx, cy, w1, ch);
          addBuilding(cx + w1 + 1, cy, w2, ch);
        } else {
          addBuilding(cx, cy, cw, ch);
        }
      }
    }

    // Streetlights and parked cars line every street corridor.
    const streetlights = [];
    const parkedCars = [];
    for (const seg of colSegs) {
      if (seg.type !== 'street') continue;
      const lightX = seg.start * TILE + TILE * 0.25;
      for (let y = 3; y < ROWS - 2; y += 6) {
        streetlights.push({ x: lightX, y: y * TILE + (levelRand() * 6 - 3) });
      }
      const carX = seg.start * TILE + TILE * 0.75;
      for (let y = 5; y < ROWS - 3; y += 5) {
        if (levelRand() < 0.55) {
          parkedCars.push({ x: carX, y: y * TILE + (levelRand() * 4 - 2), vertical: true, color: CAR_COLORS[(levelRand() * CAR_COLORS.length) | 0] });
        }
      }
    }
    for (const seg of rowSegs) {
      if (seg.type !== 'street') continue;
      const lightY = seg.start * TILE + TILE * 0.25;
      for (let x = 3; x < COLS - 2; x += 6) {
        streetlights.push({ x: x * TILE + (levelRand() * 6 - 3), y: lightY });
      }
      const carY = seg.start * TILE + TILE * 0.75;
      for (let x = 5; x < COLS - 3; x += 5) {
        if (levelRand() < 0.55) {
          parkedCars.push({ x: x * TILE + (levelRand() * 4 - 2), y: carY, vertical: false, color: CAR_COLORS[(levelRand() * CAR_COLORS.length) | 0] });
        }
      }
    }

    // Crosswalks at most (not all) street/street intersections, for variety.
    const crosswalks = [];
    for (const colSeg of colSegs) {
      if (colSeg.type !== 'street') continue;
      for (const rowSeg of rowSegs) {
        if (rowSeg.type !== 'street') continue;
        if (levelRand() < 0.6) {
          crosswalks.push({ x: colSeg.start * TILE, y: rowSeg.start * TILE, w: colSeg.size * TILE, h: rowSeg.size * TILE });
        }
      }
    }

    // A handful of fixed "outbreak in progress" set pieces on open streets.
    const streetTiles = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (grid[y][x] === 0) streetTiles.push({ x, y });
      }
    }
    const props = [];
    for (let i = 0; i < 4; i++) {
      const t = streetTiles[(levelRand() * streetTiles.length) | 0];
      props.push({
        type: PROP_TYPES[(levelRand() * PROP_TYPES.length) | 0],
        x: t.x * TILE + TILE / 2,
        y: t.y * TILE + TILE / 2,
        rot: levelRand() * Math.PI * 2,
      });
    }

    return { grid, buildingRects, colSegs, rowSegs, streetlights, parkedCars, crosswalks, props };
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

  // ---------- City rendering: streets, lights, cars, facades, decor ----------
  function drawParkedCar(car) {
    bctx.save();
    bctx.translate(car.x, car.y);
    if (!car.vertical) bctx.rotate(Math.PI / 2);
    bctx.fillStyle = 'rgba(0,0,0,0.3)';
    bctx.fillRect(-3.5, -6, 7, 13);
    bctx.fillStyle = car.color;
    bctx.fillRect(-3, -6.5, 6, 12);
    bctx.fillStyle = 'rgba(180, 210, 220, 0.55)';
    bctx.fillRect(-2.3, -4.5, 4.6, 3);
    bctx.fillStyle = 'rgba(0,0,0,0.4)';
    bctx.fillRect(-3, -6.5, 6, 1.2);
    bctx.fillRect(-3, 4.3, 6, 1.2);
    bctx.restore();
  }

  function drawStreetlight(light) {
    bctx.fillStyle = '#2a2f2c';
    bctx.fillRect(light.x - 0.8, light.y - 9, 1.6, 10);
    bctx.beginPath();
    bctx.arc(light.x, light.y - 10, 2.2, 0, Math.PI * 2);
    bctx.fillStyle = '#ffe6a3';
    bctx.fill();
  }

  function drawProp(prop) {
    bctx.save();
    bctx.translate(prop.x, prop.y);
    bctx.rotate(prop.rot);
    if (prop.type === 'trashcan') {
      bctx.fillStyle = 'rgba(0,0,0,0.3)';
      bctx.fillRect(-5, 1, 10, 2);
      bctx.fillStyle = '#4a4f45';
      bctx.fillRect(-4, -2, 8, 4);
      bctx.fillStyle = '#63685c';
      for (let i = -3; i <= 3; i += 2) bctx.fillRect(i, -2, 0.6, 4);
    } else if (prop.type === 'suitcase') {
      bctx.fillStyle = 'rgba(0,0,0,0.3)';
      bctx.fillRect(-4, 1.5, 8, 2);
      bctx.fillStyle = '#5a4030';
      bctx.fillRect(-4, -2.5, 8, 5);
      bctx.strokeStyle = '#3a281c';
      bctx.lineWidth = 0.6;
      bctx.strokeRect(-4, -2.5, 8, 5);
    } else {
      bctx.strokeStyle = 'rgba(15, 15, 15, 0.45)';
      bctx.lineWidth = 1.4;
      bctx.beginPath();
      bctx.moveTo(-9, 0);
      bctx.quadraticCurveTo(0, 4, 9, -1);
      bctx.stroke();
      bctx.beginPath();
      bctx.moveTo(-9, 3);
      bctx.quadraticCurveTo(0, 7, 9, 2);
      bctx.stroke();
    }
    bctx.restore();
  }

  function renderMap(city) {
    bctx.clearRect(0, 0, W, H);

    const roadGrad = bctx.createLinearGradient(0, 0, 0, H);
    roadGrad.addColorStop(0, '#2b3630');
    roadGrad.addColorStop(1, '#1c2622');
    bctx.fillStyle = roadGrad;
    bctx.fillRect(0, 0, W, H);

    // Subtle asphalt grime so the road isn't a flat fill.
    for (let i = 0; i < 260; i++) {
      const gx = levelRand() * W, gy = levelRand() * H;
      bctx.fillStyle = levelRand() < 0.5 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.03)';
      bctx.beginPath();
      bctx.arc(gx, gy, 1 + levelRand() * 2, 0, Math.PI * 2);
      bctx.fill();
    }

    // Dashed lane lines down every street's centerline.
    bctx.fillStyle = 'rgba(210, 200, 160, 0.35)';
    for (const seg of city.colSegs) {
      if (seg.type !== 'street') continue;
      const cx = seg.start * TILE + (seg.size * TILE) / 2 - 1;
      for (let y = 4; y < H - 4; y += 14) bctx.fillRect(cx, y, 2, 8);
    }
    for (const seg of city.rowSegs) {
      if (seg.type !== 'street') continue;
      const cy = seg.start * TILE + (seg.size * TILE) / 2 - 1;
      for (let x = 4; x < W - 4; x += 14) bctx.fillRect(x, cy, 8, 2);
    }

    // Crosswalks at intersections (drawn over the lane lines).
    for (const cw of city.crosswalks) {
      bctx.fillStyle = 'rgba(230, 225, 210, 0.55)';
      const stripeCount = Math.max(2, Math.floor(cw.w / 6));
      for (let i = 0; i < stripeCount; i++) {
        const sx = cw.x + (i + 0.5) * (cw.w / stripeCount) - 2;
        bctx.fillRect(sx, cw.y + 2, 4, cw.h - 4);
      }
    }

    // Building facades with lit / dark / broken windows.
    for (const rect of city.buildingRects) {
      const px = rect.x * TILE, py = rect.y * TILE;
      const pw = rect.w * TILE, ph = rect.h * TILE;

      bctx.fillStyle = '#3a463f';
      bctx.fillRect(px - 3, py - 3, pw + 6, ph + 6);

      bctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      bctx.fillRect(px + 3, py + 4, pw, ph);

      const facadeGrad = bctx.createLinearGradient(px, py, px, py + ph);
      facadeGrad.addColorStop(0, '#48565e');
      facadeGrad.addColorStop(1, '#252f34');
      bctx.fillStyle = facadeGrad;
      bctx.fillRect(px, py, pw, ph);

      bctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
      bctx.fillRect(px, py, pw, 2);
      bctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      bctx.fillRect(px + pw - 3, py, 3, ph);
      bctx.fillRect(px, py + ph - 3, pw, 3);

      for (let ty = rect.y; ty < rect.y + rect.h; ty++) {
        for (let tx = rect.x; tx < rect.x + rect.w; tx++) {
          const wx = tx * TILE + TILE / 2 - 3;
          const wy = ty * TILE + TILE / 2 - 3;
          const roll = levelRand();
          if (roll < 0.13) {
            bctx.fillStyle = '#10151a';
            bctx.fillRect(wx, wy, 6, 6);
            bctx.strokeStyle = 'rgba(180, 195, 200, 0.5)';
            bctx.lineWidth = 0.5;
            bctx.beginPath();
            bctx.moveTo(wx + 1, wy);
            bctx.lineTo(wx + 3, wy + 3);
            bctx.lineTo(wx + 1.5, wy + 4);
            bctx.lineTo(wx + 5, wy + 6);
            bctx.stroke();
          } else if (roll < 0.42) {
            const wGrad = bctx.createRadialGradient(wx + 3, wy + 3, 0, wx + 3, wy + 3, 5);
            wGrad.addColorStop(0, '#ffe6a3');
            wGrad.addColorStop(1, '#e0a94f');
            bctx.fillStyle = wGrad;
            bctx.fillRect(wx, wy, 6, 6);
          } else {
            bctx.fillStyle = 'rgba(150, 175, 190, 0.35)';
            bctx.fillRect(wx, wy, 6, 6);
            bctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
            bctx.fillRect(wx, wy, 2, 6);
          }
        }
      }
    }

    for (const car of city.parkedCars) drawParkedCar(car);
    for (const light of city.streetlights) drawStreetlight(light);
    for (const prop of city.props) drawProp(prop);
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
    const t = walkableTiles[(levelRand() * walkableTiles.length) | 0];
    return {
      x: t.x * TILE + TILE / 2,
      y: t.y * TILE + TILE / 2,
    };
  }

  // ---------- Character sprites, pre-rendered once for performance ----------
  function makeCharacterSprite(colors) {
    const w = 20, h = 26;
    const cx = w / 2, cy = h / 2 + 2;
    const spr = document.createElement('canvas');
    spr.width = w * RENDER_SCALE;
    spr.height = h * RENDER_SCALE;
    const sctx = spr.getContext('2d');
    sctx.scale(RENDER_SCALE, RENDER_SCALE);
    sctx.imageSmoothingEnabled = true;

    if (colors.glow) {
      const glow = sctx.createRadialGradient(cx, cy - 2, 0, cx, cy - 2, 10);
      glow.addColorStop(0, colors.glow + '99');
      glow.addColorStop(1, colors.glow + '00');
      sctx.fillStyle = glow;
      sctx.beginPath();
      sctx.arc(cx, cy - 2, 10, 0, Math.PI * 2);
      sctx.fill();
    }

    sctx.beginPath();
    sctx.ellipse(cx, cy + 7, 5, 2, 0, 0, Math.PI * 2);
    sctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    sctx.fill();

    const bodyGrad = sctx.createRadialGradient(cx - 1.5, cy - 1, 0, cx, cy + 2, 7);
    bodyGrad.addColorStop(0, colors.bodyLight);
    bodyGrad.addColorStop(1, colors.bodyDark);
    sctx.beginPath();
    sctx.ellipse(cx, cy + 2, 4.6, 5.6, 0, 0, Math.PI * 2);
    sctx.fillStyle = bodyGrad;
    sctx.fill();

    const headGrad = sctx.createRadialGradient(cx - 1.2, cy - 6.5, 0, cx, cy - 5, 5);
    headGrad.addColorStop(0, colors.headLight);
    headGrad.addColorStop(1, colors.headDark);
    sctx.beginPath();
    sctx.arc(cx, cy - 5, 4.2, 0, Math.PI * 2);
    sctx.fillStyle = headGrad;
    sctx.fill();

    return { canvas: spr, w, h, cx, cy };
  }

  const humanSprites = HUMAN_PALETTES.map((p) => makeCharacterSprite(p));
  const palSprite = makeCharacterSprite(PAL_COLORS);
  const playerSprite = makeCharacterSprite(PLAYER_COLORS);

  function drawSprite(sprite, x, y) {
    ctx.drawImage(sprite.canvas, x - sprite.cx, y - sprite.cy, sprite.w, sprite.h);
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
  let player, pals, humans, particles, trail;
  let caught, running;
  let level = 1;
  let stage = 'intro'; // 'intro' | 'playing' | 'levelComplete' | 'gameComplete'
  let levelStartTime = 0;
  let totalElapsed = 0;
  let sprintCooldownUntil = 0;
  let sprintActiveUntil = 0;
  let hordeUnlocked = false;

  function setupLevel(n) {
    const cfg = LEVELS[n - 1];
    level = n;
    levelRand = mulberry32(cfg.seed);

    SPEED_HUMAN_FLEE = cfg.fleeSpeed;
    SPEED_PLAYER = cfg.fleeSpeed * 0.94;
    SPEED_PAL_CHASE = cfg.fleeSpeed * 0.97;
    HUMAN_FLEE_R = cfg.fleeRadius;
    CATCH_R = cfg.catchRadius;

    const city = generateCity(cfg);
    map = city.grid;
    rebuildWalkableTiles();
    renderMap(city);

    const p0 = randomWalkablePoint();
    player = { x: p0.x, y: p0.y, r: ENTITY_R, dir: 'down' };
    pals = [];
    particles = [];
    trail = [];
    sprintCooldownUntil = 0;
    sprintActiveUntil = 0;
    hordeUnlocked = false;
    hordeJoystickEl.classList.add('hidden');
    hordeJoystickEl.classList.remove('revealed');
    resetHordeJoystick();

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
        sprite: humanSprites[i % humanSprites.length],
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
    if (e.code === 'Space') { e.preventDefault(); tryActivateSprint(); }
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

  function updateJoystickVec(baseEl, knobEl, clientX, clientY) {
    const rect = baseEl.getBoundingClientRect();
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
    knobEl.style.transform = `translate(${dx}px, ${dy}px)`;
    return { x: dx / maxR, y: dy / maxR };
  }

  function resetJoystick() {
    joystickActive = false;
    joystickVec = { x: 0, y: 0 };
    joystickKnob.style.transform = 'translate(0px, 0px)';
  }

  joystickBase.addEventListener('pointerdown', (e) => {
    joystickActive = true;
    joystickBase.setPointerCapture(e.pointerId);
    joystickVec = updateJoystickVec(joystickBase, joystickKnob, e.clientX, e.clientY);
    startIfNeeded();
    e.preventDefault();
  });
  joystickBase.addEventListener('pointermove', (e) => {
    if (!joystickActive) return;
    joystickVec = updateJoystickVec(joystickBase, joystickKnob, e.clientX, e.clientY);
    e.preventDefault();
  });
  joystickBase.addEventListener('pointerup', resetJoystick);
  joystickBase.addEventListener('pointercancel', resetJoystick);

  // Horde-direction joystick: appears once you have your first pal. While
  // held, the whole horde generally heads that way instead of running its
  // usual chase-nearest/orbit-you logic; release it and they go right back
  // to hunting on their own.
  const hordeJoystickEl = document.getElementById('horde-joystick');
  const hordeJoystickBase = document.getElementById('horde-joystick-base');
  const hordeJoystickKnob = document.getElementById('horde-joystick-knob');
  let hordeJoystickActive = false;
  let hordeJoystickVec = { x: 0, y: 0 };

  function resetHordeJoystick() {
    hordeJoystickActive = false;
    hordeJoystickVec = { x: 0, y: 0 };
    hordeJoystickKnob.style.transform = 'translate(0px, 0px)';
  }

  hordeJoystickBase.addEventListener('pointerdown', (e) => {
    if (!hordeUnlocked) return;
    hordeJoystickActive = true;
    hordeJoystickBase.setPointerCapture(e.pointerId);
    hordeJoystickVec = updateJoystickVec(hordeJoystickBase, hordeJoystickKnob, e.clientX, e.clientY);
    e.preventDefault();
  });
  hordeJoystickBase.addEventListener('pointermove', (e) => {
    if (!hordeJoystickActive) return;
    hordeJoystickVec = updateJoystickVec(hordeJoystickBase, hordeJoystickKnob, e.clientX, e.clientY);
    e.preventDefault();
  });
  hordeJoystickBase.addEventListener('pointerup', resetHordeJoystick);
  hordeJoystickBase.addEventListener('pointercancel', resetHordeJoystick);

  function unlockHordeJoystick() {
    if (hordeUnlocked) return;
    hordeUnlocked = true;
    hordeJoystickEl.classList.remove('hidden');
    hordeJoystickEl.classList.add('revealed');
  }

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

  // ---------- Sprint button ----------
  const sprintBtn = document.getElementById('sprint-btn');

  function tryActivateSprint() {
    ensureAudio();
    if (!running) return;
    const now = performance_time();
    if (now < sprintCooldownUntil) return;
    sprintActiveUntil = now + SPRINT_DURATION_MS;
    sprintCooldownUntil = now + SPRINT_COOLDOWN_MS;
    playSprintSound();
  }

  sprintBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    tryActivateSprint();
  });

  function updateSprintUI() {
    const now = performance_time();
    const remain = sprintCooldownUntil - now;
    const progress = remain <= 0 ? 100 : Math.max(0, 100 - (remain / SPRINT_COOLDOWN_MS) * 100);
    sprintBtn.style.setProperty('--progress', progress.toFixed(1));
    sprintBtn.classList.toggle('active', now < sprintActiveUntil);
    sprintBtn.classList.toggle('ready', remain <= 0 && now >= sprintActiveUntil);
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

  function playSprintSound() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const dur = 0.28;
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + dur * 0.55);
    osc.frequency.exponentialRampToValueAtTime(280, now + dur);
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    gain.connect(masterGain);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + dur + 0.02);
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
    const sprinting = performance_time() < sprintActiveUntil;
    if (v.x !== 0 || v.y !== 0) {
      const mult = sprinting ? SPRINT_MULT : 1;
      const dx = v.x * SPEED_PLAYER * mult;
      const dy = v.y * SPEED_PLAYER * mult;
      moveEntity(player, dx, dy);
      if (Math.abs(dx) > Math.abs(dy)) player.dir = dx > 0 ? 'right' : 'left';
      else if (dy !== 0) player.dir = dy > 0 ? 'down' : 'up';
      if (sprinting) {
        trail.push({ x: player.x, y: player.y, life: 1 });
      }
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
    const hordeCommand = hordeJoystickActive && (hordeJoystickVec.x !== 0 || hordeJoystickVec.y !== 0);
    const count = pals.length;

    pals.forEach((pal, i) => {
      if (hordeCommand) {
        const mag = Math.min(1, Math.hypot(hordeJoystickVec.x, hordeJoystickVec.y));
        const desired = Math.atan2(hordeJoystickVec.y, hordeJoystickVec.x);
        const angle = steerOpen(pal.x, pal.y, pal.r, desired, pal.r + 8);
        moveEntity(pal, Math.cos(angle) * SPEED_PAL_CHASE * mag, Math.sin(angle) * SPEED_PAL_CHASE * mag);
        return;
      }

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
        color: Math.random() < 0.55 ? '#5be08c' : '#c94f4f',
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

    for (const t of trail) t.life -= 0.07;
    trail = trail.filter((t) => t.life > 0);
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
          pals.push({ x: h.x, y: h.y, r: ENTITY_R });
          caught += 1;
          spawnCatchBurst(h.x, h.y);
          playInfectSound(h.x);
          if (pals.length === 1) unlockHordeJoystick();
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
  function drawPlayerGlow(x, y) {
    const pulse = 0.5 + 0.5 * Math.sin(performance_time() * 0.004);
    const r = 16 + pulse * 5;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(120, 210, 255, ${0.5 + 0.25 * pulse})`);
    grad.addColorStop(1, 'rgba(120, 210, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawTrail() {
    for (const t of trail) {
      ctx.globalAlpha = Math.max(t.life, 0) * 0.65;
      const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, 6 * t.life + 1.5);
      grad.addColorStop(0, '#a8e2ff');
      grad.addColorStop(1, 'rgba(92, 200, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 6 * t.life + 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
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
    ctx.drawImage(bg, 0, 0, W, H);

    drawTrail();

    for (const h of humans) drawSprite(h.sprite, h.x, h.y);
    for (const p of pals) drawSprite(palSprite, p.x, p.y);

    drawPlayerGlow(player.x, player.y);
    drawSprite(playerSprite, player.x, player.y);

    drawParticles();
  }

  // ---------- Main loop ----------
  function loop() {
    update();
    updateParticles();
    updateSprintUI();
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
