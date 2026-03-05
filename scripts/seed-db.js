import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/sakeenah',
});

async function seed() {
  try {
    // 1. Run Schema
    const schemaPath = path.join(__dirname, '../src/server/db/schema.sql.example');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Running schema...');
    await pool.query(schemaSql);
    console.log('Schema applied!');

    // 2. Insert Data
    const insertSql = `
    INSERT INTO invitations (
        uid,
        title,
        description,
        groom_name,
        bride_name,
        parent_groom,
        parent_bride,
        wedding_date,
        time,
        location,
        address,
        maps_url,
        maps_embed,
        og_image,
        favicon
    ) VALUES (
        'alexey-sofia-2026',
        'Свадьба Алексея и Софии',
        'Мы женимся и будем рады разделить этот день с вами.',
        'Алексей',
        'София',
        'Родители Алексея',
        'Родители Софии',
        '2026-06-03',
        '16:00–18:00',
        'Зал торжеств',
        'Адрес будет указан позже',
        'https://yandex.com/maps/-/CPe7bAz8',
        'https://yandex.ru/map-widget/v1/?ll=37.688032%2C55.563273&z=17&pt=37.688032%2C55.563273,pm2rdm',
        '/images/og-image.jpg',
        '/images/favicon.ico'
    ) ON CONFLICT (uid) DO NOTHING;
    `;
    console.log('Inserting wedding data...');
    await pool.query(insertSql);
    console.log('Wedding data inserted!');

  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await pool.end();
  }
}

seed();
