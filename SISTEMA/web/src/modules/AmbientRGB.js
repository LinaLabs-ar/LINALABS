/* ═══════════════════════════════════════
   AMBIENT RGB v9 — Structural Lines + Chromatic Blobs + Mouse Corona + Sparkles
   ─────────────────────────────────────
   Layer 1: STRUCTURAL LINES — architectural grid + RGB diagonals, scroll-parallax
   Layer 2: RGB GRADIENT BLOBS — 6 large chromatic halos, mouse + scroll parallax
   Layer 3: MOUSE CHROMATIC CORONA — the reference-page effect:
            3 large RGB radial gradients (R, G, B) follow the mouse.
            Channels separate when mouse deviates from centre, creating
            visible chromatic aberration. Intensifies on fast mouse movement.
   Layer 4: SPARKLES — 480 luminous points, scroll-reactive

   Tab-hidden → paused automatically.
═══════════════════════════════════════ */

const COLORS      = [[255, 0, 0], [0, 255, 0], [0, 0, 255]];
const SPARK_COUNT = 480;

/* ── Blob definitions — 6 large chromatic halos ── */
const BLOB_DEFS = [
  /* R large  */ { ci: 0, rFrac: 0.52, aMax: 0.12, sX: 0.013, sY: 0.017, phX: 0.0,          phY: 1.2,  sf: 0.25, depth: 0.3 },
  /* R small  */ { ci: 0, rFrac: 0.35, aMax: 0.09, sX: 0.021, sY: 0.011, phX: Math.PI,       phY: 2.5,  sf: 0.45, depth: 0.6 },
  /* G large  */ { ci: 1, rFrac: 0.46, aMax: 0.10, sX: 0.015, sY: 0.019, phX: 1.8,           phY: 0.5,  sf: 0.30, depth: 0.4 },
  /* G small  */ { ci: 1, rFrac: 0.38, aMax: 0.08, sX: 0.009, sY: 0.024, phX: Math.PI * 0.7, phY: 3.1,  sf: 0.55, depth: 0.2 },
  /* B large  */ { ci: 2, rFrac: 0.55, aMax: 0.13, sX: 0.011, sY: 0.013, phX: 0.8,           phY: 1.6,  sf: 0.35, depth: 0.5 },
  /* B small  */ { ci: 2, rFrac: 0.36, aMax: 0.10, sX: 0.018, sY: 0.008, phX: 2.3,           phY: 0.9,  sf: 0.50, depth: 0.7 },
];

const BLOB_BASES = [
  [0.78, 0.22], [0.12, 0.62],   // R: top-right + mid-left
  [0.42, 0.72], [0.88, 0.38],   // G: bottom-centre + far-right
  [0.18, 0.28], [0.65, 0.82],   // B: top-left + bottom-right
];

/* ── Structural line definitions ── */
const DIAG_DEFS = [
  { r: 255, g: 0,   b: 0,   x1f: 0,    y1f: 0.30, x2f: 0.48, y2f: 0,    spd: 0.018 },
  { r: 0,   g: 255, b: 0,   x1f: 0.52, y1f: 1.0,  x2f: 1.0,  y2f: 0.40, spd: 0.022 },
  { r: 0,   g: 0,   b: 255, x1f: 0,    y1f: 0.68, x2f: 0.72, y2f: 0,    spd: 0.015 },
  { r: 255, g: 0,   b: 0,   x1f: 0.28, y1f: 1.0,  x2f: 1.0,  y2f: 0.22, spd: 0.020 },
];

/* ── Smooth mouse state (viewport-normalised 0..1) ── */
let mouseNX = 0.5, mouseNY = 0.5;
let targetNX = 0.5, targetNY = 0.5;

/* ── Mouse velocity tracking (for corona intensity boost) ── */
let prevMX = 0.5, prevMY = 0.5;
let mouseVelMag = 0;   // smoothed magnitude of normalised mouse movement per frame

/* ── Scroll velocity tracking ── */
let prevScrollY = 0;
let scrollVel   = 0;

