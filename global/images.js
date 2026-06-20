import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAPS_JSON_URL = 'https://raw.githubusercontent.com/kzglobalteam/cs2kz-images/public/maps.json';
const OUTPUT_DIR = path.join(__dirname, '../maps');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function downloadImage(url, filepath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(filepath, Buffer.from(buffer));
  console.log(`Downloaded: ${filepath}`);
}

function parseName(name) {
  const match = name.match(/^(.+?) Course (\d+)$/);
  if (!match) {
    console.warn(`⚠️ Error: ${name}`);
    return null;
  }
  let mapname = match[1];
  const course = parseInt(match[2], 10);
  if (mapname === 'kz_bluekarko' && course === 6) {
    return { mapname: 'kz_bluekarko', course, special: 'kz_bluekarko_666' };
  }
  return { mapname, course };
}

async function main() {
  const res = await fetch(MAPS_JSON_URL);
  if (!res.ok) throw new Error(`Cannot load maps.json: ${res.status}`);
  const data = await res.json();

  for (const item of data) {
    const parsed = parseName(item.name);
    if (!parsed) continue;
    const { mapname, course, special } = parsed;
    let filename;
    if (special) {
      filename = `${special}.jpg`;
    } else if (course === 1) {
      filename = `${mapname}.jpg`;
    } else {
      filename = `${mapname}_${course}.jpg`;
    }
    const filepath = path.join(OUTPUT_DIR, filename);
    const imageUrl = item.full;
    if (!imageUrl) {
      continue;
    }
    try {
      await downloadImage(imageUrl, filepath);
    } catch (err) {
      console.error(`❌ Error ${imageUrl}: ${err.message}`);
    }
  }
  console.log('🎉 Done!');
}

main().catch(console.error);