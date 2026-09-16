import json
import re

# 1. Update i18n.js
with open('js/i18n.js', 'r', encoding='utf-8') as f:
    i18n_content = f.read()

en_keys = """
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
        "terms_p3": "This application is provided \\"as is\\" and \\"as available\\" without any representations or warranties, express or implied. Personal OS makes no representations or warranties in relation to this application or the information and materials provided. Your use of the application is entirely at your own risk.",
        "terms_h4": "4. Data Loss",
        "terms_p4": "Because Personal OS stores all data locally in your browser, <strong>clearing your browser data, cache, or local storage will result in the permanent loss of your data.</strong> Personal OS is not responsible for any data loss, and it is your responsibility to manually export or back up your data if you wish to keep it secure.",
"""

id_keys = """
        "privacy_h1": "1. Kepemilikan & Penyimpanan Data",
        "privacy_p1": "Personal OS dibangun dengan pendekatan yang mengutamakan privasi. Seluruh data lu—termasuk habit, trigger harian, riwayat battle, dan brain dump—disimpan <strong>secara lokal di perangkat lu sendiri</strong> menggunakan LocalStorage browser. Kami tidak menggunakan database eksternal dan tidak mengirimkan data pribadi lu ke server manapun.",
        "privacy_h2": "2. Pengumpulan Data",
        "privacy_p2": "Karena Personal OS berjalan sepenuhnya di dalam browser lu, kami tidak mengumpulkan, mengambil, atau memproses Informasi Identitas Pribadi (PII) apapun. Lu tidak perlu membuat akun atau memberikan alamat email untuk menggunakan layanan ini.",
        "privacy_h3": "3. Cookies dan Pelacakan",
        "privacy_p3": "Kami tidak menggunakan cookies pelacakan pihak ketiga atau perangkat lunak analitik (seperti Google Analytics) yang memantau perilaku lu. Satu-satunya data yang disimpan di browser lu adalah data yang diperlukan agar aplikasi dapat berfungsi (habit dan pengaturan lu).",
        "privacy_h4": "4. Keamanan Data",
        "privacy_p4": "Karena data lu disimpan secara lokal di perangkat, keamanan data sangat bergantung pada keamanan perangkat lu sendiri. Kami menyarankan untuk mengunci perangkat lu dengan password dan menghindari penggunaan Personal OS di komputer umum atau bersama di mana orang lain bisa mengakses data LocalStorage lu.",
        "terms_h1": "1. Penerimaan Syarat",
        "terms_p1": "Dengan mengakses dan menggunakan Personal OS, lu menerima dan setuju untuk terikat dengan syarat dan ketentuan perjanjian ini. Kalau lu gak setuju dengan aturan ini, tolong jangan gunakan aplikasi ini.",
        "terms_h2": "2. Penggunaan Aplikasi",
        "terms_p2": "Personal OS disediakan sebagai alat produktivitas yang dirancang untuk penggunaan pribadi. Lu setuju untuk menggunakannya hanya untuk tujuan yang semestinya dan dengan cara yang tidak melanggar hak, membatasi, atau menghalangi orang lain menggunakan dan menikmati aplikasi ini.",
        "terms_h3": "3. Penafian Garansi",
        "terms_p3": "Aplikasi ini disediakan \\"apa adanya\\" dan \\"sebagaimana tersedia\\" tanpa representasi atau jaminan apapun, baik tersurat maupun tersirat. Personal OS tidak memberikan representasi atau jaminan terkait aplikasi ini atau informasi dan materi yang disediakan. Penggunaan aplikasi ini sepenuhnya merupakan risiko lu sendiri.",
        "terms_h4": "4. Kehilangan Data",
        "terms_p4": "Karena Personal OS menyimpan semua data secara lokal di browser, <strong>membersihkan data browser, cache, atau local storage lu bakal berakibat hilangnya data secara permanen.</strong> Personal OS tidak bertanggung jawab atas kehilangan data apapun, dan merupakan tanggung jawab lu sendiri untuk mengekspor atau membackup data secara manual kalau lu mau menjaganya tetap aman.",
"""