/* ═══════════════════════════════════════
   FACTORY — sparkles
═══════════════════════════════════════ */
function buildSparkles(w, pageH) {
  return Array.from({ length: SPARK_COUNT }, (_, i) => ({
    x:     Math.random() * w,
    y:     Math.random() * pageH,
    color: COLORS[i % 3],
    size:  0.8 + Math.random() * 2.8,
    phase: Math.random() * Math.PI * 2,
    speed: 0.35 + Math.random() * 2.2,
    sf:    0.15 + Math.random() * 0.85,
    depth: 0.04 + Math.random() * 0.25,
  }));
}

/* ═══════════════════════════════════════
   DRAW — STRUCTURAL LINES
   Thin architectural grid + RGB diagonals. Scroll-parallaxed.
═══════════════════════════════════════ */
function drawStructuralLines(ctx, w, h, scrollY) {
  ctx.save();

  const isDark   = document.documentElement.getAttribute('data-theme') !== 'light';
  const base     = isDark ? 255 : 0;
  const lineBase = `${base},${base},${base}`;

  /* In light mode, lines need stronger alpha and thicker stroke to show on white */
  const lineAlphaMul = isDark ? 1.0 : 2.5;
  const lineW        = isDark ? 1   : 1.5;

  /* Horizontal lines */
  for (let i = 0; i < 7; i++) {
    const shift = (scrollY * (0.012 + i * 0.004)) % h;
    const y     = (((i + 0.5) / 7) * h - shift % h + h) % h;
    const alpha = (i % 2 === 0 ? 0.07 : 0.045) * lineAlphaMul;
    ctx.strokeStyle = `rgba(${lineBase},${alpha})`;
    ctx.lineWidth   = lineW;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  /* Vertical lines */
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = `rgba(${lineBase},${0.06 * lineAlphaMul})`;
    ctx.lineWidth   = lineW;
    const x = ((i + 1) / 6) * w;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }

  /* RGB diagonal accents */
  DIAG_DEFS.forEach(({ r, g, b, x1f, y1f, x2f, y2f, spd }) => {
    const shift = (scrollY * spd) % (h * 1.8);
    ctx.strokeStyle = `rgba(${r},${g},${b},${(0.12 * lineAlphaMul).toFixed(3)})`;
    ctx.lineWidth   = lineW;
    ctx.beginPath();
    ctx.moveTo(x1f * w, y1f * h - shift);
    ctx.lineTo(x2f * w, y2f * h - shift);
    ctx.stroke();
  });

  ctx.restore();
}

/* ═══════════════════════════════════════
   DRAW — CHROMATIC BLOBS
   Large ambient halos — high-alpha, dramatic mouse + scroll parallax.
   Light mode: alpha multiplied 3× so blobs are visible on white bg.
═══════════════════════════════════════ */
function drawBlobs(ctx, w, h, t, scrollY) {
  const isLight  = document.documentElement.getAttribute('data-theme') === 'light';
  const alphaMul = isLight ? 3.0 : 1.0;

  ctx.save();
  BLOB_DEFS.forEach((blob, idx) => {
    const [bx, by] = BLOB_BASES[idx];
    const [r, g, b] = COLORS[blob.ci];

    const driftX = Math.sin(t * blob.sX + blob.phX) * 0.18;
    const driftY = Math.cos(t * blob.sY + blob.phY) * 0.14;

    /* Subtle mouse parallax — reduced from 280/190 to 90/60 */
    const mX = (mouseNX - 0.5) * -90 * blob.depth;
    const mY = (mouseNY - 0.5) * -60 * blob.depth;

    const sY = (scrollY * blob.sf * 0.07) % (h * 2);

    const cx = (bx + driftX) * w + mX;
    const cy = (by + driftY) * h - sY + mY;

    if (cy < -h * 0.7 || cy > h * 1.7) return;

    const radius = Math.min(w, h) * blob.rFrac;
    const alpha  = Math.min(blob.aMax * alphaMul * (0.65 + Math.sin(t * 0.11 + idx * 1.4) * 0.35), 0.85);

    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grd.addColorStop(0,    `rgba(${r},${g},${b},${alpha.toFixed(4)})`);
    grd.addColorStop(0.45, `rgba(${r},${g},${b},${(alpha * 0.50).toFixed(4)})`);
    grd.addColorStop(1,    `rgba(${r},${g},${b},0)`);

    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fill();
  });
  ctx.restore();
}

