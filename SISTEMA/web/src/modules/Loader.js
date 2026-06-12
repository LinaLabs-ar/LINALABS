/* ═══════════════════════════════════════
   LOADER — Logo wipe from bottom to top + chromatic aberration
   CSS-driven animation. No canvas, no orbital rings.
═══════════════════════════════════════ */

export function initLoader() {
  return new Promise((resolve) => {
    const loader = document.getElementById('loader');
    if (!loader) { resolve(); return; }

    document.body.classList.add('is-loading');

    /* Wipe: 1.2s. Pause: 0.7s. Fade-out: 0.5s. Total: 2.4s */
    const WIPE_MS    = 1200;
    const PAUSE_MS   = 700;
    const FADEOUT_MS = 500;
    const TOTAL_MS   = WIPE_MS + PAUSE_MS;

    /* Start wipe animation (CSS class triggers @keyframes) */
    requestAnimationFrame(() => {
      loader.classList.add('wipe-start');
    });

    setTimeout(() => {
      loader.style.transition = `opacity ${FADEOUT_MS}ms ease`;
      loader.style.opacity    = '0';

      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('is-loading');
        resolve();
      }, FADEOUT_MS + 40);
    }, TOTAL_MS);
  });
}
