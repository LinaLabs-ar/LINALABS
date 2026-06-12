/* ═══════════════════════════════════════
   CAPABILITIES — RGB rotating gradient + alternating dots
   ─────────────────────────────────────
   · Processes the capabilities-dense text to wrap each · separator
     in a <span class="rgb-sep rgb-r/g/b"> for alternating RGB color.
   · Creates a canvas overlay (z-index 1 inside the block) with a
     slowly-rotating R/G/B tri-channel gradient.
   · Text wrapper sits at z-index 2 — always readable above the gradient.
═══════════════════════════════════════ */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function initCapabilitiesGradient() {
  const block = document.querySelector('.capabilities-dense');
  if (!block) return;

  /* ── Process text: wrap dots with RGB classes ── */
  const raw   = block.textContent.trim();
  const parts = raw.split(' · ');
  const keys  = ['rgb-r', 'rgb-g', 'rgb-b'];

  const processed = parts.map((part, i) => {
    const trimmed = part.trim();
    if (i === parts.length - 1) return `<span class="cap-word">${trimmed}</span>`;
    return `<span class="cap-word">${trimmed}</span><span class="rgb-sep ${keys[i % 3]}" aria-hidden="true"> · </span>`;
  }).join('');

  /* Text wrapper — sits above canvas */
  const textEl = document.createElement('div');
  textEl.className = 'cap-inner';
  textEl.innerHTML = processed;

  /* Canvas — rotating RGB gradient behind text */
  const canvas = document.createElement('canvas');
  canvas.className = 'cap-canvas';
  Object.assign(canvas.style, {
    position:      'absolute',
    inset:         '0',
    width:         '100%',
    height:        '100%',
    pointerEvents: 'none',
  });

  /* Build DOM: clear block, add canvas then text */
  block.textContent = '';
  block.style.position = 'relative';
  block.style.overflow = 'hidden';
  block.appendChild(canvas);
  block.appendChild(textEl);

  const ctx = canvas.getContext('2d');
  let cw = 0, ch = 0;

  const ro = new ResizeObserver(([entry]) => {
    cw = Math.floor(entry.contentRect.width);
    ch = Math.floor(entry.contentRect.height);
    canvas.width  = cw;
    canvas.height = ch;
  });
  ro.observe(block);

  let visible = false;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
  io.observe(block);

  /* Three channels, different cycle lengths */
  const R = { freq: 0.09,  phase: 0.0 };
  const G = { freq: 0.07,  phase: Math.PI * 0.8 };
  const B = { freq: 0.11,  phase: Math.PI * 1.5 };

  function render(now) {
    requestAnimationFrame(render);
    if (!visible || cw < 2 || ch < 2) return;

    const t  = now * 0.001;
    const rA = (Math.sin(t * R.freq + R.phase) * 0.5 + 0.5) * 0.18;
    const gA = (Math.sin(t * G.freq + G.phase) * 0.5 + 0.5) * 0.14;
    const bA = (Math.sin(t * B.freq + B.phase) * 0.5 + 0.5) * 0.18;

    const angle = t * 0.04;
    const cx    = cw / 2;
    const cy    = ch / 2;

    ctx.clearRect(0, 0, cw, ch);

    /* Red */
    const dx  = Math.cos(angle) * cw * 0.7;
    const dy  = Math.sin(angle) * ch * 0.7;
    const rG  = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
    rG.addColorStop(0,   'rgba(255,0,0,0)');
    rG.addColorStop(0.5, `rgba(255,0,0,${rA.toFixed(4)})`);
    rG.addColorStop(1,   'rgba(255,0,0,0)');
    ctx.fillStyle = rG;
    ctx.fillRect(0, 0, cw, ch);

    /* Green */
    const ga  = angle + Math.PI * 2 / 3;
    const gdx = Math.cos(ga) * cw * 0.7;
    const gdy = Math.sin(ga) * ch * 0.7;
    const gG  = ctx.createLinearGradient(cx - gdx, cy - gdy, cx + gdx, cy + gdy);
    gG.addColorStop(0,   'rgba(0,255,0,0)');
    gG.addColorStop(0.5, `rgba(0,255,0,${gA.toFixed(4)})`);
    gG.addColorStop(1,   'rgba(0,255,0,0)');
    ctx.fillStyle = gG;
    ctx.fillRect(0, 0, cw, ch);

    /* Blue */
    const ba  = angle + Math.PI * 4 / 3;
    const bdx = Math.cos(ba) * cw * 0.7;
    const bdy = Math.sin(ba) * ch * 0.7;
    const bG  = ctx.createLinearGradient(cx - bdx, cy - bdy, cx + bdx, cy + bdy);
    bG.addColorStop(0,   'rgba(0,0,255,0)');
    bG.addColorStop(0.5, `rgba(0,0,255,${bA.toFixed(4)})`);
    bG.addColorStop(1,   'rgba(0,0,255,0)');
    ctx.fillStyle = bG;
    ctx.fillRect(0, 0, cw, ch);
  }

  requestAnimationFrame(render);
}

/* ═══════════════════════════════════════
   TICKER — JS-driven, pixel-exact, no sub-pixel jump
   ─────────────────────────────────────
   We measure the exact pixel width of one set and increment by
   pixels per frame. When offset ≥ setWidth we snap back by setWidth
   exactly — seamless because the second set is an identical clone.
═══════════════════════════════════════ */
function initTicker() {
  const inner   = document.querySelector('.ticker-icons');
  const firstSet = document.querySelector('.ticker-set');
  if (!inner || !firstSet) return;

  const SPEED = 260; // px per second  (≈ 15s per loop on a 3960px set)

  let offset   = 0;
  let setWidth = 0;
  let lastTime = null;
  let hidden   = document.hidden;

  /* Measure (and re-measure on resize) */
  function measure() {
    setWidth = firstSet.getBoundingClientRect().width;
  }
  measure();
  window.addEventListener('resize', measure, { passive: true });

  /* Pause when tab is hidden to avoid drift on resume */
  document.addEventListener('visibilitychange', () => {
    hidden   = document.hidden;
    lastTime = null; // reset timer so dt doesn't explode on resume
  });

  function tick(now) {
    requestAnimationFrame(tick);
    if (hidden || setWidth < 1) return;

    if (lastTime === null) { lastTime = now; }
    const dt  = Math.min((now - lastTime) / 1000, 0.1); // cap dt at 100ms
    lastTime  = now;

    offset += SPEED * dt;
    if (offset >= setWidth) offset -= setWidth; // seamless snap

    inner.style.transform = `translate3d(${-offset.toFixed(2)}px, 0, 0)`;
  }

  requestAnimationFrame(tick);
}

export function initCapabilities() {
  initTicker();
  initCapabilitiesGradient();

  const label = document.querySelector('.section-capabilities .section-label');
  if (label) gsap.set(label, { opacity: 0, y: 20 });

  ScrollTrigger.create({
    trigger: '.section-capabilities .container',
    start:   'top 85%',
    onEnter: () => {
      gsap.to(label, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    },
    onLeaveBack: () => {
      gsap.to(label, { opacity: 0, y: 20, duration: 0.35, ease: 'power2.in' });
    },
  });
}
