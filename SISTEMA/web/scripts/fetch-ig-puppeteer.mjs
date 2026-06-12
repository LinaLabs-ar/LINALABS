import puppeteer from 'puppeteer';
import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR   = path.resolve(__dirname, '..', 'public', 'assets', 'ig');
const PROFILE   = 'C:\Users\Razor\AppData\Local\Google\Chrome\User Data';
const CHROME    = 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe';
const USERNAME  = 'linalabs.ar';
const COUNT     = 9;

fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  executablePath: CHROME,
  userDataDir: PROFILE,
  args: ['--no-sandbox', '--profile-directory=Default'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  console.log('[fetch-ig] Opening Instagram...');
  await page.goto(, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  await page.evaluate(() => window.scrollBy(0, 600));
  await new Promise(r => setTimeout(r, 1500));

  const imageUrls = await page.evaluate((n) => {
    const imgs = [...document.querySelectorAll('img')];
    const seen = new Set(); const out = [];
    for (const img of imgs) {
      const src = img.src || '';
      if (src.includes('cdninstagram') && img.naturalWidth > 200 && !seen.has(src)) {
        seen.add(src); out.push(src);
        if (out.length >= n) break;
      }
    }
    return out;
  }, COUNT);

  if (!imageUrls.length) throw new Error('No images found');
  console.log('[fetch-ig] Found ' + imageUrls.length + ' images');

  for (let i = 0; i < imageUrls.length; i++) {
    const dest = path.join(OUT_DIR, 'ig-' + String(i+1).padStart(2,'0') + '.jpg');
    const b64 = await page.evaluate(async (src) => {
      const r = await fetch(src);
      const blob = await r.blob();
      return new Promise((res) => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result.split(',')[1]);
        fr.readAsDataURL(blob);
      });
    }, imageUrls[i]);
    fs.writeFileSync(dest, Buffer.from(b64, 'base64'));
    console.log('  OK ig-' + String(i+1).padStart(2,'0') + '.jpg (' + Math.round(fs.statSync(dest).size/1024) + 'KB)');
  }
  console.log('[fetch-ig] Done!');
} finally {
  await browser.close();
}
