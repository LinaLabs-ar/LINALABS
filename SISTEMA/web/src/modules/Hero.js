/* ═══════════════════════════════════════
   HERO — WebGL Logo Animation
   Three.js canvas + RGB Chromatic Aberration Shader
   Placeholder: animated orbital rings on canvas
   Production: swap for PNG sequence scrubbing
═══════════════════════════════════════ */
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger }    from 'gsap/ScrollTrigger';
import { getPiecesForLang } from './Language.js';

/* ── GLSL Shaders ── */
const vertShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragShader = /* glsl */`
  uniform sampler2D tDiffuse;
  uniform float     uOffset;   // chromatic aberration offset (0 – 0.04)
  uniform float     uVignette; // vignette strength (0 – 1)
  uniform float     uBrightness;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Chromatic aberration: R shifted right, B shifted left
    vec4 texR = texture2D(tDiffuse, uv + vec2( uOffset, 0.0));
    vec4 texG = texture2D(tDiffuse, uv);
    vec4 texB = texture2D(tDiffuse, uv - vec2( uOffset, 0.0));

    vec3 color = vec3(texR.r, texG.g, texB.b);

    // Vignette
    vec2 vig = uv * (1.0 - uv);
    float vigFactor = pow(vig.x * vig.y * 15.0, uVignette * 0.5);
    color *= clamp(vigFactor, 0.0, 1.0);

    color *= uBrightness;

    // Use alpha from center channel
    float alpha = texG.a;

    gl_FragColor = vec4(color, alpha);
  }
`;

/* ── PNG Sequence loader (production) ── */
// When the user provides the PNG sequence, populate this path prefix
// and set SEQUENCE_FRAMES to the total frame count.
const SEQUENCE_PATH      = '/assets/logo/logo_'; // logo_00000.jpg … logo_00299.jpg
const SEQUENCE_FRAMES    = 300;   // total frames in the file set (don't change)
const SEQUENCE_END_FRAME = 190;   // last frame to USE — frames after this are static/repetitive
                                  // ↑ tune this if the animation still feels too long or cuts too early
const USE_SEQUENCE       = true;

