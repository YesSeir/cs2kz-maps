import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Для работы с __dirname в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAPS_JSON_PATH = path.resolve(__dirname, '../maps.json');
const API_URL = 'https://api.cs2kz.org/maps';

const TIER_MAP = {
  'very-easy': 1,
  'easy': 2,
  'medium': 3,
  'advanced': 4,
  'hard': 5,
  'very-hard': 6,
  'extreme': 7,
  'death': 8,
  'unfeasible': 9,
  'impossible': 10,
};

function parseTier(str) {
  if (!str) return 0;
  const normalized = str.toLowerCase().trim();
  return TIER_MAP[normalized] ?? 0;
}

async function fetchMapsFromAPI() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.values;
}

function buildMapIndex(apiMaps) {
  const index = new Map();
  for (const apiMap of apiMaps) {
    const mapName = apiMap.name;
    const courses = apiMap.courses || [];
    const courseMap = new Map();
    for (const course of courses) {
      const courseName = course.name;
      courseMap.set(courseName, course);
    }
    index.set(mapName, courseMap);
  }
  return index;
}

function updateTiers(mapsJson, mapIndex) {
  const updated = [];
  let changedCount = 0;

  for (const entry of mapsJson) {
    const { mapname, coursename } = entry;
    const courseMap = mapIndex.get(mapname);
    if (!courseMap) {
      updated.push(entry);
      continue;
    }

    const course = courseMap.get(coursename);
    if (!course) {
      updated.push(entry);
      continue;
    }

    const filters = course.filters || {};
    const classic = filters.classic || {};
    const vanilla = filters.vanilla || {};

    const newCkzNub = parseTier(classic.nub_tier);
    const newCkzPro = parseTier(classic.pro_tier);
    const newVnlNub = parseTier(vanilla.nub_tier);
    const newVnlPro = parseTier(vanilla.pro_tier);

    const oldCkzNub = entry.ckznubtier ?? 0;
    const oldCkzPro = entry.ckzprotier ?? 0;
    const oldVnlNub = entry.vnlnubtier ?? 0;
    const oldVnlPro = entry.vnlprotier ?? 0;

    if (
      oldCkzNub !== newCkzNub ||
      oldCkzPro !== newCkzPro ||
      oldVnlNub !== newVnlNub ||
      oldVnlPro !== newVnlPro
    ) {
      changedCount++;
    }

    updated.push({
      ...entry,
      ckznubtier: newCkzNub,
      ckzprotier: newCkzPro,
      vnlnubtier: newVnlNub,
      vnlprotier: newVnlPro,
    });
  }

  return { updated, changedCount };
}

async function main() {
  try {
    console.log('📥 Reading maps.json...');
    const mapsRaw = fs.readFileSync(MAPS_JSON_PATH, 'utf-8');
    const mapsJson = JSON.parse(mapsRaw);

    console.log('🌐 Fetching data from API...');
    const apiMaps = await fetchMapsFromAPI();
    console.log(`✅ Retrieved ${apiMaps.length} maps from API`);

    console.log('🔍 Building index...');
    const mapIndex = buildMapIndex(apiMaps);

    console.log('🔄 Updating tiers...');
    const { updated, changedCount } = updateTiers(mapsJson, mapIndex);

    console.log(`✏️ Changed entries: ${changedCount}`);

    console.log('💾 Saving maps.json...');
    fs.writeFileSync(MAPS_JSON_PATH, JSON.stringify(updated, null, 2), 'utf-8');

    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();