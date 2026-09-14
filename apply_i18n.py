import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

replacements = {
    r'<span>Home</span>': r'<span data-i18n="nav_home">Home</span>',
    r'<span>Control</span>': r'<span data-i18n="nav_control">Control</span>',
    r'<span>Dump</span>': r'<span data-i18n="nav_dump">Dump</span>',
    r'<span>Debrief</span>': r'<span data-i18n="nav_debrief">Debrief</span>',
    r'<span>Screen</span>': r'<span data-i18n="nav_screen">Screen</span>',
    r'<span>Weekly</span>': r'<span data-i18n="nav_weekly">Weekly</span>',
    r'<span>Logout</span>': r'<span data-i18n="nav_logout">Logout</span>',
    r'id="topbar-title"(.*?)>Dashboard.</div>': r'id="topbar-title"\1 data-i18n="dashboard_title">Dashboard.</div>',
    
    r'<div class="label">🟢 Self Control</div>': r'<div class="label" data-i18n="lbl_self_control">🟢 Self Control</div>',
    r'0 Berhasil \| 0 Gagal': r'<span data-i18n="lbl_win_lose">0 Win | 0 Lose</span>',
    r'<div class="label">🔵 Konsistensi</div>': r'<div class="label" data-i18n="lbl_consistency">🔵 Consistency</div>',
    r'Total Log': r'<span data-i18n="lbl_total_log">Total Logs</span>',
    r'<div class="label">📊 Success Rate</div>': r'<div class="label" data-i18n="lbl_success_rate">📊 Success Rate</div>',
    r'<div class="label">📱 Avg Screen</div>': r'<div class="label" data-i18n="lbl_avg_screen">📱 Avg Screen</div>',
    
    r'>1 Minggu</option>': r' data-i18n="opt_1week">1 Week</option>',
    r'>1 Bulan</option>': r' data-i18n="opt_1month">1 Month</option>',
    r'>Semua</option>': r' data-i18n="opt_all">All Time</option>',
    r'>SEMUA WAKTU</option>': r' data-i18n="opt_all">All Time</option>',
    r'>1 MINGGU</option>': r' data-i18n="opt_1week">1 Week</option>',
    r'>1 BULAN</option>': r' data-i18n="opt_1month">1 Month</option>',
    
    r'⚡ TRIGGER PALING SERING': r'<span data-i18n="lbl_freq_trigger">⚡ MOST FREQUENT TRIGGER</span>',
    r'🎯 SUCCESS RATE': r'<span data-i18n="lbl_rate_small">🎯 SUCCESS RATE</span>',
    
    r'✅ Berhasil vs ❌ Gagal': r'<span data-i18n="lbl_win_vs_lose">✅ Win vs ❌ Lose</span>',
    r'Trigger Paling Sering': r'<span data-i18n="lbl_freq_trigger_chart">Most Frequent Triggers</span>',
    
    r'<h3>Hari Ini</h3>': r'<h3 data-i18n="lbl_today">Today</h3>',
    r'\+ Tambah</button>': r'+ Add</button>',
    r'onclick="openBattleModal\(\)">\+ Add': r'data-i18n="btn_add" onclick="openBattleModal()">+ Add',
    r'Riwayat Hari Sebelumnya': r'<span data-i18n="lbl_prev_history">Previous History</span>',
    r'Belum ada catatan battle sebelumnya.': r'<span data-i18n="empty_battle">No battle records yet.</span>',
    
    r'<label>Kosongkan Pikiran</label>': r'<label data-i18n="lbl_empty_mind">Clear Your Mind</label>',
    r'Tulis apapun yang membebani pikiran lu sekarang biar otak plong.': r'<span data-i18n="desc_empty_mind">Write down whatever is bothering you to clear your head.</span>',
    r'placeholder="Gua ngerasa\.\.\. / Gua kepikiran soal\.\.\."': r'placeholder="I feel... / I\'m thinking about..." data-i18n="ph_dump"',
    r'LEPASKAN PIKIRAN</button>': r'RELEASE THOUGHTS</button>',
    r'onclick="submitBrainDump\(\)">RELEASE THOUGHTS': r'data-i18n="btn_release" onclick="submitBrainDump()">RELEASE THOUGHTS',
    r'Belum ada catatan di hari-hari sebelumnya.': r'<span data-i18n="empty_dump">No brain dump records yet.</span>',
    
    r'<label>Tanggal \(hari ini atau kemarin\)</label>': r'<label data-i18n="lbl_date">Date (Today or Yesterday)</label>',
    r'<label>Mood secara umum\?</label>': r'<label data-i18n="lbl_mood">General Mood?</label>',
    r'<label>Level Energi \(1-5\)</label>': r'<label data-i18n="lbl_energy">Energy Level (1-5)</label>',
    
    r'Seberapa bertenaga lu hari ini\?': r'How energetic are you today?',
    r'1 - Habis Total 🪫': r'1 - Completely Drained 🪫',
    r'2 - Low Battery 🔋': r'2 - Low Battery 🔋',
    r'3 - Cukup 🔋': r'3 - Sufficient 🔋',
    r'4 - Semangat 🙂': r'4 - Energetic 🙂',
    r'5 - On Fire ⚡': r'5 - On Fire ⚡',
    
    r'<option value="" disabled selected>How energetic are you today\?</option>': r'<option value="" disabled selected data-i18n="opt_energy_default">How energetic are you today?</option>',
    r'<option value="1">1 - Completely Drained 🪫</option>': r'<option value="1" data-i18n="opt_energy_1">1 - Completely Drained 🪫</option>',
    r'<option value="2">2 - Low Battery 🔋</option>': r'<option value="2" data-i18n="opt_energy_2">2 - Low Battery 🔋</option>',
    r'<option value="3">3 - Sufficient 🔋</option>': r'<option value="3" data-i18n="opt_energy_3">3 - Sufficient 🔋</option>',
    r'<option value="4">4 - Energetic 🙂</option>': r'<option value="4" data-i18n="opt_energy_4">4 - Energetic 🙂</option>',
    r'<option value="5">5 - On Fire ⚡</option>': r'<option value="5" data-i18n="opt_energy_5">5 - On Fire ⚡</option>',
    
    r'<label>Satu pelajaran penting hari ini</label>': r'<label data-i18n="lbl_lesson">One important lesson today</label>',
    r'placeholder="Apa yang lu sadari hari ini\?"': r'placeholder="What did you realize today?" data-i18n="ph_lesson"',
    r'<label>Apa yang perlu diperbaiki besok\?</label>': r'<label data-i18n="lbl_improve">What to improve tomorrow?</label>',
    r'placeholder="Target perbaikan besok\.\.\."': r'placeholder="Target for tomorrow..." data-i18n="ph_improve"',
    r'SELESAIKAN HARI</button>': r'FINISH DAY</button>',
    r'id="btnSelesaiHari" onclick="submitDebrief\(\)">FINISH DAY': r'id="btnSelesaiHari" data-i18n="btn_finish_day" onclick="submitDebrief()">FINISH DAY',
    r'Belum ada debrief sebelumnya.': r'<span data-i18n="empty_debrief">No debrief records yet.</span>',
    
    r'Catat durasi layar lu hari ini agar tetap sadar \(mindful\) sama waktu yang dihabiskan di depan layar.': r'<span data-i18n="desc_screen">Log your screen time today to stay mindful of your digital consumption.</span>',
    r'<label>Tanggal \(isi hari ini atau kemarin\)</label>': r'<label data-i18n="lbl_date">Date (Today or Yesterday)</label>',
    r'<label>Total Durasi Layar</label>': r'<label data-i18n="lbl_total_duration">Total Duration</label>',
    r'<label style="margin-top:20px;">Top 3 Aplikasi Terlama</label>': r'<label style="margin-top:20px;" data-i18n="lbl_top_apps">Top 3 Most Used Apps</label>',
    r'placeholder="[123]\. Nama App"': r'placeholder="App Name" data-i18n="ph_app_name"',
    r'SIMPAN SCREEN TIME</button>': r'SAVE SCREEN TIME</button>',
    r'id="btnSimpanScreen" style="margin-top: 20px;" onclick="submitScreenTime\(\)">SAVE SCREEN TIME': r'id="btnSimpanScreen" style="margin-top: 20px;" data-i18n="btn_save_screen" onclick="submitScreenTime()">SAVE SCREEN TIME',
    r'Belum ada catatan screen time sebelumnya.': r'<span data-i18n="empty_screen">No screen time records yet.</span>',
}

for k, v in replacements.items():
    content = re.sub(k, v, content)

# Inject i18n script
if 'js/i18n.js' not in content:
    content = content.replace('    <script src="js/app.js"></script>', '    <script src="js/i18n.js"></script>\n    <script src="js/app.js"></script>')

# Add toggle button in topbar
toggle_html = r'<div id="langToggleBtn" onclick="toggleLanguage()" style="cursor:pointer; font-weight:700; color:var(--text-muted); margin-left: auto; margin-right: 20px; font-size: 14px; background: rgba(255,255,255,0.05); padding: 5px 10px; border-radius: 8px; border: 1px solid var(--glass-border);">EN</div>'
if 'id="langToggleBtn"' not in content:
    content = content.replace('</header>', f'    {toggle_html}\n    </header>')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)
print("i18n applied")