# Insert into i18n
i18n_content = re.sub(r'("footer_terms": "Terms & Conditions",\s*\n)', r'\1' + en_keys, i18n_content)
i18n_content = re.sub(r'("footer_terms": "Syarat & Ketentuan",\s*\n)', r'\1' + id_keys, i18n_content)

with open('js/i18n.js', 'w', encoding='utf-8') as f:
    f.write(i18n_content)


# 2. Update legalModals.html
html = """<!-- PRIVACY MODAL -->
<div class="modal-overlay" id="privacyModal" onclick="if(event.target===this)closePrivacyModal()">
    <div class="modal-content" style="max-width: 700px; max-height: 80vh; overflow-y: auto; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin-bottom: 0; color: var(--brand); font-size: 24px;" data-i18n="footer_privacy">Privacy Policy</h3>
            <span onclick="closePrivacyModal()" style="cursor:pointer; font-size: 24px; color: var(--text-muted); line-height: 1;">&times;</span>
        </div>
        
        <h4 style="color: #fff; margin-top: 20px; margin-bottom: 10px;" data-i18n="privacy_h1">1. Data Ownership & Storage</h4>
        <p style="color: var(--text-muted); font-size: 15px; line-height: 1.6; margin-bottom: 15px;" data-i18n="privacy_p1"></p>
        
        <h4 style="color: #fff; margin-top: 20px; margin-bottom: 10px;" data-i18n="privacy_h2">2. Data Collection</h4>
        <p style="color: var(--text-muted); font-size: 15px; line-height: 1.6; margin-bottom: 15px;" data-i18n="privacy_p2"></p>

        <h4 style="color: #fff; margin-top: 20px; margin-bottom: 10px;" data-i18n="privacy_h3">3. Cookies and Tracking</h4>
        <p style="color: var(--text-muted); font-size: 15px; line-height: 1.6; margin-bottom: 15px;" data-i18n="privacy_p3"></p>

        <h4 style="color: #fff; margin-top: 20px; margin-bottom: 10px;" data-i18n="privacy_h4">4. Data Security</h4>
        <p style="color: var(--text-muted); font-size: 15px; line-height: 1.6; margin-bottom: 15px;" data-i18n="privacy_p4"></p>
    </div>
</div>

<!-- TERMS MODAL -->
<div class="modal-overlay" id="termsModal" onclick="if(event.target===this)closeTermsModal()">
    <div class="modal-content" style="max-width: 700px; max-height: 80vh; overflow-y: auto; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin-bottom: 0; color: var(--brand); font-size: 24px;" data-i18n="footer_terms">Terms & Conditions</h3>
            <span onclick="closeTermsModal()" style="cursor:pointer; font-size: 24px; color: var(--text-muted); line-height: 1;">&times;</span>
        </div>
        
        <h4 style="color: #fff; margin-top: 20px; margin-bottom: 10px;" data-i18n="terms_h1">1. Acceptance of Terms</h4>
        <p style="color: var(--text-muted); font-size: 15px; line-height: 1.6; margin-bottom: 15px;" data-i18n="terms_p1"></p>
        
        <h4 style="color: #fff; margin-top: 20px; margin-bottom: 10px;" data-i18n="terms_h2">2. Use of the Application</h4>
        <p style="color: var(--text-muted); font-size: 15px; line-height: 1.6; margin-bottom: 15px;" data-i18n="terms_p2"></p>

        <h4 style="color: #fff; margin-top: 20px; margin-bottom: 10px;" data-i18n="terms_h3">3. Disclaimer of Warranties</h4>
        <p style="color: var(--text-muted); font-size: 15px; line-height: 1.6; margin-bottom: 15px;" data-i18n="terms_p3"></p>

        <h4 style="color: #fff; margin-top: 20px; margin-bottom: 10px;" data-i18n="terms_h4">4. Data Loss</h4>
        <p style="color: var(--text-muted); font-size: 15px; line-height: 1.6; margin-bottom: 15px;" data-i18n="terms_p4"></p>
    </div>
</div>
"""
with open('pages/legalModals.html', 'w', encoding='utf-8') as f:
    f.write(html)
    
print("Updated i18n and legalModals!")
