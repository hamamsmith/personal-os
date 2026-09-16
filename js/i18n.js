const translations = {
    en: {
        "nav_home": "Home",
        "nav_control": "Control",
        "nav_dump": "Dump",
        "nav_debrief": "Debrief",
        "nav_screen": "Screen",
        "nav_weekly": "Weekly",
        "nav_logout": "Logout",
        "dashboard_title": "Dashboard.",
        "control_title": "Take Control.",
        "dump_title": "Brain Dump.",
        "debrief_title": "Daily Debrief.",
        "screen_title": "Screen Time.",
        "weekly_title": "Weekly Review.",
        "landing_title": "Elevate Your Routine.",
        "landing_subtitle": "A professional, distraction-free environment to track habits, take control, and debrief your life.",

        "feat_track_title": "Track Habits",
        "feat_track_desc": "Build consistency with a visually rewarding tracker.",
        "feat_control_title": "Take Control",
        "feat_control_desc": "Log your daily triggers, wins, and losses to master your behavior.",
        "feat_dump_title": "Brain Dump",
        "feat_dump_desc": "Instantly clear your mind and declutter your thoughts.",
        "feat_review_title": "Weekly Debrief",
        "feat_review_desc": "Reflect on your progress and plan your next strategic move.",
        "footer_tagline": "Designed for focus.",

        "footer_privacy": "Privacy Policy",
        "footer_terms": "Terms & Conditions",

        "privacy_h1": "1. Data Ownership & Storage",
        "privacy_p1": "Personal OS is built with a privacy-first approach. All of your data—including your habits, daily triggers, battle logs, and brain dumps—is stored <strong>locally on your own device</strong> using your browser's LocalStorage. We do not use external databases, and we do not transmit your personal data to any servers.",
        "privacy_h2": "2. Data Collection",
        "privacy_p2": "Because Personal OS operates entirely within your browser, we do not collect, harvest, or process any personal identifiable information (PII). You do not need to create an account or provide an email address to use this service.",
        "privacy_h3": "3. Cookies and Tracking",
        "privacy_p3": "We do not use any third-party tracking cookies or analytics software (like Google Analytics) that monitor your behavior. The only data stored in your browser is the data required to make the application function (your habits and preferences).",
        "privacy_h4": "4. Data Security",
        "privacy_p4": "Since your data is stored locally on your device, the security of your data depends on the security of your own device. We recommend locking your device with a passcode and avoiding the use of Personal OS on public or shared computers where others might access your LocalStorage data.",
        "terms_h1": "1. Acceptance of Terms",
        "terms_p1": "By accessing and using Personal OS, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this application.",
        "terms_h2": "2. Use of the Application",
        "terms_p2": "Personal OS is provided as a productivity tool designed for personal use. You agree to use it only for its intended purposes and in a way that does not infringe upon the rights of, restrict, or inhibit anyone else's use and enjoyment of the application.",
        "terms_h3": "3. Disclaimer of Warranties",
        "terms_p3": "This application is provided \"as is\" and \"as available\" without any representations or warranties, express or implied. Personal OS makes no representations or warranties in relation to this application or the information and materials provided. Your use of the application is entirely at your own risk.",
        "terms_h4": "4. Data Loss",
        "terms_p4": "Because Personal OS stores all data locally in your browser, <strong>clearing your browser data, cache, or local storage will result in the permanent loss of your data.</strong> Personal OS is not responsible for any data loss, and it is your responsibility to manually export or back up your data if you wish to keep it secure.",
        "btn_enter": "ENTER SYSTEM",
        "login_secured": "Secured Access Interface",
        "btn_access": "ACCESS OS",
        "toast_success": "✅ Data saved successfully!",
        "lbl_self_control": "🟢 Self Control",
        "lbl_win_lose": "Win | Lose",
        "lbl_consistency": "🔵 Consistency",
        "lbl_total_log": "Total Logs",
        "lbl_success_rate": "📊 Success Rate",
        "lbl_avg_screen": "📱 Avg Screen",
        "opt_1week": "1 Week",
        "opt_1month": "1 Month",
        "opt_all": "All Time",
        "lbl_freq_trigger": "⚡ MOST FREQUENT TRIGGER",
        "lbl_rate_small": "🎯 SUCCESS RATE",
        "lbl_win_vs_lose": "✅ Win vs ❌ Lose",
        "loading": "Loading...",
        "lbl_freq_trigger_chart": "Most Frequent Triggers",
        "lbl_today": "Today",
        "btn_add": "+ Add",
        "lbl_prev_history": "Previous History",
        "empty_battle": "No battle records yet.",
        "lbl_empty_mind": "Clear Your Mind",
        "desc_empty_mind": "Write down whatever is bothering you to clear your head.",
        "ph_dump": "I feel... / I'm thinking about...",
        "btn_release": "RELEASE THOUGHTS",
        "empty_dump": "No brain dump records yet.",
        "lbl_date": "Date (Today or Yesterday)",
        "lbl_mood": "General Mood?",
        "lbl_energy": "Energy Level (1-5)",
        "opt_energy_default": "How energetic are you today?",
        "opt_energy_1": "1 - Completely Drained 🪫",
        "opt_energy_2": "2 - Low Battery 🔋",
        "opt_energy_3": "3 - Sufficient 🔋",
        "opt_energy_4": "4 - Energetic 🙂",
        "opt_energy_5": "5 - On Fire ⚡",
        "lbl_lesson": "One important lesson today",
        "ph_lesson": "What did you realize today?",
        "lbl_improve": "What to improve tomorrow?",
        "ph_improve": "Target for tomorrow...",
        "btn_finish_day": "FINISH DAY",
        "empty_debrief": "No debrief records yet.",
        "desc_screen": "Log your screen time today to stay mindful of your digital consumption.",
        "lbl_total_duration": "Total Duration",
        "lbl_top_apps": "Top 3 Most Used Apps",
        "ph_app_name": "App Name",
        "btn_save_screen": "SAVE SCREEN TIME",
        "empty_screen": "No screen time records yet.",
        "lbl_review_week": "Review of the Week",
        "desc_weekly": "Evaluate your week. Look for patterns in what works and what fails.",
        "lbl_week_date": "Date (End of Week)",
        "lbl_week_score": "Overall Score (1-10)",
        "opt_score_default": "How would you rate this week?",
        "lbl_wins": "Biggest Wins",
        "ph_wins": "What went well?",
        "lbl_fails": "Biggest Failures/Distractions",
        "ph_fails": "What went wrong?",
        "lbl_next_action": "Action Plan for Next Week",
        "ph_next_action": "Next week I will...",
        "btn_save_weekly": "SAVE WEEKLY REVIEW",
        "empty_weekly": "No weekly review records yet.",
        "lang_toggle": "EN / ID",

        "modal_battle_title": "Take Control",
        "lbl_battle_date": "1. Date (Today/Yesterday)",
        "lbl_battle_trigger": "2. Select Trigger",
        "opt_battle_trigger_default": "Select trigger...",
        "ph_battle_custom_trigger": "Type your trigger here...",
        "lbl_battle_outcome": "3. Outcome",
        "lbl_battle_win": "✅ Win",
        "lbl_battle_lose": "❌ Lose",
        "lbl_battle_note": "4. Notes (Optional)",
        "ph_battle_note": "Write brief context...",
        "btn_save": "SAVE",
    },
    id: {
        "nav_home": "Utama",
        "nav_control": "Kendali",
        "nav_dump": "Pikiran",
        "nav_debrief": "Evaluasi",
        "nav_screen": "Layar",
        "nav_weekly": "Mingguan",
        "nav_logout": "Keluar",
        "dashboard_title": "Dasbor.",
        "control_title": "Ambil Kendali.",
        "dump_title": "Kosongkan Pikiran.",
        "debrief_title": "Evaluasi Harian.",
        "screen_title": "Waktu Layar.",
        "weekly_title": "Tinjauan Mingguan.",
        "landing_title": "Tingkatkan Rutinitas.",
        "landing_subtitle": "Lingkungan profesional bebas gangguan untuk melacak kebiasaan, mengambil kendali, dan mengevaluasi hidup lu.",
        "btn_enter": "MASUK SISTEM",
        "login_secured": "Antarmuka Akses Aman",
        "btn_access": "AKSES OS",
        "toast_success": "✅ Data berhasil disimpan!",
        "lbl_self_control": "🟢 Kendali Diri",
        "lbl_win_lose": "Berhasil | Gagal",
        "lbl_consistency": "🔵 Konsistensi",
        "lbl_total_log": "Total Catatan",
        "lbl_success_rate": "📊 Tingkat Sukses",
        "lbl_avg_screen": "📱 Rata-rata Layar",
        "opt_1week": "1 Minggu",
        "opt_1month": "1 Bulan",
        "opt_all": "Semua",
        "lbl_freq_trigger": "⚡ TRIGGER PALING SERING",
        "lbl_rate_small": "🎯 TINGKAT SUKSES",
        "lbl_win_vs_lose": "✅ Berhasil vs ❌ Gagal",
        "loading": "Memuat...",
        "lbl_freq_trigger_chart": "Trigger Paling Sering",
        "lbl_today": "Hari Ini",
        "btn_add": "+ Tambah",
        "lbl_prev_history": "Riwayat Sebelumnya",
        "empty_battle": "Belum ada catatan battle.",
        "lbl_empty_mind": "Kosongkan Pikiran",
        "desc_empty_mind": "Tulis apapun yang membebani pikiran lu sekarang biar otak plong.",
        "ph_dump": "Gua ngerasa... / Gua kepikiran soal...",
        "btn_release": "LEPASKAN PIKIRAN",
        "empty_dump": "Belum ada catatan sebelumnya.",
        "lbl_date": "Tanggal (hari ini atau kemarin)",
        "lbl_mood": "Mood secara umum?",
        "lbl_energy": "Level Energi (1-5)",
        "opt_energy_default": "Seberapa bertenaga lu hari ini?",
        "opt_energy_1": "1 - Habis Total 🪫",
        "opt_energy_2": "2 - Low Battery 🔋",
        "opt_energy_3": "3 - Cukup 🔋",
        "opt_energy_4": "4 - Semangat 🙂",
        "opt_energy_5": "5 - On Fire ⚡",
        "lbl_lesson": "Satu pelajaran penting hari ini",
        "ph_lesson": "Apa yang lu sadari hari ini?",
        "lbl_improve": "Apa yang perlu diperbaiki besok?",
        "ph_improve": "Target perbaikan besok...",
        "btn_finish_day": "SELESAIKAN HARI",
        "empty_debrief": "Belum ada debrief sebelumnya.",
        "desc_screen": "Catat durasi layar lu hari ini agar tetap sadar (mindful) sama waktu yang dihabiskan di depan layar.",
        "lbl_total_duration": "Total Durasi Layar",
        "lbl_top_apps": "Top 3 Aplikasi Terlama",
        "ph_app_name": "Nama App",
        "btn_save_screen": "SIMPAN SCREEN TIME",
        "empty_screen": "Belum ada catatan screen time sebelumnya.",
        "lbl_review_week": "Tinjauan Minggu Ini",
        "desc_weekly": "Evaluasi seminggu ke belakang. Cari pola mana yang berhasil dan mana yang gagal.",
        "lbl_week_date": "Tanggal (Akhir Minggu)",
        "lbl_week_score": "Skor Keseluruhan (1-10)",
        "opt_score_default": "Seberapa puas lu dengan minggu ini?",
        "lbl_wins": "Kemenangan Terbesar",
        "ph_wins": "Apa yang berjalan lancar?",
        "lbl_fails": "Kegagalan/Gangguan Terbesar",
        "ph_fails": "Apa yang bikin kacau?",
        "lbl_next_action": "Action Plan Minggu Depan",
        "ph_next_action": "Minggu depan gua bakal...",
        "btn_save_weekly": "SIMPAN WEEKLY REVIEW",
        "empty_weekly": "Belum ada catatan mingguan sebelumnya.",
        "lang_toggle": "ID / EN",

        "modal_battle_title": "Ambil Kendali",
        "lbl_battle_date": "1. Tanggal (Hari ini/Kemarin)",
        "lbl_battle_trigger": "2. Pilih Trigger",
        "opt_battle_trigger_default": "Pilih trigger...",
        "ph_battle_custom_trigger": "Ketik trigger lu di sini...",
        "lbl_battle_outcome": "3. Hasil",
        "lbl_battle_win": "✅ Berhasil",
        "lbl_battle_lose": "❌ Gagal",
        "lbl_battle_note": "4. Catatan (Opsional)",
        "ph_battle_note": "Tulis konteks singkat...",
        "btn_save": "SIMPAN",
    }
};

function setLanguage(lang) {
    try { localStorage.setItem('lang', lang); } catch(e) {}
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else if (el.tagName === 'OPTION') {
                el.innerText = translations[lang][key];
            } else {
                // If it contains HTML inside, we might need to handle it carefully, but mostly it's innerText
                // except for nav-icon which is inside a span. Wait, we should target the text span specifically.
                el.innerText = translations[lang][key];
            }
        }
    });

    const toggleBtn = document.getElementById('langToggleBtn');
    if (toggleBtn) {
        toggleBtn.innerText = lang === 'en' ? 'EN' : 'ID';
    }
    
    const landingToggleBtn = document.getElementById('landingLangToggleBtn');
    if (landingToggleBtn) {
        landingToggleBtn.innerText = lang === 'en' ? 'EN' : 'ID';
    }
}

function toggleLanguage() {
    let currentLang = 'en';
    try { currentLang = localStorage.getItem('lang') || 'en'; } catch(e) {}
    const newLang = currentLang === 'en' ? 'id' : 'en';
    setLanguage(newLang);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('lang') || 'en';
    setLanguage(savedLang);
});
