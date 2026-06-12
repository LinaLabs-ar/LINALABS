/* ═══════════════════════════════════════
   SERVICES — Bidirectional opacity reveal
   Note: y-transform is owned by Parallax.js (no conflict).
   Scrolling back up reverses the animation.
═══════════════════════════════════════ */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initServices() {
  const cards = document.querySelectorAll('.service-card');
  if (!cards.length) return;

  /* Set initial states — ensures reverse works correctly */
  gsap.set('.services-headline', { opacity: 0 });

  /* ── Service cards — staggered fade in/out ── */
  ScrollTrigger.create({
    trigger: '.services-grid',
    start:   'top 80%',
    onEnter: () => {
      gsap.to(cards, {
        opacity:  1,
        duration: 0.7,
        stagger:  0.08,
        ease:     'power3.out',
      });
    },
    onLeaveBack: () => {
      gsap.to(cards, {
        opacity:  0,
        duration: 0.4,
        stagger:  { from: 'end', each: 0.05 },
        ease:     'power2.in',
      });
    },
  });

  /* ── Services headline ── */
  ScrollTrigger.create({
    trigger: '.services-header',
    start:   'top 85%',
    onEnter: () => {
      gsap.to('.services-headline', {
        opacity:  1,
        duration: 0.8,
        ease:     'power3.out',
      });
    },
    onLeaveBack: () => {
      gsap.to('.services-headline', {
        opacity:  0,
        duration: 0.4,
        ease:     'power2.in',
      });
    },
  });
}
