import Database from 'better-sqlite3';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const MBTILES_PATH = path.resolve(
  __dirname,
  '../src/data/argentina.mbtiles'
);

const db = new Database(MBTILES_PATH, { readonly: true });

// --- Metadata ---
console.log('=== METADATA ===');
const metadata = db.prepare('SELECT name, value FROM metadata ORDER BY name').all();
for (const row of metadata) {
  console.log(`  ${row.name}: ${row.value}`);
}

// --- First 3 tiles ---
console.log('\n=== FIRST 3 TILES ===');
const tiles = db
  .prepare('SELECT zoom_level, tile_column, tile_row, tile_data FROM tiles LIMIT 3')
  .all();

for (const tile of tiles) {
  const buf = Buffer.isBuffer(tile.tile_data)
    ? tile.tile_data
    : Buffer.from(tile.tile_data);

  const first16 = buf.slice(0, 16).toString('hex').match(/.{2}/g).join(' ');
  console.log(`\n  zoom=${tile.zoom_level}  col=${tile.tile_column}  row=${tile.tile_row}`);
  console.log(`  size: ${buf.length} bytes`);
  console.log(`  first 16 bytes: ${first16}`);

  // Detect format from magic bytes
  let format = 'unknown';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) format = 'PNG';
  else if (buf[0] === 0xff && buf[1] === 0xd8) format = 'JPEG';
  else if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) format = 'WebP (RIFF)';
  else if (buf[0] === 0x1f && buf[1] === 0x8b) format = 'GZIP (likely MVT/PBF)';
  else if (buf[0] === 0x78 && (buf[1] === 0x9c || buf[1] === 0x01 || buf[1] === 0xda)) format = 'ZLIB';
  console.log(`  detected format: ${format}`);
}

db.close();
