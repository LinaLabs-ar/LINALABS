/* ═══════════════════════════════════════
   PDF VIEWER — StPageFlip + static JPG sequences
   ─────────────────────────────────────
   • Static JPG sequences — zero pdf.js, zero worker, zero canvas rendering
   • portfolio/portfolio_001.jpg … 075.jpg  (75 pages)
   • propuesta/propuesta_001.jpg … 009.jpg  (9 pages)
   ─────────────────────────────────────
   ROOT CAUSE FIX:
   PageFlip 2.0.7 destroy() only does this.pages = [] — it does NOT stop
   its internal requestAnimationFrame loop. If we reuse the same container
   element the old RAF keeps running on it and corrupts the new instance.

   Solution: each buildFlipBook() call replaces #flip-book with a brand-new
   <div> element. The old PageFlip instance keeps its reference to the OLD
   (now detached) node and runs harmlessly until GC. The new instance starts
   on a completely fresh node. No conflicts, no corruption, no stale state.
═══════════════════════════════════════ */
import { PageFlip } from 'page-flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* ── Sequence config ──
   portrait: true  → PageFlip shows 1 page at a time (fills available width)
   portrait: false → PageFlip shows 2-page spread (each page = half available width)
── */
/* Both in spread mode (2 pages side-by-side) so they appear similar in size.
   Propuesta pages are 16:9 landscape so each page is shorter but same width as portfolio. */
const SEQUENCES = {
  portfolio: { path: '/assets/pdfs/portfolio/portfolio_', pages: 75, ext: 'jpg', portrait: false },
  propuesta: { path: '/assets/pdfs/propuesta/propuesta_', pages: 9,  ext: 'jpg', portrait: false },
};

/* ── State ── */
let currentFlipBook = null;
let isBuilding      = false;   // concurrent-build guard

/* ── Fresh container — detaches old element so its lingering RAF is harmless ── */
function freshContainer() {
  const wrapper  = document.getElementById('flip-book-container');
  if (!wrapper) return null;

  /* Remove old #flip-book (old PageFlip RAF still holds a ref to it — now detached) */
  const old = document.getElementById('flip-book');
  if (old) old.remove();

  const el = document.createElement('div');
  el.id = 'flip-book';
  wrapper.appendChild(el);
  return el;
}

