const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');
const webpush = require('web-push');
const path = require('path');
const crypto = require('crypto');

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

// === Admin auth (sementara) ===
// Kredensial sementara; utamakan env Vercel (ADMIN_USER/ADMIN_PASS) lalu fallback.
// PENTING: ganti lewat env untuk produksi, jangan biarkan default.
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'vareya-dev-secret-change-me';
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 jam

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

function makeAdminToken() {
  const exp = Date.now() + TOKEN_TTL_MS;
  const base = String(exp);
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(base).digest('hex');
  return base + '.' + sig;
}

function verifyAdminToken(tok) {
  const s = String(tok || '');
  const i = s.indexOf('.');
  if (i < 0) return false;
  const base = s.slice(0, i);
  const sig = s.slice(i + 1);
  const exp = parseInt(base, 10);
  if (!exp || Date.now() > exp) return false;
  return safeEqual(sig, crypto.createHmac('sha256', TOKEN_SECRET).update(base).digest('hex'));
}

// Lolos bila: admin key cocok (kalau ADMIN_KEY diset) ATAU token admin valid.
function adminAuthorized(req) {
  const adminKey = process.env.ADMIN_KEY;
  const provided = String(req.get('x-admin-key') || '');
  if (adminKey && provided && safeEqual(provided, adminKey)) return true;
  return verifyAdminToken(req.get('x-admin-token'));
}

// Menyediakan akses ke file Index.html dan sw.js
app.use(express.static(path.join(__dirname, '..')));

// Konfigurasi Database PostgreSQL
// (Nanti URL ini didapat dari Railway)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Endpoint Testing (Mirip doGet di Code.gs)
app.get('/api/status', (req, res) => {
  res.json({ status: 'success', message: 'Vareya API is Active!' });
});

