// Position illustrations: two jointed figures on a mat, side view, 320x180.
// "you" is always coral, "partner" is always ink. Far limbs are shaded so depth reads.
// Every position is pure coordinate data; the renderer keeps the style identical.

const FIGURE_PALETTE = {
  you: { main: "#EF6A4D", far: "#C94A33", belt: "#F6F3EC", bar: "#2A2A2A" },
  partner: { main: "#1B2A3A", far: "#3D5166", belt: "#F6F3EC", bar: null },
};

const DEFAULT_ORDER = [
  ["you", "far"], ["partner", "far"], ["partner", "body"], ["partner", "near"],
  ["partner", "head"], ["you", "body"], ["you", "near"], ["you", "head"],
];

// Each figure: head [x,y]; facing [dx,dy] (where the face points); torso [[shoulder],[hip]];
// arms/legs: near and far chains of three joints [start, middle, end].
const POSITIONS = {
  mount: {
    name: "Mount",
    caption: "Top player sits astride the partner's hips, knees on the mat, facing the head.",
    partner: {
      head: [52, 124], facing: [0, -1], torso: [[72, 124], [172, 124]],
      arms: { near: [[84, 120], [102, 94], [131, 101]] },
      legs: { near: [[172, 124], [216, 112], [270, 132]], far: [[172, 126], [214, 118], [266, 134]] },
    },
    you: {
      head: [160, 28], facing: [-1, 0], torso: [[160, 52], [160, 98]],
      arms: { near: [[156, 54], [128, 74], [102, 105]], far: [[164, 56], [140, 76], [116, 107]] },
      legs: { near: [[158, 102], [148, 130], [198, 135]], far: [[166, 100], [182, 128], [232, 133]] },
    },
  },
  closed_guard: {
    name: "Closed guard",
    caption: "Bottom player's legs are locked behind the top player's back.",
    partner: {
      head: [46, 124], facing: [0, -1], torso: [[66, 124], [152, 124]],
      arms: { near: [[78, 120], [100, 92], [156, 79]] },
      legs: { near: [[152, 124], [196, 88], [228, 100]], far: [[152, 124], [200, 84], [228, 90]] },
    },
    you: {
      head: [190, 30], facing: [-1, 0], torso: [[190, 54], [190, 102]],
      arms: { near: [[186, 56], [162, 72], [142, 105]], far: [[192, 56], [170, 74], [152, 105]] },
      legs: { near: [[188, 106], [176, 134], [224, 135]], far: [[194, 104], [200, 132], [248, 134]] },
    },
    order: [
      ["you", "far"], ["partner", "far"], ["partner", "body"], ["you", "body"],
      ["partner", "near"], ["you", "near"], ["partner", "head"], ["you", "head"],
    ],
  },
  half_guard: {
    name: "Half guard",
    caption: "Bottom player traps one of the top player's legs between their own.",
    partner: {
      head: [46, 124], facing: [0, -1], torso: [[66, 124], [152, 124]],
      arms: { near: [[78, 120], [104, 96], [146, 92]] },
      legs: { near: [[152, 124], [188, 108], [208, 134]], far: [[152, 124], [186, 126], [220, 135]] },
    },
    you: {
      head: [192, 32], facing: [-1, 0], torso: [[190, 56], [188, 104]],
      arms: { near: [[186, 58], [160, 74], [134, 100]], far: [[194, 58], [176, 80], [160, 102]] },
      legs: { near: [[186, 108], [176, 134], [220, 135]], far: [[194, 104], [226, 108], [252, 134]] },
    },
    order: [
      ["you", "far"], ["partner", "far"], ["partner", "body"], ["you", "body"],
      ["you", "near"], ["partner", "near"], ["partner", "head"], ["you", "head"],
    ],
  },
  side_control: {
    name: "Side control",
    caption: "Top player lies chest-to-chest across the partner, past their legs.",
    partner: {
      head: [52, 124], facing: [0, -1], torso: [[72, 124], [172, 124]],
      arms: { near: [[84, 120], [96, 98], [112, 86]] },
      legs: { near: [[172, 124], [216, 114], [268, 132]], far: [[172, 126], [214, 120], [264, 134]] },
    },
    you: {
      head: [84, 84], facing: [-1, 0.2], torso: [[104, 96], [150, 116]],
      arms: { near: [[106, 98], [92, 120], [70, 132]], far: [[110, 92], [138, 106], [178, 118]] },
      legs: { near: [[152, 118], [172, 135], [214, 136]], far: [[154, 114], [186, 132], [226, 134]] },
    },
  },
  knee_on_belly: {
    name: "Knee on belly",
    caption: "Top player drives one knee into the partner's belly, other foot posted wide.",
    partner: {
      head: [52, 124], facing: [0, -1], torso: [[72, 124], [172, 124]],
      arms: { near: [[84, 120], [104, 100], [128, 106]] },
      legs: { near: [[172, 124], [216, 114], [268, 132]], far: [[172, 126], [214, 120], [264, 134]] },
    },
    you: {
      head: [150, 22], facing: [-1, 0], torso: [[150, 46], [150, 92]],
      arms: { near: [[146, 50], [124, 70], [100, 104]], far: [[156, 50], [170, 74], [172, 106]] },
      legs: { near: [[146, 96], [128, 110], [170, 120]], far: [[154, 96], [196, 104], [224, 134]] },
    },
  },
  back_control: {
    name: "Back control",
    caption: "Both seated. The attacker is behind with a seatbelt grip and both hooks in.",
    partner: {
      head: [116, 44], facing: [-1, 0], torso: [[120, 66], [132, 110]],
      arms: { near: [[122, 70], [100, 90], [110, 64]] },
      legs: { near: [[132, 110], [96, 120], [66, 134]], far: [[134, 108], [100, 116], [70, 132]] },
    },
    you: {
      head: [150, 36], facing: [-1, 0], torso: [[152, 60], [160, 108]],
      arms: { near: [[148, 62], [128, 70], [112, 84]], far: [[156, 66], [140, 90], [118, 96]] },
      legs: { near: [[158, 110], [130, 126], [100, 118]], far: [[162, 106], [134, 122], [104, 114]] },
    },
    order: [
      ["you", "body"], ["you", "head"], ["you", "far"], ["partner", "far"], ["partner", "body"],
      ["partner", "near"], ["partner", "head"], ["you", "near"],
    ],
  },
  turtle: {
    name: "Turtle",
    caption: "Bottom player is on hands and knees; the top player controls from behind.",
    partner: {
      head: [58, 92], facing: [-1, 0], torso: [[80, 88], [160, 96]],
      arms: { near: [[84, 94], [80, 118], [72, 136]], far: [[92, 94], [96, 118], [90, 136]] },
      legs: { near: [[160, 96], [168, 134], [210, 136]], far: [[164, 94], [180, 132], [222, 134]] },
    },
    you: {
      head: [170, 44], facing: [-1, 0], torso: [[176, 66], [204, 104]],
      arms: { near: [[172, 70], [144, 86], [124, 100]], far: [[182, 70], [160, 96], [150, 110]] },
      legs: { near: [[204, 106], [214, 134], [256, 136]], far: [[208, 102], [238, 120], [272, 134]] },
    },
  },
  north_south: {
    name: "North-south",
    caption: "Top player is chest-down over the partner, facing the opposite direction.",
    partner: {
      head: [268, 124], facing: [0, -1], torso: [[248, 124], [148, 124]],
      arms: { near: [[236, 120], [214, 104], [190, 110]] },
      legs: { near: [[148, 124], [104, 114], [52, 132]], far: [[148, 126], [106, 120], [56, 134]] },
    },
    you: {
      head: [140, 88], facing: [-1, 0.3], torso: [[160, 96], [222, 100]],
      arms: { near: [[164, 100], [150, 118], [134, 132]], far: [[168, 96], [186, 116], [200, 132]] },
      legs: { near: [[224, 102], [252, 128], [292, 134]], far: [[228, 100], [262, 124], [300, 132]] },
    },
    order: [
      ["you", "far"], ["partner", "far"], ["partner", "body"], ["partner", "near"],
      ["you", "body"], ["you", "near"], ["you", "head"], ["partner", "head"],
    ],
  },
};

