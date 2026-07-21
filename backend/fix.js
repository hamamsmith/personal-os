const { Pool } = require('pg'); 
require('dotenv').config(); 
const pool = new Pool({ connectionString: process.env.DATABASE_URL }); 
const pos = ['🏃‍♂️ Jogging','📚 Belajar','🚿 Mandi Pagi','🛀 Mandi Sore/Malam','📖 Ngaji','🕌 Solat 5 Waktu','💻 Fokus Kerja','🎯 Menyelesaikan Target','🙏 Bersyukur','😴 Tidur Tepat Waktu']; 
pool.query('UPDATE battles SET kategori = $1 WHERE type = ANY($2)', ['Positif', pos]).then(res => { console.log('Update selesai:', res.rowCount); pool.end(); }).catch(e => console.error(e));