/* ── Build flip-book from JPG sequence ── */
async function buildFlipBook(pdfKey) {
  /* Prevent concurrent builds (rapid tab clicks) */
  if (isBuilding) return;
  isBuilding = true;

  const wrapper = document.getElementById('flip-book-container');
  if (!wrapper) { isBuilding = false; return; }

  const seq       = SEQUENCES[pdfKey];
  const totalEl   = document.getElementById('pdf-total');
  const currentEl = document.getElementById('pdf-current');

  /* ── 1. Discard old instance (stops it from interfering) ── */
  if (currentFlipBook) {
    try { currentFlipBook.destroy(); } catch (_) {}
    currentFlipBook = null;
  }

  /* ── 2. Show loading state in a fresh container ── */
  const loadingEl = freshContainer();
  loadingEl.innerHTML =
    '<div class="pdf-loading"><div class="pdf-loading-ring"></div><p>Cargando…</p></div>';

  /* ── 3. Probe first image for natural dimensions ── */
  let pageW = 794, pageH = 1123;
  try {
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload  = () => { pageW = img.naturalWidth; pageH = img.naturalHeight; resolve(); };
      img.onerror = reject;
      img.src = `${seq.path}${String(1).padStart(3, '0')}.${seq.ext}`;
    });
  } catch (_) { /* use A4 fallback */ }

  /* ── 4. Replace container AGAIN with a perfectly clean element ── */
  const container = freshContainer();   // completely empty — no loading div

  /* ── 5. Compute display dimensions ──
     Goal: the entire section (header + tabs + flip-book + controls) fits in one viewport.
     Overhead = navbar + section-padding + header + tabs + controls ≈ 300px.
     Constrain by both available width AND available height.
  ── */
  const isMobile   = window.matchMedia('(max-width: 640px)').matches;
  const OVERHEAD   = isMobile ? 240 : 380;
  const availW     = isMobile
    ? Math.max(window.innerWidth - 8, 300)          // flush to screen on mobile
    : Math.max(window.innerWidth - 80, 320);
  const availH     = Math.max(window.innerHeight - OVERHEAD, 280);
  const aspect     = pageH / pageW;

  /* Force portrait (single page) on mobile regardless of sequence config */
  const usePortrait = isMobile ? true : (seq.portrait ?? false);

  // Width-constrained page size
  const dispW_byW  = usePortrait ? availW : Math.round(availW / 2);
  const dispH_byW  = Math.round(dispW_byW * aspect);

  // Pick the fitting dimension (whichever constraint is tighter)
  const dispH = Math.min(dispH_byW, availH);
  const dispW = Math.round(dispH / aspect);

  /* ── 6. Build .flip-page divs ── */
  for (let i = 1; i <= seq.pages; i++) {
    const div = document.createElement('div');
    div.className = 'flip-page';

    const img    = document.createElement('img');
    img.src      = `${seq.path}${String(i).padStart(3, '0')}.${seq.ext}`;
    img.alt      = '';
    /* All pages eager for small sequences; lazy after page 12 for large ones */
    img.loading  = (seq.pages <= 12 || i <= 12) ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    img.onerror  = () => { div.style.background = 'rgba(10,10,10,0.9)'; img.remove(); };

    div.appendChild(img);
    container.appendChild(div);
  }

  /* ── 7. Init PageFlip on the fresh container ── */
  try {
    currentFlipBook = new PageFlip(container, {
      width:               dispW,
      height:              dispH,
      size:                'fixed',
      minWidth:            200,
      maxWidth:            2000,
      minHeight:           200,
      maxHeight:           2400,
      showCover:           true,
      mobileScrollSupport: false,
      drawShadow:          !isMobile,
      flippingTime:        isMobile ? 600 : 900,
      usePortrait:         usePortrait,
      startZIndex:         10,
      autoSize:            true,
      maxShadowOpacity:    0.5,
      showPageCorners:     true,
      disableFlipByClick:  false,
    });

    currentFlipBook.loadFromHTML(container.querySelectorAll('.flip-page'));

    if (totalEl)   totalEl.textContent   = seq.pages;
    if (currentEl) currentEl.textContent = 1;

    currentFlipBook.on('flip', (e) => {
      if (currentEl) currentEl.textContent = e.data + 1;
    });

  } catch (err) {
    console.warn('[PDFViewer] PageFlip init failed:', err);
    container.innerHTML = `
      <div class="pdf-loading" style="text-align:center;">
        <p style="color:var(--text-muted);font-size:13px;max-width:300px;
                  line-height:1.8;letter-spacing:0.06em;text-transform:uppercase;">
          Próximamente
        </p>
      </div>`;
  }

  isBuilding = false;
}

/* ── Controls ── */
function setupControls() {
  document.getElementById('pdf-prev')
    ?.addEventListener('click', () => currentFlipBook?.flipPrev());
  document.getElementById('pdf-next')
    ?.addEventListener('click', () => currentFlipBook?.flipNext());
}

/* ── Tab switching ── */
function setupTabs() {
  const tabs = document.querySelectorAll('.pdf-tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active')) return;   // already on this tab
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      buildFlipBook(tab.dataset.pdf);
    });
  });
}

/* ── Init ── */
export function initPDFViewer() {
  if (!document.getElementById('flip-book')) return;

  setupControls();
  setupTabs();

  /* Defer so all other modules + first ScrollTrigger.refresh() run before
     the flip-book expands the DOM. Refresh again after build. */
  setTimeout(async () => {
    await buildFlipBook('portfolio');
    ScrollTrigger.refresh();
  }, 300);
}
