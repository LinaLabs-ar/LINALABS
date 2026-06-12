/* ═══════════════════════════════════════
   THEME TOGGLE — Dark / Light mode
   Persists in localStorage
   Hero always stays dark
═══════════════════════════════════════ */

export function initThemeToggle() {
  const btn  = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Restore from localStorage (default: dark)
  const saved = localStorage.getItem('linalabs-theme') || 'dark';
  root.setAttribute('data-theme', saved);

  btn?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('linalabs-theme', next);

    // Swap invert on logo/icons in dark mode
    updateLogoInvert(next);
  });

  // Initial invert state
  updateLogoInvert(saved);
}

function updateLogoInvert(theme) {
  // In dark mode: logos/icons that are black get filter:invert(1)
  // In light mode: logos/icons stay as-is (they're already dark)
  // The CSS handles this via [data-theme="dark"] rules
  // This function is here if we need JS-driven overrides later
}
