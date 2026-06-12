/* ═══════════════════════════════════════
   TRAVELING LOGO — Single logo element
   Follows scroll through About → Manifesto → Services
   ─────────────────────────────────────
   Uses weighted proximity to each anchor's viewport center.
   Bidirectional: scroll up reverses position naturally.
   Chromatic aberration preset blends per zone.
═══════════════════════════════════════ */

/* Per-zone aberration presets (blended during transitions) */
const AB_PRESETS = {
  about:     { r: -12, b: 12, g:  5 },   // standard: horizontal split
  manifesto: { r: -22, b:  4, g: -8 },   // strong R, weak B, inverted G (diagonal)
  services:  { r:  -6, b:  6, g: 12 },   // symmetric, stronger vertical G
};

export function initTravelingLogo() {
  if (window.matchMedia('(max-width: 640px)').matches) return;
  const traveler = document.getElementById('logo-traveler');
  if (!traveler) return;

  const anchors = [
    { el: document.querySelector('.about-logo-col'),       size: 240, key: 'about'     },
    { el: document.querySelector('.manifesto-logo-col'),   size: 280, key: 'manifesto' },
    { el: document.querySelector('.services-logo-anchor'), size: 110, key: 'services'  },
  ];

  if (anchors.some(a => !a.el)) {
    console.warn('[TravelingLogo] anchor element missing');
    return;
  }

  /* Smooth state */
  let cx = 0, cy = 0, cSize = anchors[0].size, cOpacity = 0;
  let initialized = false;

  function lerp(a, b, t) { return a + (b - a) * t; }

  /* How "centred" is a rect in the viewport? 1 = perfectly centred, 0 = far away */
  function score(rect) {
    const vh   = window.innerHeight;
    const cy2  = rect.top + rect.height * 0.5;
    const dist = Math.abs(cy2 - vh * 0.5);
    return Math.max(0, 1 - dist / (vh * 0.55));
  }

  /* Is the element visible (within `margin` px of viewport)? */
  function near(rect, margin) {
    return rect.bottom > -margin && rect.top < window.innerHeight + margin;
  }

  function tick() {
    requestAnimationFrame(tick);

    const rects = anchors.map(a => a.el.getBoundingClientRect());

    const scores = rects.map(score);
    const total  = scores.reduce((a, b) => a + b, 0);

    /* Visibility: anchor must be within 60 px of viewport — avoids bleeding into hero */
    const anyNear = rects.some(r => near(r, 60));

    let tx, ty, tSize, tOpacity;

    if (!anyNear) {
      /* All anchors off-screen — hide (logo scrolled past or not yet reached) */
      tOpacity = 0;
      tx = cx; ty = cy; tSize = cSize;
    } else if (total < 0.02) {
      /* Transition gap: between sections but still near viewport — hold last pos */
      tOpacity = 1;
      tx = cx; ty = cy; tSize = cSize;
    } else {
      tOpacity = 1;
      const wts = scores.map(s => s / total);

      tx    = 0; ty    = 0; tSize = 0;
      let tR = 0, tB = 0, tG = 0;

      for (let i = 0; i < anchors.length; i++) {
        const r   = rects[i];
        const w   = wts[i];
        const p   = AB_PRESETS[anchors[i].key];
        tx    += (r.left + r.width  * 0.5) * w;
        ty    += (r.top  + r.height * 0.5) * w;
        tSize += anchors[i].size           * w;
        tR    += p.r * w;
        tB    += p.b * w;
        tG    += p.g * w;
      }

      /* Write blended aberration as inline CSS vars on the traveler
         These override the global --logo-ab-* from AmbientRGB.js  */
      traveler.style.setProperty('--t-ab-r', tR.toFixed(1) + 'px');
      traveler.style.setProperty('--t-ab-b', tB.toFixed(1) + 'px');
      traveler.style.setProperty('--t-ab-g', tG.toFixed(1) + 'px');
    }

    if (!initialized) {
      cx = tx; cy = ty; cSize = tSize; cOpacity = 0;
      initialized = true;
    }

    const lf = 0.09;
    cx       += (tx       - cx)       * lf;
    cy       += (ty       - cy)       * lf;
    cSize    += (tSize    - cSize)    * lf;
    cOpacity += (tOpacity - cOpacity) * 0.06;

    traveler.style.left      = Math.round(cx)    + 'px';
    traveler.style.top       = Math.round(cy)    + 'px';
    traveler.style.width     = Math.round(cSize) + 'px';
    traveler.style.height    = Math.round(cSize) + 'px';
    traveler.style.transform = 'translate(-50%, -50%)';
    traveler.style.opacity   = cOpacity.toFixed(3);
  }

  tick();
}