// Endpoint Utama Data (Pengganti doPost di Code.gs)
app.post('/api/data', async (req, res) => {
  try {
    const { action, data } = req.body;

    if (action === 'saveBattle') {
      const ts = data.date && data.date.length === 10 ? `${data.date} 12:00:00` : new Date().toISOString();
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
      const ts = data.date && data.date.length === 10 ? `${data.date} 12:00:00` : new Date().toISOString();
      await pool.query('INSERT INTO screentimes (timestamp, total_duration, app1, dur1, app2, dur2, app3, dur3) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [ts, data.total || 0, data.app1Name, data.app1Dur || 0, data.app2Name, data.app2Dur || 0, data.app3Name, data.app3Dur || 0]);
      return res.json({ status: 'success' });
    }

    else if (action === 'saveDebrief') {
      const ts = data.date && data.date.length === 10 ? `${data.date} 12:00:00` : new Date().toISOString();
      await pool.query('INSERT INTO debriefs (timestamp, mood, energy, lesson, fix) VALUES ($1, $2, $3, $4, $5)', [ts, data.mood, data.energy, data.lesson, data.fix]);
      return res.json({ status: 'success' });
    }

    else if (action === 'saveProfile') {
      const p = data || {};
      const accountRef = String(p.accountRef || '').trim();
      const name = String(p.name || '').trim();
      const username = String(p.username || '').trim().toLowerCase();
      if (!/^[A-Za-z0-9-]{8,64}$/.test(accountRef)) {
        return res.status(400).json({ status: 'error', message: 'accountRef tidak valid' });
      }
      if (!name || name.length > 80) {
        return res.status(400).json({ status: 'error', message: 'Nama wajib diisi (maks 80 karakter)' });
      }
      if (username && !/^[a-z0-9._]{3,24}$/.test(username)) {
        return res.status(400).json({ status: 'error', message: 'Username tidak valid (3-24 karakter: huruf, angka, titik, garis bawah)' });
      }
      const asDate = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(String(v || '')) ? v : null);
      const platform = String(p.platform || 'android').slice(0, 20);

      await pool.query(
        `INSERT INTO profiles (account_ref, name, birth_date, joined_at, platform, username, last_seen_at, last_login_at)
         VALUES ($1, $2, $3, $4, $5, $6, now(), now())
         ON CONFLICT (account_ref) DO UPDATE SET
           name = EXCLUDED.name,
           birth_date = EXCLUDED.birth_date,
           joined_at = EXCLUDED.joined_at,
           platform = EXCLUDED.platform,
           username = COALESCE(EXCLUDED.username, profiles.username),
           last_seen_at = now(),
           last_login_at = now(),
           updated_at = now()`,
        [accountRef, name, asDate(p.birthDate), asDate(p.joinedAt), platform, username || null]
      );
      return res.json({ status: 'success' });
    }

    else if (action === 'heartbeat') {
      const p = data || {};
      const accountRef = String(p.accountRef || '').trim();
      if (!/^[A-Za-z0-9-]{8,64}$/.test(accountRef)) {
        return res.status(400).json({ status: 'error', message: 'accountRef tidak valid' });
      }
      const updated = await pool.query(
        `UPDATE profiles SET last_seen_at = now(), updated_at = now() WHERE account_ref = $1 RETURNING id`,
        [accountRef]
      );
      if (updated.rows.length === 0) {
        return res.json({ status: 'unknown_account' });
      }
      return res.json({ status: 'success' });
    }

    else if (action === 'adminLogin') {
      const p = data || {};
      const user = String(p.username || '').trim();
      const pass = String(p.password || '');
      if (!safeEqual(user, ADMIN_USER) || !safeEqual(pass, ADMIN_PASS)) {
        return res.status(401).json({ status: 'error', message: 'Username atau password admin salah' });
      }
      return res.json({ status: 'success', token: makeAdminToken(), expiresInMs: TOKEN_TTL_MS });
    }

    else if (action === 'getProfiles') {
      if (!adminAuthorized(req)) {
        const adminKey = process.env.ADMIN_KEY;
        if (!adminKey) {
          return res.status(503).json({ status: 'error', message: 'Server belum punya ADMIN_KEY. Login via username/password admin.' });
        }
        return res.status(401).json({ status: 'error', message: 'Kunci admin salah' });
      }
      const rows = await pool.query(
        `SELECT id, account_ref, username, name, birth_date, joined_at, platform,
                last_seen_at, last_login_at,
                (last_seen_at > now() - interval '5 minutes') AS online
         FROM profiles
         ORDER BY (last_seen_at > now() - interval '5 minutes') DESC,
                  last_seen_at DESC NULLS LAST,
                  joined_at DESC NULLS LAST,
                  created_at DESC`
      );
      return res.json({ status: 'success', profiles: rows.rows });
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
      let totalBerhasil = 0, totalGagal = 0;
      let controlPoint = 0;
      const freqAll = {};
      
      const now = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
      const todayStr = now.toISOString().substring(0, 10);
      const currentDay = now.getDay();
      const sundayDate = new Date(now);
      sundayDate.setDate(now.getDate() - currentDay);
      
      const daysStr = [], chartLabels = [];
      const hariNames = ['Mgg', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      for (let d = 0; d < 7; d++) {
        const dt = new Date(sundayDate);
        dt.setDate(sundayDate.getDate() + d);
        daysStr.push(dt.toISOString().substring(0, 10));
        const dd = String(dt.getDate()).padStart(2, '0');
        const mm = String(dt.getMonth() + 1).padStart(2, '0');
        chartLabels.push([`${dd}/${mm}`, hariNames[d]]);
      }
      
      const positifArray = [0, 0, 0, 0, 0, 0, 0], negatifArray = [0, 0, 0, 0, 0, 0, 0];

      battles.rows.forEach(b => {
        const ts = toWIBDate(b.timestamp);
        const type = String(b.type || '');
        const outcome = parseInt(b.outcome) || 0;
        const note = String(b.note || '');
        let kategori = String(b.kategori || 'Lainnya').trim();
        
        const isBerhasil = outcome >= 3;
        
        allBattles.push({ ts: ts.substring(0, 16), type, outcome, note, kategori });
        
        if (isBerhasil) {
          totalBerhasil++;
          controlPoint++;
        } else {
          totalGagal++;
        }
        
        freqAll[type] = (freqAll[type] || 0) + 1;
        
        const rowDate = ts.substring(0, 10);
        const idx = daysStr.indexOf(rowDate);
        if (idx !== -1) {
          if (isBerhasil) positifArray[idx]++;
          else negatifArray[idx]++;
        }
      });

      const totalLog = battles.rows.length;
      const consistencyPoint = totalLog;
      const successRate = totalLog > 0 ? Math.round((totalBerhasil / totalLog) * 100) : 0;
      
      const sortedAll = Object.keys(freqAll).sort((a,b) => freqAll[b] - freqAll[a]);
      
      const top3Labels = [], top3Data = [], top3Kategori = [];
      for (let f = 0; f < Math.min(3, sortedAll.length); f++) {
        const key = sortedAll[f];
        top3Labels.push(key);
        top3Data.push(freqAll[key]);
        top3Kategori.push('Positif');
      }

      const allScreenTimes = [];
      let totalScreen = 0;
      screentimes.rows.forEach(s => {
        totalScreen += parseFloat(s.total_duration) || 0;
        allScreenTimes.push({
          date: toWIBDate(s.timestamp).substring(0, 10), total: s.total_duration,
          a1: s.app1, d1: s.dur1 || 0, a2: s.app2, d2: s.dur2 || 0, a3: s.app3, d3: s.dur3 || 0
        });
      });
      const avgScreen = screentimes.rows.length > 0 ? (totalScreen / screentimes.rows.length).toFixed(1) : 0;

      const allDebriefs = debriefs.rows.map(d => ({
        date: toWIBDate(d.timestamp).substring(0, 10), mood: d.mood, energy: d.energy, lesson: d.lesson, fix: d.fix
      }));

      let todayBrainDumpText = "";
      const pastBrainDumps = [];
      braindumps.rows.forEach(b => {
        const ts = toWIBDate(b.timestamp);
        if (ts.substring(0, 10) === todayStr) todayBrainDumpText = b.content;
        else pastBrainDumps.push({ date: ts.substring(0, 10), text: b.content });
      });

      return res.json({
        status: 'success',
        summary: { controlPoint, consistencyPoint, totalBerhasil, totalGagal, successRate, mostFrequent: sortedAll[0] || null, avgScreen },
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
        await webpush.sendNotification(pushSub, payload, {
          urgency: 'high',
          TTL: 28800
        });
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
