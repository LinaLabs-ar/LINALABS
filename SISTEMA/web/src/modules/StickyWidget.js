/* ═══════════════════════════════════════
   STICKY WIDGET — Right side equilateral triangle
   Canvas-based spectral prism / fire-ink effect
   Reveals after hero wordmark animation
═══════════════════════════════════════ */
import gsap from 'gsap';

const CANVAS_SIZE = 280;   // canvas extends this many px from center in all directions

/* ─────────────────────────────────────
   PRISM RAY — spectral light beam particle
   Like light through a glass prism:
   thin, spectral, unstable, occasionally escapes
───────────────────────────────────── */
class PrismRay {
  constructor(cx, cy) {
    this.cx = cx;
    this.cy = cy;
    this.reset();
  }

  reset() {
    this.angle  = Math.random() * Math.PI * 2;
    this.jitter = (Math.random() - 0.5) * 0.15;   // angular drift per frame

    // Spectral colors — like a real prism dispersion (R→orange→violet→B→cyan→G)
    const SPEC = [
      [255, 0,   0  ],  // pure red
      [255, 50,  0  ],  // red-orange edge
      [200, 0,   255],  // violet
      [0,   0,   255],  // pure blue
      [0,   180, 255],  // cyan-blue
      [0,   255, 60 ],  // green
      [80,  255, 0  ],  // yellow-green edge
    ];
    this.color = SPEC[Math.floor(Math.random() * SPEC.length)];

    // 7% chance ray "escapes" — bleeds far out and returns
    this.escaped = Math.random() < 0.07;
    this.maxLen  = this.escaped
      ? 110 + Math.random() * 170
      : 12  + Math.random() * 55;

    this.len     = 0;
    this.growing = true;
    this.life    = 0;
    this.maxLife = this.escaped
      ? 80  + Math.random() * 110
      : 25  + Math.random() * 65;
    this.width   = this.escaped
      ? 0.3 + Math.random() * 0.7
      : 0.6 + Math.random() * 1.4;
    this.opacity = this.escaped
      ? 0.07 + Math.random() * 0.09
      : 0.12 + Math.random() * 0.16;
  }

  update() {
    this.life++;
    this.angle += this.jitter;

    const growRate = this.maxLen / 16;
    if (this.growing) {
      this.len += growRate;
      if (this.len >= this.maxLen) this.growing = false;
    } else {
      this.len -= growRate * 0.75;
    }
    return this.life < this.maxLife && this.len > 0.5;
  }

  draw(ctx) {
    const progress = this.life / this.maxLife;
    const alpha    = Math.sin(progress * Math.PI) * this.opacity;
    if (alpha < 0.004) return;

    const x2 = this.cx + Math.cos(this.angle) * this.len;
    const y2 = this.cy + Math.sin(this.angle) * this.len;

    const grd = ctx.createLinearGradient(this.cx, this.cy, x2, y2);
    const [r, g, b] = this.color;
    grd.addColorStop(0,   `rgba(${r},${g},${b},0)`);
    grd.addColorStop(0.15,`rgba(${r},${g},${b},${alpha})`);
    grd.addColorStop(0.75,`rgba(${r},${g},${b},${(alpha * 0.5).toFixed(3)})`);
    grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);

    ctx.beginPath();
    ctx.moveTo(this.cx, this.cy);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = grd;
    ctx.lineWidth = this.width;
    ctx.stroke();
  }
}

/* ─────────────────────────────────────
   INIT
───────────────────────────────────── */
export function initStickyWidget() {
  const widget = document.getElementById('sticky-widget');
  if (!widget) return;

  /* ── Build canvas prism layer (behind buttons) ── */
  const canvas = document.createElement('canvas');
  canvas.width  = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  Object.assign(canvas.style, {
    position:      'absolute',
    top:           '50%',
    left:          '50%',
    transform:     'translate(-50%, -50%)',
    width:         `${CANVAS_SIZE}px`,
    height:        `${CANVAS_SIZE}px`,
    pointerEvents: 'none',
    zIndex:        '-1',
  });
  widget.appendChild(canvas);

  const ctx  = canvas.getContext('2d');
  const cx   = CANVAS_SIZE / 2;
  const cy   = CANVAS_SIZE / 2;
  const rays = [];
  let active = false;

  /* ── RAF animation loop ── */
  let frameCount = 0;
  const SPAWN_EVERY = 7;   // new ray every 7 frames ≈ 8–9 per second

  function tick() {
    requestAnimationFrame(tick);
    if (!active) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    frameCount++;

    if (frameCount % SPAWN_EVERY === 0) {
      rays.push(new PrismRay(cx, cy));
    }

    for (let i = rays.length - 1; i >= 0; i--) {
      if (!rays[i].update()) rays.splice(i, 1);
      else rays[i].draw(ctx);
    }
  }
  tick();

  /* ── Widget initial state (hidden, buttons pre-scaled to 0) ── */
  const logoBtn = widget.querySelector('.sw-logo');
  const wspBtn  = widget.querySelector('.sw-wsp');
  const igBtn   = widget.querySelector('.sw-ig');

  gsap.set([logoBtn, wspBtn, igBtn], { scale: 0, opacity: 0 });

  let revealed = false;

  /* ── Reveal sequence ── */
  function revealWidget() {
    if (revealed) return;
    revealed = true;
    active   = true;

    // Logo drops in from above
    gsap.fromTo(logoBtn,
      { y: -20, scale: 0, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)', delay: 0.05 }
    );

    // WA pops up
    gsap.fromTo(wspBtn,
      { y: 16, scale: 0, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(2)', delay: 0.28 }
    );

    // IG pops up
    gsap.fromTo(igBtn,
      { y: 16, scale: 0, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(2)', delay: 0.44 }
    );

    // Widget container fades in
    gsap.to(widget, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    gsap.set(widget, { pointerEvents: 'auto' });
  }

  /* Primary trigger: hero wordmark event */
  document.addEventListener('hero:wordmark-revealed', revealWidget, { once: true });

  /* Fallback A: user refreshed mid-scroll (past hero) — reveal after a short delay */
  const heroEl = document.getElementById('hero');
  if (heroEl) {
    const heroBottom = heroEl.getBoundingClientRect().bottom;
    if (heroBottom < window.innerHeight * 0.5) {
      /* Already past hero on load */
      setTimeout(revealWidget, 600);
    }
  }

  /* Fallback B: safety net — if nothing else revealed it after 10s, show it */
  setTimeout(revealWidget, 10000);
}