export function initHero(lenis) {
  const glCanvas   = document.getElementById('hero-gl-canvas');
  const logoCanvas = document.getElementById('logo-canvas');
  const hero       = document.getElementById('hero');
  const wordmark   = document.querySelector('.hero-wordmark');
  const wordLines  = document.querySelectorAll('.wordmark-line');
  const tagline    = document.querySelector('.hero-tagline');
  const piecesInnerLeft  = document.getElementById('pieces-inner-left');
  const piecesInnerRight = document.getElementById('pieces-inner-right');
  const logoOutline      = document.getElementById('hero-logo-outline');
  const scrollHint       = document.querySelector('.hero-scroll-hint');

  /* ─────────────────────────────────────
     LOGO OUTLINE PULSE — pure JS RAF
     No CSS animation — JS owns opacity + transform entirely.
  ───────────────────────────────────── */
  let outlinePulseId  = null;
  let outlinePhase    = 0;
  let outlineAlive    = false;

  function startOutlinePulse() {
    // No outline on mobile — animation is already auto-playing, no need for the ghost hint
    if (window.matchMedia('(max-width: 640px)').matches) return;
    if (firstScroll || outlineAlive || !logoOutline) return;
    outlineAlive = true;

    // Fade-in via CSS transition (one-shot), then switch to RAF
    logoOutline.style.transition = 'opacity 1s ease, transform 1s ease';
    logoOutline.style.opacity    = '0.6';
    logoOutline.style.transform  = 'translate(-50%, -50%) scale(1)';

    setTimeout(() => {
      if (!outlineAlive) return;
      logoOutline.style.transition = ''; // hand off to RAF — no transition lag

      function pulse() {
        if (!outlineAlive) return;
        outlinePhase += 0.014;
        const sc   = (1 + Math.sin(outlinePhase) * 0.055).toFixed(4);
        const op   = (0.45 + Math.sin(outlinePhase) * 0.30).toFixed(3);
        logoOutline.style.transform = `translate(-50%, -50%) scale(${sc})`;
        logoOutline.style.opacity   = op;
        outlinePulseId = requestAnimationFrame(pulse);
      }
      outlinePulseId = requestAnimationFrame(pulse);
    }, 1000);
  }

  // Start outline pulse 1.8s after load
  setTimeout(startOutlinePulse, 1800);

  /* ── Native scroll detection — backup for GSAP init false-positive ── */
  function handleFirstScroll() {
    if (firstScroll) return;
    firstScroll  = true;
    teaseRunning = false;
    outlineAlive = false;
    if (outlinePulseId) { cancelAnimationFrame(outlinePulseId); outlinePulseId = null; }
    if (logoOutline) {
      logoOutline.style.transition = 'opacity 0.45s ease, transform 0.5s ease';
      logoOutline.style.opacity    = '0';
      logoOutline.style.transform  = 'translate(-50%, -50%) scale(0.88)';
    }
    if (scrollHint) scrollHint.classList.remove('hint-waiting');
  }

  window.addEventListener('wheel',     handleFirstScroll, { once: true, passive: true });
  window.addEventListener('touchmove', handleFirstScroll, { once: true, passive: true });

  /* ── Scan lines config ── */
  const SCAN_LINES = [
    { el: document.querySelector('.hero-scan-line'),   pStart: 0.00, pEnd: 1.00, maxOpacity: 0.70 },
    { el: document.querySelector('.hero-scan-line-2'), pStart: 0.04, pEnd: 0.70, maxOpacity: 0.50 },
    { el: document.querySelector('.hero-scan-line-3'), pStart: 0.20, pEnd: 1.00, maxOpacity: 0.42 },
    { el: document.querySelector('.hero-scan-line-4'), pStart: 0.00, pEnd: 0.88, maxOpacity: 0.38 },
  ];

  /* ── Pieces list — use Language.js so language is correct from the start ── */
  /* Always start in Spanish — language module handles runtime switching */
  const PIECES = getPiecesForLang('es');

  [piecesInnerLeft, piecesInnerRight].forEach(container => {
    if (!container) return;
    PIECES.forEach(name => {
      const span = document.createElement('span');
      span.className = 'piece-item';
      span.textContent = name;
      container.appendChild(span);
    });
  });

  if (!glCanvas || !hero) return;

  /* ─────────────────────────────────────
     THREE.JS SETUP
  ───────────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({
    canvas: glCanvas,
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 1);

  const scene  = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // Full-screen plane
  const geometry = new THREE.PlaneGeometry(2, 2);

  // Offscreen canvas — must match viewport so the texture maps 1:1 (no distortion)
  logoCanvas.width  = window.innerWidth;
  logoCanvas.height = window.innerHeight;
  const lCtx = logoCanvas.getContext('2d');

  const logoTexture = new THREE.CanvasTexture(logoCanvas);

  const uniforms = {
    tDiffuse:    { value: logoTexture },
    uOffset:     { value: 0.018 },   // default: high aberration
    uVignette:   { value: 1.0 },
    uBrightness: { value: 1.0 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader:   vertShader,
    fragmentShader: fragShader,
    transparent: true,
  });

  scene.add(new THREE.Mesh(geometry, material));

  /* ─────────────────────────────────────
     RESIZE
  ───────────────────────────────────── */
  function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Keep canvas matching viewport so no distortion
    logoCanvas.width  = window.innerWidth;
    logoCanvas.height = window.innerHeight;
    logoTexture.needsUpdate = true;
  }
  onResize();
  window.addEventListener('resize', onResize);

  /* ─────────────────────────────────────
     PNG SEQUENCE (production path)
  ───────────────────────────────────── */
  let frames = [];
  let framesLoaded = false;

  if (USE_SEQUENCE) {
    let loaded = 0;
    for (let i = 0; i < SEQUENCE_FRAMES; i++) {
      const img = new Image();
      const idx = String(i).padStart(5, '0');  // logo_00000.jpg … logo_00299.jpg
      img.src = `${SEQUENCE_PATH}${idx}.jpg`;
      img.onload = () => {
        frames[i] = img;
        loaded++;
        if (loaded === SEQUENCE_FRAMES) framesLoaded = true;
      };
    }
  }

  /* ─────────────────────────────────────
     PLACEHOLDER ANIMATION
     Cinematic orbital rings (mimics logo animation style)
     Replace with PNG sequence when ready
  ───────────────────────────────────── */
  let t = 0;

  function drawPlaceholder(progress) {
    /* Canvas stays blank — no orbital rings, no L letterform.
       The hero WebGL background (shader on black) is the visual. */
    lCtx.clearRect(0, 0, logoCanvas.width, logoCanvas.height);
  }

  /* ─────────────────────────────────────
     DRAW PNG SEQUENCE FRAME
  ───────────────────────────────────── */
  function drawSequenceFrame(progress) {
    const targetIdx = Math.min(
      Math.floor(progress * SEQUENCE_END_FRAME),
      SEQUENCE_END_FRAME
    );
    // Find the nearest loaded frame (scan backward from target)
    let img = null;
    for (let i = targetIdx; i >= 0; i--) {
      if (frames[i]) { img = frames[i]; break; }
    }
    if (!img) { drawPlaceholder(progress); return; }

    const w = logoCanvas.width;
    const h = logoCanvas.height;
    lCtx.clearRect(0, 0, w, h);

    const isMob = window.matchMedia('(max-width: 640px)').matches;

    /* Always COVER — fills the viewport so the animation looks cinematic.
       Desktop: push 80px down to clear the tagline strip.
       Mobile:  no Y offset — logo stays centered (tagline is small and overlays on top). */
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw    = img.naturalWidth  * scale;
    const dh    = img.naturalHeight * scale;
    const dx    = (w - dw) / 2;
    const dy    = (h - dh) / 2 + (isMob ? 0 : 80);
    lCtx.drawImage(img, dx, dy, dw, dh);
  }

  /* ─────────────────────────────────────
     RENDER LOOP
  ───────────────────────────────────── */
  let scrollProgress = 0;
  let prevOffset     = 0;
  let lastDrawnIdx   = -1;   // avoid redrawing the same frame 60×/sec

  function render() {
    t += 0.016;

    // Draw logo frame — only redraw when the target frame actually changes
    if (USE_SEQUENCE && frames[0]) {
      const targetIdx = Math.min(
        Math.floor(scrollProgress * SEQUENCE_END_FRAME),
        SEQUENCE_END_FRAME
      );
      if (targetIdx !== lastDrawnIdx) {
        drawSequenceFrame(scrollProgress);
        logoTexture.needsUpdate = true;
        lastDrawnIdx = targetIdx;
      }
    } else {
      drawPlaceholder(scrollProgress);
      logoTexture.needsUpdate = true;
    }

    // Aberration: NO idle oscillation — only spikes on fast scroll so the
    // logo looks static when not scrolling (idle oscillation made it look
    // like it was animating on its own)
    uniforms.uOffset.value = 0.006 + prevOffset;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();

  /* ─────────────────────────────────────
     IDLE TEASE  (desktop only)
     While the user hasn't scrolled yet, automatically advance
     the animation a bit then return — signals "scroll to animate".
     Stops permanently on first real scroll.
  ───────────────────────────────────── */
  const isMobile   = window.matchMedia('(max-width: 640px)').matches;
  let firstScroll  = false;
  let teaseRunning = false;

  function runTease() {
    if (isMobile || firstScroll || teaseRunning) return;
    teaseRunning = true;

    const PEAK  = 0.14;     // advance 14% into animation (~26 frames)
    const SPEED = 0.0005;   // progress per ms — relaxed, cinematic pace
    let   tp    = 0;
    let   dir   = 1;        // 1 = forward, -1 = back
    let   last  = performance.now();

    function step(now) {
      if (firstScroll) { teaseRunning = false; scrollProgress = 0; return; }
      const dt = Math.min(now - last, 32); // cap dt to avoid jumps on tab switch
      last = now;
      tp  += dir * SPEED * dt;

      if (tp >= PEAK) {
        tp = PEAK;
        dir = -1;
        // Hold at peak for 400ms before retreating
        setTimeout(() => requestAnimationFrame(step), 400);
        return;
      }
      if (tp <= 0) {
        tp = 0;
        scrollProgress = 0;
        teaseRunning = false;
        setTimeout(runTease, 6500); // pause before next tease
        return;
      }

      scrollProgress = tp;
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // First tease fires 2s after the animation is ready
  setTimeout(runTease, 2000);

  /* ─────────────────────────────────────
     SCROLL TRIGGER
  ───────────────────────────────────── */
  /* ── GSAP pin approach ──────────────────────────────────────────────────
     CSS `position:sticky` keeps the inner element fixed but the PARENT hero
     body still scrolls as a tall black void — the animation appears detached
     from scroll and there's empty black space below.

     GSAP pin is correct: it fixes the hero element itself at the top, adds
     a spacer element equal to `end` pixels so the page has scroll content,
     and fires `onUpdate` on every scroll pixel — giving true 1:1 sync.

     5000px / 300 frames = ~16.7px per frame → very deliberate, slow scroll.
  ── */
  /* ─────────────────────────────────────
     MOBILE AUTO-LOOP
     No scroll scrub — play frames at 15fps in a fixed loop.
     Avoids jitter from touch events driving GSAP scrub.
  ───────────────────────────────────── */
  if (isMobile) {
    /* Play 0 → MOBILE_END at ~15fps, hold on last frame for 2s, then restart.
       When the user first scrolls, stop the loop and clear the canvas cleanly. */
    const MOBILE_END  = Math.max(Math.round(SEQUENCE_END_FRAME * 0.93), 10);
    let mobileIdx     = 0;
    let mobileHolding = false;
    let mobileTimer   = null;

    const startMobileLoop = () => {
      mobileTimer = setInterval(() => {
        if (firstScroll) {
          // User started scrolling — stop the loop, wipe canvas so no stale frame shows
          clearInterval(mobileTimer);
          lCtx.clearRect(0, 0, logoCanvas.width, logoCanvas.height);
          logoTexture.needsUpdate = true;
          return;
        }
        if (mobileHolding) return;
        scrollProgress = mobileIdx / SEQUENCE_END_FRAME;
        mobileIdx++;
        if (mobileIdx > MOBILE_END) {
          mobileHolding = true;
          setTimeout(() => { mobileIdx = 0; mobileHolding = false; }, 2200);
        }
      }, 67); // ~15fps
    };

    const waitFrames = setInterval(() => {
      if (frames[0]) { clearInterval(waitFrames); startMobileLoop(); }
    }, 200);
  }

  if (!isMobile) ScrollTrigger.create({
    trigger:    hero,
    start:      'top top',
    end:        `+=${Math.round(5000 * SEQUENCE_END_FRAME / SEQUENCE_FRAMES)}`,
    pin:        true,
    pinSpacing: true,
    scrub:      true,
    onUpdate: (self) => {
      if (!firstScroll && self.progress > 0.015) {
        firstScroll  = true;
        teaseRunning = false;

        // Kill outline RAF and fade out with transition
        outlineAlive = false;
        if (outlinePulseId) { cancelAnimationFrame(outlinePulseId); outlinePulseId = null; }
        if (logoOutline) {
          logoOutline.style.transition = 'opacity 0.45s ease, transform 0.5s ease';
          logoOutline.style.opacity    = '0';
          logoOutline.style.transform  = 'translate(-50%, -50%) scale(0.88)';
        }

        // Shrink scroll hint back to normal size
        if (scrollHint) scrollHint.classList.remove('hint-waiting');
      }
      scrollProgress = self.progress;
      const vel = Math.abs(self.getVelocity()) / 5000;
      prevOffset = Math.min(vel, 0.025);
      uniforms.uBrightness.value = 0.85 + self.progress * 0.15;
      document.documentElement.style.setProperty(
        '--scroll-ab',
        Math.min(vel * 3, 1).toFixed(3)
      );

      // Tagline: fade + slide up in first 18% of scroll
      if (tagline) {
        const t = Math.max(0, 1 - self.progress / 0.18);
        tagline.style.opacity   = t.toFixed(3);
        tagline.style.transform = `translateY(${(1 - t) * -36}px)`;
      }

      // Scan lines: each has its own progress window and opacity
      SCAN_LINES.forEach(({ el, pStart, pEnd, maxOpacity }) => {
        if (!el) return;
        const local = (self.progress - pStart) / (pEnd - pStart);
        if (local <= 0 || local >= 1) { el.style.opacity = '0'; return; }
        el.style.top = `${(8 + local * 82).toFixed(1)}%`;
        const fade = Math.min(local / 0.05, 1) * Math.max(0, 1 - (local - 0.93) / 0.07);
        el.style.opacity = (fade * maxOpacity).toFixed(3);
      });

      // Pieces lists: start off-screen below, last item reaches bottom at progress=1
      [piecesInnerLeft, piecesInnerRight].forEach(inner => {
        if (!inner) return;
        const vh    = window.innerHeight;
        const listH = inner.offsetHeight;
        // progress=0 → top of list at vh (all off-screen below)
        // progress=1 → last item exactly at bottom of container
        const ty = vh - self.progress * listH;
        inner.style.transform = `translateY(${ty.toFixed(1)}px)`;
      });
    },
  }); // end ScrollTrigger.create

  /* ─────────────────────────────────────
     TAGLINE — CHARACTER SCRAMBLE SETUP
     Split each .tagline-line into individual <span class="tc"> elements.
     Triggered once during revealWordmark().
  ───────────────────────────────────── */
  const taglineLines = tagline
    ? [...tagline.querySelectorAll('.tagline-line')]
    : [];

  const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*?';
  const RGB_CLASSES    = ['rgb-flash-r','rgb-flash-g','rgb-flash-b'];

  /* Build char-span arrays once */
  const taglineCharData = taglineLines.map((line) => {
    const original = line.dataset.text || line.textContent.trim();
    line.textContent = '';
    return [...original].map((ch) => {
      const span = document.createElement('span');
      span.className = 'tc';
      span.textContent = ch === ' ' ? ' ' : ch;
      span.style.opacity = '1';  /* visible on page load — scramble is purely visual */
      line.appendChild(span);
      return { span, ch };
    });
  });

  function scrambleRevealLine(charData, lineDelay) {
    const STAGGER    = 38;    // ms between characters
    const SCRAMBLE_T = 320;   // ms of scrambling before snap
    const TICK_MS    = 50;    // scramble tick interval

    charData.forEach(({ span, ch }, idx) => {
      if (ch === ' ' || ch === ' ') {
        setTimeout(() => { span.style.opacity = '1'; }, lineDelay + idx * STAGGER);
        return;
      }

      const startAt = lineDelay + idx * STAGGER;
      let elapsed   = 0;

      setTimeout(() => {
        span.style.opacity = '1';
        const iv = setInterval(() => {
          elapsed += TICK_MS;
          if (elapsed < SCRAMBLE_T) {
            /* Random character flash with brief RGB colouring */
            const rndChar = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            span.textContent = rndChar;
            /* One-in-three chance of an RGB flash */
            if (Math.random() < 0.33) {
              const cls = RGB_CLASSES[Math.floor(Math.random() * 3)];
              span.classList.add(cls);
              setTimeout(() => span.classList.remove(cls), TICK_MS);
            }
          } else {
            span.textContent = ch;
            RGB_CLASSES.forEach(c => span.classList.remove(c));
            clearInterval(iv);
          }
        }, TICK_MS);
      }, startAt);
    });
  }

  let taglineScrambleDone = false;

  function revealTaglineScramble() {
    if (taglineScrambleDone || !tagline) return;
    taglineScrambleDone = true;
    /* Tagline is always visible (opacity:1) — just run the scramble character animation */
    taglineCharData.forEach((charData, lineIdx) => {
      const lineDelay = lineIdx * 220;  // 220 ms gap between lines
      scrambleRevealLine(charData, lineDelay);
    });
  }

  /* ─────────────────────────────────────
     WORDMARK REVEAL
  ───────────────────────────────────── */
  let wordmarkRevealed = false;

  function revealWordmark() {
    if (wordmarkRevealed) return;
    wordmarkRevealed = true;

    gsap.to(wordLines, {
      clipPath: 'inset(0 0 0% 0)',
      opacity: 1,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
    });

    if (!taglineScrambleDone) {
      /* First time: scramble reveal */
      setTimeout(revealTaglineScramble, 400);
    } else {
      /* Subsequent reveals: simple fade in (already scrambled) */
      setTimeout(() => {
        if (tagline) gsap.to(tagline, { opacity: 1, duration: 0.5, ease: 'power2.out' });
      }, 400);
    }

    /* Signal widget to reveal itself after wordmark settles */
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('hero:wordmark-revealed'));
    }, 900);
  }

  function hideWordmark() {
    if (!wordmarkRevealed) return;
    wordmarkRevealed = false;

    /* Instant hide — no ghost when scrolling back up quickly */
    gsap.killTweensOf(wordLines);
    gsap.set(wordLines, { clipPath: 'inset(0 0 100% 0)', opacity: 0 });
    /* Tagline stays visible — it is always shown at the bottom of the hero */
  }

  /* ─────────────────────────────────────
     MOUSE → ABERRATION on wordmark
     Approaches zero as mouse nears text
  ───────────────────────────────────── */
  /* ── Wordmark: 2D prism aberration — opposite to mouse direction ── */
  const MAX_AB_WM  = 22;
  const SPREAD_WM  = 0.20;
  const REST_WM_X  = 12;
  const REST_WM_Y  = 3;

  function setWordmarkAb(line, ox, oy, blur) {
    const mag = Math.hypot(ox, oy);
    if (mag < 0.3) { line.style.textShadow = 'none'; return; }
    const ang = Math.atan2(oy, ox);
    const rX = (Math.cos(ang + SPREAD_WM) * mag).toFixed(1);
    const rY = (Math.sin(ang + SPREAD_WM) * mag).toFixed(1);
    const bX = (Math.cos(ang - SPREAD_WM) * mag).toFixed(1);
    const bY = (Math.sin(ang - SPREAD_WM) * mag).toFixed(1);
    const gX = (ox * 0.18).toFixed(1);
    const gY = (oy * 0.18 + 10).toFixed(1);  // +10px down → green visible below R and B
    line.style.textShadow = [
      `${rX}px ${rY}px ${blur.toFixed(1)}px rgba(255,0,0,1)`,
      `${gX}px ${gY}px ${Math.max(blur * 0.6, 3).toFixed(1)}px rgba(0,255,0,1)`,
      `${bX}px ${bY}px ${blur.toFixed(1)}px rgba(0,0,255,1)`,
    ].join(', ');
  }

  function restWordmark() {
    wordLines.forEach(l => setWordmarkAb(l, REST_WM_X, REST_WM_Y, 4));
  }
  restWordmark();

  /* ── Idle: wordmark drifts autonomously once revealed ── */
  let wmPhase       = Math.random() * Math.PI * 2;
  let wmMouseActive = false;

  (function wmTick(now) {
    requestAnimationFrame(wmTick);  // always reschedule
    if (!wordmarkRevealed || wmMouseActive) return;
    const t = now * 0.001;
    wordLines.forEach((line, i) => {
      const ox   = Math.sin(t * 0.52 + wmPhase + i * 0.8) * 18;
      const oy   = Math.cos(t * 0.38 + wmPhase + i * 0.6) * 7;
      const blur = 4 + Math.abs(ox) * 0.18;
      setWordmarkAb(line, ox, oy, blur);
    });
  })(performance.now());

  hero.addEventListener('mousemove', (e) => {
    wmMouseActive = true;
    wordLines.forEach((line) => {
      const rect    = line.getBoundingClientRect();
      const cx      = rect.left + rect.width  / 2;
      const cy      = rect.top  + rect.height / 2;
      const dX      = cx - e.clientX;
      const dY      = cy - e.clientY;
      const dist    = Math.hypot(dX, dY);
      if (dist < 5) { wmMouseActive = false; return; }
      const thresh    = Math.max(rect.width * 0.9, 280);
      const intensity = Math.min(dist / thresh, 1);
      const ox = (dX / dist) * MAX_AB_WM * intensity;
      const oy = (dY / dist) * MAX_AB_WM * intensity;
      setWordmarkAb(line, ox, oy, 9 * intensity);
    });
  });

  hero.addEventListener('mouseleave', () => { wmMouseActive = false; });

  /* ─────────────────────────────────────
     HERO RESET — shared by logo click AND idle timeout
  ───────────────────────────────────── */

  /* Kill active tease/outline immediately (call before scrolling) */
  function killActiveState() {
    teaseRunning = false;
    outlineAlive = false;
    if (outlinePulseId) { cancelAnimationFrame(outlinePulseId); outlinePulseId = null; }
    if (logoOutline) {
      logoOutline.style.transition = 'opacity 0.3s ease';
      logoOutline.style.opacity    = '0';
    }
  }

  /* Full state reset — call inside lenis.scrollTo onComplete */
  function performHeroReset() {
    firstScroll    = false;
    teaseRunning   = false;
    scrollProgress = 0;

    if (logoOutline) {
      logoOutline.style.transition = 'none';
      logoOutline.style.opacity    = '0';
      logoOutline.style.transform  = 'translate(-50%, -50%)';
    }
    if (scrollHint) scrollHint.classList.add('hint-waiting');

    window.addEventListener('wheel',     handleFirstScroll, { once: true, passive: true });
    window.addEventListener('touchmove', handleFirstScroll, { once: true, passive: true });

    setTimeout(startOutlinePulse, 1800);
    setTimeout(runTease, 2000);
  }

  /* Listen for idle-reset event dispatched by main.js */
  document.addEventListener('hero:idle-reset', performHeroReset);

  /* ─────────────────────────────────────
     LOGO CLICK → RESET FROM SCRATCH
  ───────────────────────────────────── */
  function handleLogoClick(e) {
    e.preventDefault();
    killActiveState();
    lenis.scrollTo(0, {
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      onComplete: performHeroReset,
    });
  }

  document.querySelectorAll('.nav-logo, .sw-logo').forEach(el => {
    el.addEventListener('click', handleLogoClick);
  });
}
