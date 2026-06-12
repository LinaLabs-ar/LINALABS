/* ═══════════════════════════════════════
   PARALLAX — Full-page floating depth
   ─────────────────────────────────────
   Every major content element moves at a different scroll rate,
   creating the illusion that elements float above a deeper background.
   Uses GSAP ScrollTrigger scrub with per-element depth variance.
═══════════════════════════════════════ */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/*
  depth = how much the element "floats" above the page background.
  Positive = element moves UP relative to scroll (appears closer).
  Negative = element lags behind scroll (appears farther).
  Values are total px travel over the full trigger window.
*/
const LAYERS = [
  /* Section labels — subtle float */
  { selector: '.section-label',                depth: 28 },

  /* Headlines — most prominent, float highest */
  { selector: '.manifesto-headline',           depth: 70 },
  { selector: '.manifesto-sub',                depth: 36 },
  { selector: '.services-headline',            depth: 55 },
  { selector: '.contact-headline',             depth: 65 },
  /* Body copy */
  { selector: '.about-text',                   depth: 38 },

  /* Cards */
  { selector: '.service-card',                 depth: 40 },

  /* Dense capabilities block — floats as a slab */
  { selector: '.capabilities-dense',          depth: 48 },

  /* Media */
  { selector: '.reel-wrapper',                depth: 42 },
  { selector: '.ig-grid',                     depth: 35 },

  /* Contact */
  { selector: '.contact-header',              depth: 55 },
  { selector: '.contact-body',                depth: 42 },
  { selector: '.contact-logo-wrap',           depth: 32 },
];

export function initParallax() {
  /* Stagger depth slightly for multiple elements of the same selector */
  LAYERS.forEach(({ selector, depth }) => {
    const els = [...document.querySelectorAll(selector)];
    els.forEach((el, i) => {
      /* Each card/item gets a slightly unique depth to break uniform motion */
      const d = depth + (i % 4) * 8;

      gsap.set(el, { willChange: 'transform' });

      gsap.fromTo(
        el,
        { y: d * 0.5 },
        {
          y: -d * 0.5,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start:   'top bottom',
            end:     'bottom top',
            scrub:   0.6,
          },
        }
      );
    });
  });
}
