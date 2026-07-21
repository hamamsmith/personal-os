require('dotenv').config();
const { Pool } = require('pg');
const xlsx = require('xlsx');
const path = require('path');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrateData() {
  try {
    const filePath = path.join(__dirname, '..', 'db tracking habit v.01.xlsx');
    console.log(`Membaca file Excel: ${filePath}`);
    
    // cellDates: true agar format tanggal Excel otomatis jadi object Date Javascript
    const workbook = xlsx.readFile(filePath, { cellDates: true });

    // Fungsi aman untuk parse durasi (kadang Excel baca angka desimal sebagai jam)
    const parseDur = (val) => {
      if (Object.prototype.toString.call(val) === '[object Date]') {
        return parseFloat(val.getUTCHours() + '.' + val.getUTCMinutes()) || 0;
      }
      return parseFloat(val) || 0;
    };

    // 1. Migrate Battle
    if (workbook.SheetNames.includes('Battle')) {
      const data = xlsx.utils.sheet_to_json(workbook.Sheets['Battle'], { defval: null });
      console.log(`Mengimpor ${data.length} baris ke tabel battles...`);
      for (const row of data) {
        if (!row.Timestamp) continue;
        const ts = new Date(row.Timestamp).toISOString();
        const type = String(row.Battle || row.Musuh || '');
        const outcome = parseInt(row.Outcome || row.Skor_Outcome) || 0;
        const note = String(row.Catatan || '');
        const kategori = String(row.Kategori || 'Negatif');
        await pool.query('INSERT INTO battles (timestamp, type, outcome, note, kategori) VALUES ($1, $2, $3, $4, $5)', [ts, type, outcome, note, kategori]);
      }
    }

    // 2. Migrate BrainDump
    if (workbook.SheetNames.includes('BrainDump')) {
      const data = xlsx.utils.sheet_to_json(workbook.Sheets['BrainDump'], { defval: null });
      console.log(`Mengimpor ${data.length} baris ke tabel braindumps...`);
      for (const row of data) {
        if (!row.Timestamp) continue;
        const ts = new Date(row.Timestamp).toISOString();
        const content = String(row.Isi_Pikiran || '');
        await pool.query('INSERT INTO braindumps (timestamp, content) VALUES ($1, $2)', [ts, content]);
      }
    }

    // 3. Migrate ScreenTime
    if (workbook.SheetNames.includes('ScreenTime')) {
      const data = xlsx.utils.sheet_to_json(workbook.Sheets['ScreenTime'], { defval: null });
      console.log(`Mengimpor ${data.length} baris ke tabel screentimes...`);
      for (const row of data) {
        if (!row.Timestamp) continue;
        const ts = new Date(row.Timestamp).toISOString();
        await pool.query('INSERT INTO screentimes (timestamp, total_duration, app1, dur1, app2, dur2, app3, dur3) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
          [ts, parseDur(row.Total_Durasi), String(row.App_1 || ''), parseDur(row.Durasi_1), String(row.App_2 || ''), parseDur(row.Durasi_2), String(row.App_3 || ''), parseDur(row.Durasi_3)]);
      }
    }

    // 4. Migrate Debrief
    if (workbook.SheetNames.includes('Debrief')) {
      const data = xlsx.utils.sheet_to_json(workbook.Sheets['Debrief'], { defval: null });
      console.log(`Mengimpor ${data.length} baris ke tabel debriefs...`);
      for (const row of data) {
        if (!row.Timestamp) continue;
        const ts = new Date(row.Timestamp).toISOString();
        await pool.query('INSERT INTO debriefs (timestamp, mood, energy, lesson, fix) VALUES ($1, $2, $3, $4, $5)', 
          [ts, String(row.Mood || ''), parseInt(row.Level_Energi) || 0, String(row.Pelajaran_Penting || ''), String(row.Target_Perbaikan || '')]);
      }
    }

    console.log('✅ MIGRASI SELESAI SEMPURNA!');
    process.exit(0);
  } catch (err) {
    console.error('❌ GAGAL MIGRASI:', err);
    process.exit(1);
  }
}

migrateData();
