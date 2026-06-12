/* ═══════════════════════════════════════
   MANIFESTO — Bidirectional clip-path wipe reveal
   Scroll down → text wipes in from bottom
   Scroll back up → text wipes back out to bottom
   Aberration handled globally by ChromaticAberration.js.
═══════════════════════════════════════ */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initManifesto() {
  const headline = document.querySelector('.manifesto-headline');
  const sub      = document.querySelector('.manifesto-sub');
  const body     = document.querySelector('.manifesto-body');
  if (!headline) return;

  /* Set initial state — large bottom inset in px so all values stay in same unit */
  gsap.set(headline, { clipPath: 'inset(0px 0px 9999px 0px)' });
  if (sub)  gsap.set(sub,  { opacity: 0, y: 16 });
  if (body) gsap.set(body, { opacity: 0, y: 16 });

  ScrollTrigger.create({
    trigger: headline,
    start:   'top 105%',   /* trigger before fully in viewport so it feels instant */
    onEnter: () => {
      gsap.to(headline, {
        /* Expand well beyond element bounds so text-shadows are never clipped.
           -80px top/bottom and -300px sides give 300px of room for R/B channel
           text-shadows (MAX_OFFSET=34px + blur=12px + generous margin). */
        clipPath: 'inset(-80px -300px -80px -300px)',
        duration: 1.1,
        ease:     'power4.out',
      });
      if (sub) {
        gsap.to(sub, {
          opacity:  1,
          y:        0,
          duration: 0.9,
          delay:    0.4,
          ease:     'power3.out',
        });
      }
      if (body) {
        gsap.to(body, {
          opacity:  1,
          y:        0,
          duration: 0.9,
          delay:    0.65,
          ease:     'power3.out',
        });
      }
    },
    onLeaveBack: () => {
      gsap.to(headline, {
        clipPath: 'inset(0px 0px 9999px 0px)',
        duration: 0.6,
        ease:     'power3.in',
      });
      if (sub) {
        gsap.to(sub, {
          opacity:  0,
          y:        16,
          duration: 0.4,
          ease:     'power2.in',
        });
      }
      if (body) {
        gsap.to(body, {
          opacity:  0,
          y:        16,
          duration: 0.4,
          ease:     'power2.in',
        });
      }
    },
  });
}
