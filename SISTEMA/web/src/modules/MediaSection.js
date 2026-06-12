/* ═══════════════════════════════════════
   MEDIA SECTION
   - Vertical video reel (play/pause on click)
   - Instagram grid — loads from /public/assets/ig/ig-01.jpg … ig-09.jpg
     (no API, no scroll trap — static files updated by scripts/fetch-ig.mjs)
═══════════════════════════════════════ */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* ── Instagram config ── */
const IG_USERNAME  = 'linalabs.ar';
const IG_POST_COUNT = 9;          // 3 columns × 3 rows
const IG_PROFILE_URL = `https://www.instagram.com/${IG_USERNAME}/`;

/* ── Build Instagram grid from static local images ──
   Files: /public/assets/ig/ig-01.jpg … ig-09.jpg
   Run scripts/fetch-ig.mjs to refresh them.         */
function buildStaticGrid(grid) {
  grid.innerHTML = '';

  for (let i = 1; i <= IG_POST_COUNT; i++) {
    const idx  = String(i).padStart(2, '0');
    const cell = document.createElement('a');
    cell.className = 'ig-post';
    cell.href      = IG_PROFILE_URL;
    cell.target    = '_blank';
    cell.rel       = 'noopener noreferrer';
    cell.setAttribute('aria-label', `Ver perfil de Lina Labs en Instagram`);

    const img    = document.createElement('img');
    img.src      = `/assets/ig/ig-${idx}.jpg`;
    img.alt      = '';
    img.loading  = 'lazy';
    img.decoding = 'async';

    /* Fallback: show branded placeholder tile if image 404s */
    img.onerror = () => {
      const hues = ['rgba(255,0,0,0.10)', 'rgba(0,255,0,0.10)', 'rgba(0,0,255,0.10)'];
      cell.style.background = `linear-gradient(135deg, ${hues[i % 3]}, rgba(0,0,0,0.05))`;
      img.remove();
      /* Show @linalabs label on placeholder */
      const lbl = document.createElement('div');
      lbl.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.22);font-family:Montserrat,sans-serif;';
      lbl.textContent = '@linalabs.ar';
      cell.appendChild(lbl);
    };

    const overlay = document.createElement('div');
    overlay.className = 'ig-post-overlay';
    overlay.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1.5"/>
      </svg>`;

    cell.appendChild(img);
    cell.appendChild(overlay);
    grid.appendChild(cell);
  }
}

/* ── Sync Instagram grid height to reel container height ──
   Called after DOM settles; ResizeObserver keeps it live.  */
function syncGridHeight(reelContainer, igContainer) {
  const h = reelContainer.getBoundingClientRect().height;
  if (h > 0) igContainer.style.height = h + 'px';
}

/* ── Reel video ── */
function setupReel() {
  const video   = document.getElementById('reel-video');
  const playBtn = document.getElementById('reel-play');
  if (!video || !playBtn) return;

  video.addEventListener('loadedmetadata', () => { video.play().catch(() => {}); });

  playBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      playBtn.classList.add('hidden');
    } else {
      video.pause();
      playBtn.classList.remove('hidden');
    }
  });

  video.addEventListener('pause', () => { playBtn.classList.remove('hidden'); });
  video.addEventListener('play',  () => { playBtn.classList.add('hidden');    });

  /* Autoplay when in viewport */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) video.play().catch(() => {});
        else                  video.pause();
      });
    },
    { threshold: 0.4 }
  );
  observer.observe(video);
}

/* ── Init ── */
export async function initMedia(lenis) {
  const grid          = document.getElementById('ig-grid');
  const igContainer   = document.getElementById('ig-grid-container');
  const reelContainer = document.querySelector('.reel-video-container');

  if (!grid || !igContainer) return;

  setupReel();

  /* ── Instagram grid — static images, no scroll trap ── */
  buildStaticGrid(grid);

  /* ── Height sync: make Instagram grid match reel's aspect-ratio height ── */
  if (reelContainer) {
    /* Initial sync after first paint */
    requestAnimationFrame(() => syncGridHeight(reelContainer, igContainer));

    /* Keep synced on resize */
    new ResizeObserver(() => syncGridHeight(reelContainer, igContainer))
      .observe(reelContainer);
  }

  /* ── Section entrance animation ── */
  ScrollTrigger.create({
    trigger: '.section-media',
    start: 'top 80%',
    onEnter: () => {
      gsap.from('.media-reel-wrap', {
        opacity: 0, x: -40, duration: 0.9, ease: 'power3.out',
      });
      gsap.from('.media-instagram-wrap', {
        opacity: 0, x: 40, duration: 0.9, delay: 0.15, ease: 'power3.out',
      });
    },
    once: true,
  });
}
