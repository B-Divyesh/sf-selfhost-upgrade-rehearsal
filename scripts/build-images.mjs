import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../assets/source/specimen-upgrade.png', import.meta.url));
const publicDir = (name) => fileURLToPath(new URL(`../site/public/${name}`, import.meta.url));

await sharp(source)
  .resize(840, 840, { fit: 'cover' })
  .webp({ quality: 76, effort: 6 })
  .toFile(publicDir('specimen-upgrade.webp'));

const title = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#F3EEDC"/>
  <rect x="56" y="56" width="1088" height="518" fill="none" stroke="#18332D" stroke-width="3"/>
  <text x="84" y="130" fill="#C84B2F" font-family="monospace" font-size="22" font-weight="700" letter-spacing="3">UPGRADE FIELD RECEIPT</text>
  <text x="84" y="225" fill="#18332D" font-family="Georgia,serif" font-size="68" font-weight="700">Rehearse upgrades</text>
  <text x="84" y="307" fill="#18332D" font-family="Georgia,serif" font-size="68" font-weight="700">before customers do.</text>
  <text x="84" y="380" fill="#53655E" font-family="monospace" font-size="23">backup · restore · config · resources</text>
  <rect x="84" y="454" width="337" height="62" rx="2" fill="#315E49"/>
  <text x="112" y="494" fill="#FFFCED" font-family="monospace" font-size="22" font-weight="700">READINESS RECEIPT</text>
</svg>`);

const plant = await sharp(source)
  .resize(540, 540, { fit: 'cover' })
  .webp({ quality: 78 })
  .toBuffer();

await sharp(title)
  .composite([{ input: plant, left: 646, top: 44, blend: 'multiply' }])
  .webp({ quality: 82, effort: 6 })
  .toFile(publicDir('og-card.webp'));

await sharp(Buffer.from(`<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg"><rect width="180" height="180" rx="28" fill="#F3EEDC"/><path d="M92 145V70M90 106c-27-3-41-20-43-47 27 0 43 14 45 38M93 89c5-27 22-41 49-41-1 27-15 43-43 47" fill="none" stroke="#315E49" stroke-width="11" stroke-linecap="round"/><path d="M61 145h62" stroke="#C84B2F" stroke-width="9"/></svg>`))
  .png()
  .toFile(publicDir('apple-touch-icon.png'));
