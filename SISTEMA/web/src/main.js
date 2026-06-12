/* ═══════════════════════════════════════════════════════════
   LINA LABS — Main Entry Point
   Three.js · GSAP · Lenis · All Modules
   ═══════════════════════════════════════════════════════════ */
import './style.css';

/* ── Always start from the top — never restore scroll position on refresh ── */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initLoader } from './modules/Loader.js';
import { initHero } from './modules/Hero.js';
import { initManifesto } from './modules/Manifesto.js';
import { initAbout } from './modules/About.js';
import { initServices } from './modules/Services.js';
import { initPDFViewer } from './modules/PDFViewer.js';
import { initMedia } from './modules/MediaSection.js';
import { initCapabilities } from './modules/Capabilities.js';
import { initContact } from './modules/Contact.js';
import { initStickyWidget } from './modules/StickyWidget.js';
import { initThemeToggle } from './modules/ThemeToggle.js';
import { initChromaticAberration } from './modules/ChromaticAberration.js';
import { initAmbientRGB } from './modules/AmbientRGB.js';
import { initParallax } from './modules/Parallax.js';
import { initReveals } from './modules/Reveals.js';
import { initTravelingLogo } from './modules/TravelingLogo.js';
import { initLanguage }      from './modules/Language.js';

gsap.registerPlugin(ScrollTrigger);

/* ── Lenis smooth scroll ── */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
});

// Lenis → GSAP ScrollTrigger integration
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

/* ── Safe module runner — logs errors without breaking the chain ── */
function safe(name, fn) {
  try { fn(); }
  catch (e) { console.error(`[init] ${name} threw:`, e); }
}

/* ── Init all modules ── */
async function init() {
  // Theme toggle (sets up before anything visible)
  safe('ThemeToggle', initThemeToggle);

  // Loader (runs, then resolves — max 6s safety timeout)
  await Promise.race([
    initLoader(),
    new Promise(r => setTimeout(r, 6000)),
  ]);

  // Hero with WebGL + canvas logo animation
  safe('Hero', () => initHero(lenis));

  // All other sections
  safe('Manifesto',           initManifesto);
  safe('About',               initAbout);
  safe('Services',            initServices);
  safe('PDFViewer',           initPDFViewer);
  safe('Media',               () => initMedia(lenis));
  safe('Capabilities',        initCapabilities);
  safe('Contact',             initContact);
  safe('StickyWidget',        initStickyWidget);
  safe('ChromaticAberration', () => initChromaticAberration(lenis));
  safe('AmbientRGB',          initAmbientRGB);
  safe('Parallax',            initParallax);
  safe('Reveals',             initReveals);
  safe('TravelingLogo',       initTravelingLogo);
  safe('Language',            initLanguage);

  // Refresh ScrollTrigger after all sections init
  safe('STRefresh', () => ScrollTrigger.refresh());

  // Idle reset — after 20s of inactivity above the services section, scroll back to top
  safe('IdleReset', initIdleReset);
}

/* ── Idle reset ─────────────────────────────────────────────
   Fires after IDLE_MS of no user interaction IF the user is
   still above the services section. Safe zones (portfolio,
   media/reel, contact) are all below services so they're
   automatically excluded.
─────────────────────────────────────────────────────────── */
function initIdleReset() {
  const IDLE_MS = 20_000; // 20 seconds

  /* Return true if the user hasn't scrolled into the services section yet */
  function isInResetZone() {
    const services = document.getElementById('services');
    if (!services) return true;
    // If services top is still below 70% of the viewport, user hasn't reached it
    return services.getBoundingClientRect().top > window.innerHeight * 0.7;
  }

  let idleTimer = null;

  function triggerReset() {
    if (!isInResetZone()) {
      bump(); // still idle but in a safe zone — restart the timer
      return;
    }
    // Scroll smoothly to top, then dispatch hero:idle-reset
    lenis.scrollTo(0, {
      duration: 1.6,
      easing: t => 1 - Math.pow(1 - t, 3),
      onComplete: () => {
        document.dispatchEvent(new CustomEvent('hero:idle-reset'));
      },
    });
  }

  function bump() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(triggerReset, IDLE_MS);
  }

  // Reset the timer on any user interaction
  ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'touchmove', 'click', 'wheel']
    .forEach(ev => window.addEventListener(ev, bump, { passive: true }));

  bump(); // start immediately after init
}

init();

/* ── Export lenis for modules that need it ── */
export { lenis };
