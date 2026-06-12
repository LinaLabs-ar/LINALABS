/**
 * fetch-ig.mjs — Instagram image fetcher via instaloader
 * ────────────────────────────────────────────────────────
 * Downloads the latest 9 posts from @linalabs.ar and saves:
 *   public/assets/ig/ig-01.jpg … ig-09.jpg
 *
 * ── ONE-TIME SETUP (must do this once before automating) ──
 *
 *   1. pip install instaloader
 *   2. In a terminal, run:
 *        python -m instaloader --login TU_USUARIO_IG
 *      (enter your Instagram password when prompted)
 *   3. Instaloader saves the session to:
 *        C:\Users\Razor\AppData\Roaming\instaloader\session-TU_USUARIO_IG
 *      You only need to do this once — it stays valid for months.
 *
 * ── USAGE ──
 *   node scripts/fetch-ig.mjs
 *   npm run fetch-ig
 *
 * ── WEEKLY AUTOMATION — Windows Task Scheduler ──
 *   See instructions at bottom of this file.
 */

import { execFileSync, execSync } from 'child_process';
import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR    = path.resolve(__dirname, '..', 'public', 'assets', 'ig');
const TEMP_DIR   = path.resolve(__dirname, '..', 'node_modules', '.ig-tmp');
const USERNAME   = 'linalabs.ar';
const POST_COUNT = 9;

fs.mkdirSync(OUT_DIR,  { recursive: true });
fs.mkdirSync(TEMP_DIR, { recursive: true });

/* ── Detect python command ── */
function findPython() {
  for (const cmd of ['python', 'python3']) {
    try { execSync(`${cmd} --version`, { stdio: 'pipe' }); return cmd; } catch (_) {}
  }
  return null;
}

/* ── Check instaloader is installed ── */
function hasInstaloader(py) {
  try { execSync(`${py} -m instaloader --version`, { stdio: 'pipe' }); return true; }
  catch (_) { return false; }
}

/* ── Find a saved instaloader session ── */
function findSession() {
  const appdata = process.env.APPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Roaming');
  const sessionDir = path.join(appdata, 'instaloader');
  if (!fs.existsSync(sessionDir)) return null;
  const files = fs.readdirSync(sessionDir).filter(f => f.startsWith('session-'));
  return files.length ? path.join(sessionDir, files[0]) : null;
}

async function main() {
  const py = findPython();
  if (!py) {
    console.error('[fetch-ig] Python not found. Install Python then: pip install instaloader');
    process.exit(1);
  }

  if (!hasInstaloader(py)) {
    console.error('[fetch-ig] instaloader not installed. Run: pip install instaloader');
    process.exit(1);
  }

  const session = findSession();
  if (!session) {
    console.error('\n[fetch-ig] No Instagram session found.\n');
    console.error('  One-time setup required:');
    console.error('    1. Open a terminal');
    console.error('    2. Run: python -m instaloader --login TU_USUARIO_IG');
    console.error('    3. Enter your Instagram password');
    console.error('    4. Then run: npm run fetch-ig\n');
    process.exit(1);
  }

  /* Extract username from session filename: session-foo → foo */
  const loginUser = path.basename(session).replace('session-', '');
  console.log(`[fetch-ig] Using saved session for @${loginUser}`);
  console.log(`[fetch-ig] Fetching latest ${POST_COUNT} posts from @${USERNAME} …`);

  const profileDir = path.join(TEMP_DIR, USERNAME);
  if (fs.existsSync(profileDir)) fs.rmSync(profileDir, { recursive: true, force: true });

  const args = [
    '-m', 'instaloader',
    '--sessionfile', session,
    '--dirname-pattern', TEMP_DIR,
    '--filename-pattern', '{date_utc:%Y%m%d_%H%M%S}_{shortcode}',
    '--no-captions',
    '--no-metadata-json',
    '--no-compress-json',
    '--no-profile-pic',
    '--no-videos',
    '--post-filter', 'not is_video',
    '--count', String(POST_COUNT * 2),
    '--', USERNAME,
  ];

  try {
    execFileSync(py, args, { stdio: 'inherit', timeout: 120_000 });
  } catch (_) {
    if (!fs.existsSync(profileDir)) {
      console.error('[fetch-ig] Download failed. Session may have expired.');
      console.error('[fetch-ig] Re-run: python -m instaloader --login ' + loginUser);
      process.exit(1);
    }
    console.warn('[fetch-ig] Partial download — continuing with what was fetched …');
  }

  /* Collect JPGs sorted newest-first */
  let files = [];
  if (fs.existsSync(profileDir)) {
    files = fs.readdirSync(profileDir)
      .filter(f => /\.(jpg|jpeg)$/i.test(f))
      .sort().reverse()
      .slice(0, POST_COUNT);
  }

  if (!files.length) {
    console.error('[fetch-ig] No images found.');
    process.exit(1);
  }

  console.log(`[fetch-ig] Found ${files.length} images → public/assets/ig/`);
  for (let i = 0; i < files.length; i++) {
    const dest = path.join(OUT_DIR, `ig-${String(i + 1).padStart(2, '0')}.jpg`);
    fs.copyFileSync(path.join(profileDir, files[i]), dest);
    console.log(`  ✓ ig-${String(i + 1).padStart(2, '0')}.jpg`);
  }

  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  console.log('\n[fetch-ig] Done! Run  npm run build  to deploy the new images.\n');
}

main().catch(err => {
  console.error('[fetch-ig] Fatal:', err.message);
  process.exit(1);
});

/*
 ═══════════════════════════════════════════════════════════
  WEEKLY AUTOMATION — Windows Task Scheduler
 ═══════════════════════════════════════════════════════════

 1. Create file:  D:\...\LINALABS\SISTEMA\web\fetch-ig-weekly.bat
    Contents:
      @echo off
      cd /d "D:\Users\Razor\Documents\Razor\Clientes\LINALABS\SISTEMA\web"
      call npm run fetch-ig >> logs\ig-fetch.log 2>&1
      call npm run build    >> logs\ig-fetch.log 2>&1

 2. Open Task Scheduler  (Win+R → taskschd.msc)
    → Create Basic Task
    → Name: Lina Labs - Refresh Instagram
    → Trigger: Weekly (pick any day, e.g. Monday 9:00 AM)
    → Action: Start a Program
    → Program: D:\...\LINALABS\SISTEMA\web\fetch-ig-weekly.bat
    → Finish

 That's it — Instagram images auto-refresh every week.
 ═══════════════════════════════════════════════════════════
*/