const Figures = (() => {
  const seg = (a, b, w, color) =>
    `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;

  const arm = (p, color) =>
    seg(p[0], p[1], 11, color) + seg(p[1], p[2], 10, color) +
    `<circle cx="${p[2][0]}" cy="${p[2][1]}" r="6" fill="${color}"/>`;

  const leg = (p, color) =>
    seg(p[0], p[1], 15, color) + seg(p[1], p[2], 13, color) +
    `<ellipse cx="${p[2][0]}" cy="${p[2][1]}" rx="9" ry="5" fill="${color}"/>`;

  function body(fig, pal) {
    const [s, h] = fig.torso;
    let out = seg(s, h, 24, pal.main);
    const dx = h[0] - s[0], dy = h[1] - s[1];
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const nx = -uy, ny = ux;
    const px = h[0] - ux * 10, py = h[1] - uy * 10;
    out += seg([px - nx * 14, py - ny * 14], [px + nx * 14, py + ny * 14], 8, pal.belt);
    if (pal.bar) out += seg([px + nx * 4, py + ny * 4], [px + nx * 11, py + ny * 11], 8, pal.bar);
    return out;
  }

  function head(fig, pal) {
    const [x, y] = fig.head;
    const f = fig.facing || [-1, 0];
    const fl = Math.hypot(f[0], f[1]) || 1;
    const fx = f[0] / fl, fy = f[1] / fl;
    const ex = x + fx * 7.5, ey = y + fy * 7.5;
    return `<circle cx="${x}" cy="${y}" r="14" fill="${pal.main}"/>` +
      `<circle cx="${ex}" cy="${ey}" r="3.4" fill="#FFFFFF"/>` +
      `<circle cx="${ex + fx}" cy="${ey + fy}" r="1.7" fill="#1B2A3A"/>`;
  }

  function part(fig, pal, which) {
    if (which === "body") return body(fig, pal);
    if (which === "head") return head(fig, pal);
    const color = which === "far" ? pal.far : pal.main;
    let out = "";
    if (fig.legs && fig.legs[which]) out += leg(fig.legs[which], color);
    if (fig.arms && fig.arms[which]) out += arm(fig.arms[which], color);
    return out;
  }

  function render(id) {
    const p = POSITIONS[id];
    if (!p) return "";
    const order = p.order || DEFAULT_ORDER;
    let out = `<rect x="8" y="140" width="304" height="28" rx="10" fill="var(--mat, #E3EAEF)"/>` +
      `<rect x="8" y="140" width="304" height="8" rx="4" fill="var(--mat-edge, #C5D0D8)"/>`;
    for (const [who, which] of order) out += part(p[who], FIGURE_PALETTE[who], which);
    return `<svg viewBox="0 0 320 180" width="100%" fill="none" role="img" aria-label="${p.name}: ${p.caption}">${out}</svg>`;
  }

  const names = () => Object.fromEntries(Object.entries(POSITIONS).map(([k, v]) => [k, v.name]));

  return { render, names, POSITIONS };
})();
