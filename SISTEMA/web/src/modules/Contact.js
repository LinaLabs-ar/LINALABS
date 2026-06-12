/* ═══════════════════════════════════════
   CONTACT — Bidirectional entrance animation
   Layout: full-width header → 2-col body (form|social) → logo centred below
   (Aberration handled globally by ChromaticAberration.js)
   Scrolling back up reverses the animation.
═══════════════════════════════════════ */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initContact() {
  const section = document.getElementById('contact');
  if (!section) return;

  /* Set initial state — all three zones hidden */
  gsap.set('.contact-header',   { opacity: 0 });
  gsap.set('.contact-body',     { opacity: 0 });
  gsap.set('.contact-logo-wrap',{ opacity: 0 });

  ScrollTrigger.create({
    trigger: '#contact',
    start:   'top 75%',
    onEnter: () => {
      gsap.to('.contact-header', {
        opacity:  1,
        duration: 1,
        ease:     'power3.out',
      });
      gsap.to('.contact-body', {
        opacity:  1,
        delay:    0.2,
        duration: 1,
        ease:     'power3.out',
      });
      gsap.to('.contact-logo-wrap', {
        opacity:  1,
        delay:    0.45,
        duration: 1,
        ease:     'power3.out',
      });
    },
    onLeaveBack: () => {
      gsap.to('.contact-header',    { opacity: 0, duration: 0.4, ease: 'power2.in' });
      gsap.to('.contact-body',      { opacity: 0, duration: 0.4, ease: 'power2.in' });
      gsap.to('.contact-logo-wrap', { opacity: 0, duration: 0.3, ease: 'power2.in' });
    },
  });

  /* ── Contact form — mailto handler ── */
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data    = new FormData(form);
    const subject = encodeURIComponent(data.get('subject') || 'Consulta desde linalabs.ar');
    const body    = encodeURIComponent(
      `De: ${data.get('email')}\nTeléfono: ${data.get('phone') || '—'}\n\n${data.get('message')}`
    );
    window.open(`mailto:hello@linalabs.ar?subject=${subject}&body=${body}`, '_blank');

    const btn      = form.querySelector('.cf-submit');
    const original = btn.textContent;
    btn.textContent = '✓ Mensaje preparado';
    btn.disabled    = true;

    setTimeout(() => {
      btn.textContent = original;
      btn.disabled    = false;
      form.reset();
    }, 3500);
  });
}
