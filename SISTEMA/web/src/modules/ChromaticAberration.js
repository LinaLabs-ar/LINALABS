/* ═══════════════════════════════════════
   CHROMATIC ABERRATION — Scroll-Driven v4
   ─────────────────────────────────────
   · Channels perfectly aligned at rest (scroll = 0)
   · Scroll position drives a slow sine-wave separation cycle
   · One full "aligned → peak → aligned" cycle per ~11 000 px of scroll
   · Direction of separation slowly rotates as you scroll
   · Each element has a unique golden-ratio phase offset for variety
   · Green channel always carries +10 px downward bias so it stays visible
   · No mouse interaction — purely scroll-driven
═══════════════════════════════════════ */

const MAX_OFFSET = 34;      // px at peak separation
const MAX_BLUR   = 12;
const SPREAD_ANG = 0.22;    // prism fan between R and B (~12.6°)
const GREEN_DOWN = 10;      // green always 10 px below the main direction

/*  Scroll frequency: smaller = slower cycle (more px between peaks)
    0.00055 rad/px ≈ 11 400 px per full cycle                         */
const SCROLL_FREQ = 0.00055;

/* ── Apply 2D prism text-shadow ── */
function setAberration2D(el, ox, oy, blur) {
  const mag = Math.hypot(ox, oy);
  if (mag < 0.25) { el.style.textShadow = 'none'; return; }

  const ang = Math.atan2(oy, ox);

  // Red fans +SPREAD_ANG above the direction
  const rX = (Math.cos(ang + SPREAD_ANG) * mag).toFixed(1);
  const rY = (Math.sin(ang + SPREAD_ANG) * mag).toFixed(1);

  // Blue fans −SPREAD_ANG below
  const bX = (Math.cos(ang - SPREAD_ANG) * mag).toFixed(1);
  const bY = (Math.sin(ang - SPREAD_ANG) * mag).toFixed(1);

  // Green: near centre + constant downward bias
  const gX = (ox * 0.22).toFixed(1);
  const gY = (oy * 0.22 + GREEN_DOWN).toFixed(1);
  const gb = Math.max(blur * 0.65, 2.5).toFixed(1);

  el.style.textShadow = [
    `${rX}px ${rY}px ${blur.toFixed(1)}px rgba(255,0,0,1)`,
    `${gX}px ${gY}px ${gb}px rgba(0,255,0,1)`,
    `${bX}px ${bY}px ${blur.toFixed(1)}px rgba(0,0,255,1)`,
  ].join(', ');
}

/* ── Init ── */
export function initChromaticAberration(lenis) {
  const aberrEls = [...document.querySelectorAll('.aberr-text')];
  if (aberrEls.length === 0) return;

  /* Per-element constants —
     phaseOffset = 0 so ALL channels are PERFECTLY ALIGNED at scroll = 0.
     Each element has a different scroll frequency so they desync as you scroll,
     creating independent pulses across the page.                             */
  const elData = aberrEls.map((el, i) => ({
    el,
    phaseOffset: 0,
    dirBase:     (i / Math.max(aberrEls.length, 1)) * Math.PI * 2,
    ampScale:    0.65 + (i % 5) * 0.085,
    freqMult:    0.80 + (i % 4) * 0.14,   // variety in pulse rate per element
  }));

  /* Live scroll position — updated by Lenis each frame */
  let scrollY = 0;
  lenis.on('scroll', ({ scroll }) => { scrollY = scroll ?? 0; });

  /* ── RAF: apply scroll-driven aberration ── */
  function tick() {
    const s = scrollY;

    elData.forEach(({ el, phaseOffset, dirBase, ampScale, freqMult }) => {
      /* Slow sine wave keyed to scroll position
         sin = 0 at rest → channels perfectly aligned
         |sin| peaks → max separation                */
      /* freqMult gives each element its own pulse period so they desync */
      const wave      = Math.sin(s * SCROLL_FREQ * freqMult + phaseOffset);
      const intensity = Math.abs(wave);   // 0 = aligned, 1 = max

      if (intensity < 0.018) {
        el.style.textShadow = 'none';
        return;
      }

      /* Direction of separation rotates slowly with scroll */
      const ang  = dirBase + s * 0.000065;
      const amp  = MAX_OFFSET * ampScale * intensity;
      const ox   = Math.cos(ang) * amp;
      const oy   = Math.sin(ang) * amp * 0.42;   // flatter ellipse vertically
      const blur = 3 + amp * 0.32;

      setAberration2D(el, ox, oy, blur);
    });

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
