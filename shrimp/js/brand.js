// Brand assets: the belted Shrimp mascot, the icon mark, and the stroke icon set.

const Brand = (() => {
  // Belted shrimp. `stripes` (0-4) shows on the belt's black bar so the mascot ranks up with the player.
  // `belt` is the belt color name: white | blue.
  function mascot({ size = 120, stripes = 0, belt = "white", mood = "happy" } = {}) {
    const beltColor = belt === "blue" ? "#2C6FD1" : "#F6F3EC";
    const beltEdge = belt === "blue" ? "#1F55A6" : "#DAD5C8";
    const stripeMarks = [19.5, 23.5, 27.5, 31.5].slice(0, Math.max(0, Math.min(4, stripes)))
      .map((y) => `<path d="M55 ${y} L 61 ${y}" stroke="#FFFFFF" stroke-width="1.4"/>`).join("");
    const mouth = mood === "happy"
      ? `<path d="M92 68 q 7 6 14 0" stroke="#1B2A3A" stroke-width="2.4" stroke-linecap="round"/>`
      : mood === "sad"
        ? `<path d="M92 72 q 7 -6 14 0" stroke="#1B2A3A" stroke-width="2.4" stroke-linecap="round"/>`
        : `<path d="M90 66 q 8 9 16 0" stroke="#1B2A3A" stroke-width="2.4" stroke-linecap="round"/>`;
    return `<svg width="${size}" height="${Math.round(size * 0.83)}" viewBox="0 0 120 100" fill="none" role="img" aria-label="Shrimp, the mascot">
      <path d="M22 68 C 18 24, 90 12, 96 56" stroke="#EF6A4D" stroke-width="24" stroke-linecap="round"/>
      <path d="M22 68 L 6 56 L 14 72 L 4 82 L 22 76 Z" fill="#EF6A4D"/>
      <path d="M40 62 l-4 12 M52 58 l-2 12 M64 57 l1 12 M76 59 l4 11" stroke="#C94A33" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M56 9 L 60 35" stroke="${beltEdge}" stroke-width="10" stroke-linecap="butt"/>
      <path d="M56 9 L 60 35" stroke="${beltColor}" stroke-width="7" stroke-linecap="butt"/>
      <path d="M57.2 17 L 58.6 30" stroke="#2A2A2A" stroke-width="7" stroke-linecap="butt"/>
      ${stripeMarks}
      <rect x="55" y="34" width="10" height="7" rx="2" fill="${beltColor}" stroke="${beltEdge}" stroke-width="1.5"/>
      <path d="M57 41 L 52 52 M63 41 L 67 52" stroke="${beltColor}" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="96" cy="60" r="17" fill="#EF6A4D"/>
      <path d="M104 45 C 110 35, 117 31, 119 21 M100 43 C 104 33, 106 29, 106 19" stroke="#C94A33" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="100" cy="56" r="7" fill="#FFFFFF"/>
      <circle cx="102" cy="57" r="3.6" fill="#1B2A3A"/>
      <circle cx="103.2" cy="55.6" r="1.1" fill="#FFFFFF"/>
      ${mouth}
      <circle cx="88" cy="66" r="3" fill="#F9A08B"/>
    </svg>`;
  }

  function iconMark(size = 32) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 120 120" fill="none" role="img" aria-label="Shrimp">
      <rect x="4" y="4" width="112" height="112" rx="28" fill="#EF6A4D"/>
      <path d="M32 80 C 30 40, 88 34, 90 68" stroke="#FFFFFF" stroke-width="18" stroke-linecap="round"/>
      <path d="M32 80 L 20 70 L 26 82 L 18 92 L 32 87 Z" fill="#FFFFFF"/>
      <circle cx="90" cy="72" r="14" fill="#FFFFFF"/>
      <circle cx="94" cy="70" r="3.8" fill="#1B2A3A"/>
      <path d="M98 58 C 103 50, 108 48, 110 40" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  }

  const faviconHref = () =>
    "data:image/svg+xml," + encodeURIComponent(iconMark(64).replace(/\s+/g, " "));

  const stroke = (paths, extra = "") =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" ${extra}>${paths}</svg>`;
  const solid = (paths) => `<svg viewBox="0 0 24 24" fill="currentColor">${paths}</svg>`;

  const icons = {
    check: stroke('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    lock: stroke('<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    play: solid('<path d="M8 6.5v11l9-5.5z"/>'),
    video: stroke('<rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10l5-3v10l-5-3z"/>'),
    flame: solid('<path d="M12 2.5c.8 3.2 4.5 5 4.5 9.3a4.5 4.5 0 0 1-9 0c0-1.7.7-3 1.6-4.1.3 1.4 1.1 2.2 2.1 2.7C11 8.6 11.5 5.8 12 2.5z"/>'),
    star: solid('<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.9l-5.3 2.8 1.1-5.9L3.5 9.7l5.9-.8z"/>'),
    heart: solid('<path d="M12 20s-7-4.4-7-9.5A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.5C19 15.6 12 20 12 20z"/>'),
    heartOutline: stroke('<path d="M12 20s-7-4.4-7-9.5A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.5C19 15.6 12 20 12 20z"/>'),
    close: stroke('<path d="M6 6l12 12M18 6L6 18"/>'),
    back: stroke('<path d="M15 5l-7 7 7 7"/>'),
    soundOn: stroke('<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6"/><path d="M18 6.5a8 8 0 0 1 0 11"/>'),
    soundOff: stroke('<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>'),
    target: stroke('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>'),
    external: stroke('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
  };

  // Belt graphic with a black bar and up to 4 stripes.
  function belt({ color = "white", stripes = 0, width = "100%" } = {}) {
    const bg = color === "blue" ? "#2C6FD1" : "#F6F3EC";
    const edge = color === "blue" ? "#1F55A6" : "#DAD5C8";
    const slots = [0, 1, 2, 3].map((i) =>
      `<div class="belt-stripe${i < stripes ? " on" : ""}"></div>`).join("");
    return `<div class="belt" style="width:${width}; background:${bg}; border-color:${edge};">
      <div class="belt-bar">${slots}</div>
    </div>`;
  }

  return { mascot, iconMark, faviconHref, icons, belt };
})();
