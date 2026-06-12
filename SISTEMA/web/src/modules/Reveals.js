/* ═══════════════════════════════════════
   REVEALS — Universal bidirectional scroll reveals
   ─────────────────────────────────────
   Rule: only handle elements that have NO existing animation module.
   All animations are bidirectional (scroll up = reverse).
   Only opacity is animated — Parallax.js owns all y movement.

   Elements already handled by their own modules (SKIP HERE):
   · .about-text          → About.js
   · .service-card        → Services.js
   · .services-headline   → Services.js
   · .manifesto-headline  → Manifesto.js
   · .manifesto-sub       → Manifesto.js
   · .contact-left/right  → Contact.js
   · .capabilities-dense  → Capabilities.js owns the gradient canvas
   · .section-capabilities .section-label → Capabilities.js
═══════════════════════════════════════ */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* ── Helper: single bidirectional reveal ── */
/* minOpacity: opacity floor on leaveBack (0 = fully hidden, >0 = always perceptible) */
function reveal(sectionEl, targets, start = 'top 88%', delay = 0, minOpacity = 0) {
  if (!sectionEl) return;
  const els = typeof targets === 'string'
    ? [...document.querySelectorAll(targets)]
    : (Array.isArray(targets) ? targets : [targets]);
  if (!els.length) return;

  gsap.set(els, { opacity: minOpacity });

  ScrollTrigger.create({
    trigger: sectionEl,
    start,
    onEnter: () => {
      gsap.to(els, { opacity: 1, duration: 0.75, delay, ease: 'power3.out' });
    },
    onLeaveBack: () => {
      gsap.to(els, { opacity: minOpacity, duration: 0.35, ease: 'power2.in' });
    },
  });
}

/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */
export function initReveals() {

  /* ── ABOUT ── */
  // "Estudio" label (the about-text paragraphs are handled by About.js)
  reveal(
    document.querySelector('#about'),
    '.about-label',
    'top 85%'
  );

  /* ── SERVICES ── */
  // The .section-label "Servicios" (cards + headline handled by Services.js)
  reveal(
    document.querySelector('.services-header'),
    '.services-header .section-label',
    'top 88%'
  );

  /* ── PORTFOLIO / NUESTRO TRABAJO ── */
  // Header is now inside .pdf-viewer-wrapper — trigger on the section itself
  reveal(
    document.querySelector('#portfolio'),
    '.portfolio-header .section-label',
    'top 85%'
  );
  /* NOTE: .portfolio-headline was removed from HTML — section label now says "Nuestro trabajo" */

  /* ── MEDIA ── */
  // Section label
  reveal(
    document.querySelector('#media .container'),
    '#media .section-label',
    'top 88%'
  );
  // Reel left column
  reveal(
    document.querySelector('.media-reel-wrap'),
    '.reel-label',
    'top 88%'
  );
  reveal(
    document.querySelector('.media-reel-wrap'),
    '.reel-video-container',
    'top 85%',
    0.15
  );
  // Instagram right column
  reveal(
    document.querySelector('.media-instagram-wrap'),
    '.ig-header',
    'top 88%'
  );
  reveal(
    document.querySelector('.media-instagram-wrap'),
    '.ig-grid-container',
    'top 85%',
    0.20
  );

  /* NOTE: .capabilities-dense is intentionally NOT included here.
     Capabilities.js owns the gradient canvas inside it — if we set
     opacity:0 on the outer div and the reveal trigger misfires, the
     entire gradient + text block disappears. Let it stay always-visible. */
}
