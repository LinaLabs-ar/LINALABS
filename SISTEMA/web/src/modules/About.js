/* ═══════════════════════════════════════
   ABOUT — Bidirectional text reveal on scroll
   Scrolling back up reverses the animation.
═══════════════════════════════════════ */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initAbout() {
  const texts = document.querySelectorAll('.about-text');
  if (!texts.length) return;

  texts.forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start:   'top 85%',
      onEnter: () => {
        gsap.to(el, {
          opacity:  1,
          duration: 0.9,
          delay:    i * 0.15,
          ease:     'power3.out',
        });
      },
      onLeaveBack: () => {
        gsap.to(el, {
          opacity:  0,
          duration: 0.4,
          ease:     'power2.in',
        });
      },
    });
  });

  // Note: .aberr-text chromatic aberration is handled by ChromaticAberration.js (scroll-driven v4)
}