/* ═══════════════════════════════════════
   DRAW — MOUSE CHROMATIC CORONA
   ─────────────────────────────────────
   This is the reference-page effect: 3 large semi-transparent
   radial gradients (R, G, B) all centred near the mouse.
   R and B are offset in opposite directions along the
   mouse→centre axis, creating a visible chromatic aberration.
   The split grows as the mouse moves away from the viewport centre,
   and intensifies when the mouse is moved quickly.
═══════════════════════════════════════ */
function drawMouseCorona(ctx, w, h) {
  const mx = mouseNX * w;
  const my = mouseNY * h;

  /* How far mouse is from centre, in px (for channel offset) */
  const centreOffX = (mouseNX - 0.5) * w;
  const centreOffY = (mouseNY - 0.5) * h;

  /* Channel separation — grows with mouse distance from centre */
  const sep = 0.18;  // fraction of centreOff applied as channel split
  const rX = mx - centreOffX * sep * 1.5;
  const rY = my - centreOffY * sep * 1.5;
  const bX = mx + centreOffX * sep * 1.5;
  const bY = my + centreOffY * sep * 1.5;

  /* Alpha — very subtle base + small mouse velocity boost; slightly stronger in light mode */
  const isLight       = document.documentElement.getAttribute('data-theme') === 'light';
  const velocityBoost = Math.min(mouseVelMag * 30, 0.04);
  const baseAlpha     = (0.05 + velocityBoost) * (isLight ? 1.8 : 1.0);

  const coronaR = Math.min(w, h) * 0.65;  // large radius

  ctx.save();

  /* ── R channel — offsets toward centreOff direction (upper-left when mouse top-left) ── */
  const rGrd = ctx.createRadialGradient(rX, rY, 0, rX, rY, coronaR);
  rGrd.addColorStop(0,    `rgba(255,0,0,${baseAlpha.toFixed(3)})`);
  rGrd.addColorStop(0.55, `rgba(255,0,0,${(baseAlpha * 0.30).toFixed(3)})`);
  rGrd.addColorStop(1,    'rgba(255,0,0,0)');
  ctx.fillStyle = rGrd;
  ctx.beginPath(); ctx.arc(rX, rY, coronaR, 0, Math.PI * 2); ctx.fill();

  /* ── G channel — exactly on mouse (slightly larger radius) ── */
  const gGrd = ctx.createRadialGradient(mx, my, 0, mx, my, coronaR * 1.15);
  gGrd.addColorStop(0,    `rgba(0,255,0,${(baseAlpha * 0.80).toFixed(3)})`);
  gGrd.addColorStop(0.55, `rgba(0,255,0,${(baseAlpha * 0.22).toFixed(3)})`);
  gGrd.addColorStop(1,    'rgba(0,255,0,0)');
  ctx.fillStyle = gGrd;
  ctx.beginPath(); ctx.arc(mx, my, coronaR * 1.15, 0, Math.PI * 2); ctx.fill();

  /* ── G2 channel — offsets away from centreOff (was B; blue stays in background blobs) ── */
  const bGrd = ctx.createRadialGradient(bX, bY, 0, bX, bY, coronaR * 0.9);
  bGrd.addColorStop(0,    `rgba(0,255,0,${(baseAlpha * 0.70).toFixed(3)})`);
  bGrd.addColorStop(0.55, `rgba(0,255,0,${(baseAlpha * 0.20).toFixed(3)})`);
  bGrd.addColorStop(1,    'rgba(0,255,0,0)');
  ctx.fillStyle = bGrd;
  ctx.beginPath(); ctx.arc(bX, bY, coronaR * 0.9, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

/* ═══════════════════════════════════════
   DRAW — SPARKLES
═══════════════════════════════════════ */
function drawSparkles(ctx, h, sparks, t, scrollY) {
  const velBoost    = Math.min(Math.abs(scrollVel) * 0.006, 1.8);
  const isLight     = document.documentElement.getAttribute('data-theme') === 'light';
  const sparkAlphaM = isLight ? 2.8 : 1.0;   // sparkles barely visible on white without boost

  sparks.forEach((sp) => {
    const px = sp.x + (mouseNX - 0.5) * -12 * sp.depth;
    const py = sp.y - scrollY + (mouseNY - 0.5) * -8 * sp.depth;
    if (py < -50 || py > h + 50) return;

    const pulse = Math.sin(t * sp.speed + sp.phase) * 0.5 + 0.5;
    const flare = velBoost * sp.sf;
    const alpha = Math.min((pulse * 0.80 + flare * 0.65) * sparkAlphaM, 1.0);
    if (alpha < 0.01) return;

    const [r, g, b] = sp.color;
    const sz = sp.size * (1 + flare * 0.9);

    /* Soft halo */
    const hR  = sz * 7;
    const grd = ctx.createRadialGradient(px, py, 0, px, py, hR);
    grd.addColorStop(0, `rgba(${r},${g},${b},${(alpha * 0.35).toFixed(3)})`);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(px, py, hR, 0, Math.PI * 2); ctx.fill();

    /* Bright core */
    ctx.shadowColor = `rgba(${r},${g},${b},0.95)`;
    ctx.shadowBlur  = 5 + flare * 8;
    ctx.fillStyle   = `rgba(${r},${g},${b},${Math.min(alpha * 3.2, 1).toFixed(3)})`;
    ctx.beginPath(); ctx.arc(px, py, sz * 0.55, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur  = 0;
  });
}

/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */
export function initAmbientRGB() {
  const canvas = document.createElement('canvas');
  canvas.id = 'ambient-rgb';
  Object.assign(canvas.style, {
    position:      'fixed',
    top:           '0',
    left:          '0',
    width:         '100%',
    height:        '100%',
    zIndex:        '1',
    pointerEvents: 'none',
  });
  document.body.insertAdjacentElement('afterbegin', canvas);

  const ctx = canvas.getContext('2d');
  let w, h, sparks;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const pageH = Math.max(document.documentElement.scrollHeight, h * 12);
    sparks = buildSparkles(w, pageH);
  }

  resize();
  window.addEventListener('resize', () => {
    clearTimeout(resize._t);
    resize._t = setTimeout(resize, 240);
  });

  window.addEventListener('mousemove', (e) => {
    targetNX = e.clientX / window.innerWidth;
    targetNY = e.clientY / window.innerHeight;
  });

  let tabVisible = !document.hidden;
  document.addEventListener('visibilitychange', () => { tabVisible = !document.hidden; });

  function render(now) {
    requestAnimationFrame(render);
    if (!tabVisible) return;

    const t       = now * 0.001;
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    /* Scroll velocity */
    const rawDelta = scrollY - prevScrollY;
    prevScrollY    = scrollY;
    scrollVel      = scrollVel * 0.72 + rawDelta * 0.28;

    /* Mouse lerp — snappy (0.07) for responsive feel */
    mouseNX += (targetNX - mouseNX) * 0.07;
    mouseNY += (targetNY - mouseNY) * 0.07;

    /* Mouse velocity (normalised) — for corona brightness boost */
    const dMX = mouseNX - prevMX;
    const dMY = mouseNY - prevMY;
    prevMX = mouseNX;
    prevMY = mouseNY;
    const rawVelMag = Math.sqrt(dMX * dMX + dMY * dMY);
    mouseVelMag = mouseVelMag * 0.80 + rawVelMag * 0.20;

    ctx.clearRect(0, 0, w, h);

    /* Drive logo chromatic aberration via CSS custom properties */
    const abMag = Math.min(Math.abs(scrollVel) * 0.8, 20);
    const abDir = scrollVel > 0 ? 1 : -1;
    const root  = document.documentElement;
    root.style.setProperty('--logo-ab-r', `${(-8 - abMag * abDir).toFixed(1)}px`);
    root.style.setProperty('--logo-ab-b', `${( 8 + abMag * abDir).toFixed(1)}px`);
    root.style.setProperty('--logo-ab-g', `${( 4 + abMag * 0.5).toFixed(1)}px`);

    /* 1 — Structural lines */
    drawStructuralLines(ctx, w, h, scrollY);

    /* 2 — Chromatic halos */
    drawBlobs(ctx, w, h, t, scrollY);

    /* 3 — Mouse chromatic corona (the reference-page effect) */
    drawMouseCorona(ctx, w, h);

    /* 4 — Scroll-reactive sparkles */
    drawSparkles(ctx, h, sparks, t, scrollY);
  }

  requestAnimationFrame(render);
}
