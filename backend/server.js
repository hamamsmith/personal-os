const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');
const webpush = require('web-push');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup VAPID Keys untuk Web Push
const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;
if (publicVapidKey && privateVapidKey) {
  webpush.setVapidDetails('mailto:admin@personal-os.com', publicVapidKey, privateVapidKey);
}

// Middleware
app.use(cors()); // Mengizinkan request dari frontend
app.use(express.json()); // Membaca body request format JSON

// Menyediakan akses ke file Index.html dan sw.js
app.use(express.static(path.join(__dirname, '..')));

// Konfigurasi Database PostgreSQL
// (Nanti URL ini didapat dari Railway)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Endpoint Testing (Mirip doGet di Code.gs)
app.get('/api/status', (req, res) => {
  res.json({ status: 'success', message: 'Personal OS API is Active!' });
});

// Endpoint Utama Data (Pengganti doPost di Code.gs)
app.post('/api/data', async (req, res) => {
  try {
    const { action, data } = req.body;
    
    if (action === 'saveBattle') {
      const ts = data.date && data.date.length === 10 ? `${data.date} 23:59:00` : new Date().toISOString();
      await pool.query('INSERT INTO battles (timestamp, type, outcome, note, kategori) VALUES ($1, $2, $3, $4, $5)', [ts, data.type, data.outcomeVal, data.note, data.kategori]);
      return res.json({ status: 'success' });
    }
    
    else if (action === 'saveBrainDump') {
      const ts = new Date().toISOString();
      // Konversi ke WIB untuk ngecek hari ini
      const nowWIB = new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString().substring(0, 10);
      const exist = await pool.query("SELECT id FROM braindumps WHERE DATE(timestamp AT TIME ZONE 'Asia/Jakarta') = $1 LIMIT 1", [nowWIB]);
      
      if (exist.rows.length > 0) {
        await pool.query('UPDATE braindumps SET content = $1, timestamp = CURRENT_TIMESTAMP WHERE id = $2', [data, exist.rows[0].id]);
      } else {
        await pool.query('INSERT INTO braindumps (content) VALUES ($1)', [data]);
      }
      return res.json({ status: 'success' });
    }
    
    else if (action === 'saveScreenTime') {
      const ts = data.date && data.date.length === 10 ? `${data.date} 23:59:00` : new Date().toISOString();
      await pool.query('INSERT INTO screentimes (timestamp, total_duration, app1, dur1, app2, dur2, app3, dur3) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
        [ts, data.total || 0, data.app1Name, data.app1Dur || 0, data.app2Name, data.app2Dur || 0, data.app3Name, data.app3Dur || 0]);
      return res.json({ status: 'success' });
    }
    
    else if (action === 'saveDebrief') {
      const ts = data.date && data.date.length === 10 ? `${data.date} 23:59:00` : new Date().toISOString();
      await pool.query('INSERT INTO debriefs (timestamp, mood, energy, lesson, fix) VALUES ($1, $2, $3, $4, $5)', [ts, data.mood, data.energy, data.lesson, data.fix]);
      return res.json({ status: 'success' });
    }
    
    else if (action === 'getDashboardData') {
      // Ambil semua data
      const battles = await pool.query('SELECT * FROM battles ORDER BY id ASC');
      const braindumps = await pool.query('SELECT * FROM braindumps ORDER BY id ASC');
      const screentimes = await pool.query('SELECT * FROM screentimes ORDER BY id ASC');
      const debriefs = await pool.query('SELECT * FROM debriefs ORDER BY id ASC');

      const toWIBDate = (d) => {
        return new Date(new Date(d).getTime() + 7 * 60 * 60 * 1000).toISOString().substring(0, 19).replace('T', ' ');
      };
      
      const allBattles = [];
      let totalPositif = 0, totalNegatif = 0, positifBerhasil = 0, negatifTerkendali = 0;
      const freqPositif = {}, freqNegatif = {};
      
      const now = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
      const todayStr = now.toISOString().substring(0, 10);
      const currentDay = now.getDay();
      const sundayDate = new Date(now);
      sundayDate.setDate(now.getDate() - currentDay);
      
      const daysStr = [], chartLabels = [];
      const hariNames = ['Mgg','Sen','Sel','Rab','Kam','Jum','Sab'];
      for (let d = 0; d < 7; d++) {
        const dt = new Date(sundayDate);
        dt.setDate(sundayDate.getDate() + d);
        daysStr.push(dt.toISOString().substring(0, 10));
        const dd = String(dt.getDate()).padStart(2, '0');
        const mm = String(dt.getMonth() + 1).padStart(2, '0');
        chartLabels.push([`${dd}/${mm}`, hariNames[d]]);
      }
      
      const positifArray = [0,0,0,0,0,0,0], negatifArray = [0,0,0,0,0,0,0];

      battles.rows.forEach(b => {
        const ts = toWIBDate(b.timestamp);
        const type = String(b.type || '');
        const outcome = parseInt(b.outcome) || 0;
        const note = String(b.note || '');
        let kategori = String(b.kategori || 'Negatif').trim();
        if (kategori !== 'Positif') kategori = 'Negatif';
        
        allBattles.push({ ts: ts.substring(0, 16), type, outcome, note, kategori });
        
        if (kategori === 'Positif') {
          totalPositif++;
          if (outcome >= 4) positifBerhasil++;
          freqPositif[type] = (freqPositif[type] || 0) + 1;
        } else {
          totalNegatif++;
          if (outcome >= 4) negatifTerkendali++;
          freqNegatif[type] = (freqNegatif[type] || 0) + 1;
        }
        
        const rowDate = ts.substring(0, 10);
        const idx = daysStr.indexOf(rowDate);
        if (idx !== -1) {
          if (outcome >= 4) positifArray[idx]++;
          else if (outcome <= 2) negatifArray[idx]++;
        }
      });

      const successRate = totalPositif > 0 ? Math.round(positifBerhasil / totalPositif * 100) : 0;
      const kontrolRate = totalNegatif > 0 ? Math.round(negatifTerkendali / totalNegatif * 100) : 0;
      
      const sortedPos = Object.keys(freqPositif).sort((a,b) => freqPositif[b] - freqPositif[a]);
      const sortedNeg = Object.keys(freqNegatif).sort((a,b) => freqNegatif[b] - freqNegatif[a]);
      
      const freqAll = {};
      Object.keys(freqPositif).forEach(k => freqAll[k] = (freqAll[k] || 0) + freqPositif[k]);
      Object.keys(freqNegatif).forEach(k => freqAll[k] = (freqAll[k] || 0) + freqNegatif[k]);
      const sortedAll = Object.keys(freqAll).sort((a,b) => freqAll[b] - freqAll[a]);
      
      const top3Labels = [], top3Data = [], top3Kategori = [];
      for(let f = 0; f < Math.min(3, sortedAll.length); f++) {
        const key = sortedAll[f];
        top3Labels.push(key);
        top3Data.push(freqAll[key]);
        top3Kategori.push(freqPositif[key] ? 'Positif' : 'Negatif');
      }

      const allScreenTimes = [];
      let totalScreen = 0;
      screentimes.rows.forEach(s => {
        totalScreen += parseFloat(s.total_duration) || 0;
        allScreenTimes.push({
          date: toWIBDate(s.timestamp).substring(0,10), total: s.total_duration,
          a1: s.app1, d1: s.dur1 || 0, a2: s.app2, d2: s.dur2 || 0, a3: s.app3, d3: s.dur3 || 0
        });
      });
      const avgScreen = screentimes.rows.length > 0 ? (totalScreen / screentimes.rows.length).toFixed(1) : 0;

      const allDebriefs = debriefs.rows.map(d => ({
        date: toWIBDate(d.timestamp).substring(0,10), mood: d.mood, energy: d.energy, lesson: d.lesson, fix: d.fix
      }));

      let todayBrainDumpText = "";
      const pastBrainDumps = [];
      braindumps.rows.forEach(b => {
        const ts = toWIBDate(b.timestamp);
        if (ts.substring(0,10) === todayStr) todayBrainDumpText = b.content;
        else pastBrainDumps.push({ date: ts.substring(0,10), text: b.content });
      });

      return res.json({
        status: 'success',
        summary: { totalPositif, totalNegatif, successRate, kontrolRate, mostPositif: sortedPos[0] || null, mostNegatif: sortedNeg[0] || null, avgScreen },
        allBattles: allBattles.reverse(),
        allScreenTimes: allScreenTimes.reverse(),
        allDebriefs: allDebriefs.reverse(),
        todayBrainDumpText,
        pastBrainDumps: pastBrainDumps.reverse(),
        chartData: { winLoseLabels: chartLabels, positifData: positifArray, negatifData: negatifArray, freqLabels: top3Labels, freqData: top3Data, freqKategori: top3Kategori }
      });
    }
    return res.json({ status: 'error', message: 'Unknown action' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// Endpoint untuk Subscribe Notifikasi dari Chrome
app.post('/api/subscribe', async (req, res) => {
  try {
    const subscription = req.body;
    await pool.query(
      'INSERT INTO push_subscriptions (endpoint, keys) VALUES ($1, $2) ON CONFLICT (endpoint) DO NOTHING',
      [subscription.endpoint, JSON.stringify(subscription.keys)]
    );
    res.status(201).json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error' });
  }
});

// Endpoint yang akan dipanggil secara otomatis oleh Vercel Cron (misal tiap jam 21:00)
app.get('/api/cron-notify', async (req, res) => {
  try {
    const payload = JSON.stringify({
      title: 'Debrief Malam! 🌙',
      body: 'Waktunya isi jurnal malam, evaluasi hari ini biar besok lebih on-fire!'
    });
    
    // Ambil semua browser yang udah diizinin
    const subs = await pool.query('SELECT * FROM push_subscriptions');
    for (const sub of subs.rows) {
      const pushSub = { endpoint: sub.endpoint, keys: sub.keys };
      try {
        await webpush.sendNotification(pushSub, payload);
      } catch (e) {
        if (e.statusCode === 410) {
          // Kalau browser udah uninstall notif, hapus dari database
          await pool.query('DELETE FROM push_subscriptions WHERE endpoint = $1', [sub.endpoint]);
        }
      }
    }
    res.json({ status: 'success', sent: subs.rows.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error' });
  }
});

// Jalankan Server & Test Koneksi Database
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    try {
      const res = await pool.query('SELECT NOW()');
      console.log('✅ SUKSES: Berhasil menembus server PostgreSQL (Supabase Tokyo)! Waktu server:', res.rows[0].now);
    } catch (err) {
      console.error('❌ ERROR: Gagal connect ke database. Cek password di file .env lu bro!', err.message);
    }
  });
}

// Wajib buat Vercel Serverless
module.exports = app;
