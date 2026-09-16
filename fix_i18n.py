import re

with open('js/i18n.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Fix innerText to innerHTML
js = js.replace('el.innerText = translations[lang][key];', 'el.innerHTML = translations[lang][key];')

# Define the ID translation
id_legal_translation = """
        "footer_privacy": "Kebijakan Privasi",
        "footer_terms": "Syarat & Ketentuan",
        "privacy_h1": "1. Kepemilikan & Penyimpanan Data",
        "privacy_p1": "Personal OS dibangun dengan pendekatan yang mengutamakan privasi. Seluruh data lu—termasuk kebiasaan, pemicu harian, riwayat aktivitas, dan catatan pikiran—disimpan <strong>secara lokal di perangkat lu sendiri</strong> menggunakan LocalStorage browser. Kami tidak menggunakan database eksternal, dan kami tidak mengirimkan data pribadi lu ke server mana pun.",
        "privacy_h2": "2. Pengumpulan Data",
        "privacy_p2": "Karena Personal OS beroperasi sepenuhnya di dalam browser lu, kami tidak mengumpulkan, mengambil, atau memproses informasi identitas pribadi (PII) apa pun. Lu gak perlu bikin akun atau ngasih alamat email buat pake layanan ini.",
        "privacy_h3": "3. Cookie dan Pelacakan",
        "privacy_p3": "Kami gak pake cookie pelacakan pihak ketiga atau perangkat lunak analitik (kayak Google Analytics) yang mantau perilaku lu. Satu-satunya data yang disimpan di browser lu adalah data yang dibutuhin biar aplikasinya jalan (kebiasaan dan pengaturan lu).",
        "privacy_h4": "4. Keamanan Data",
        "privacy_p4": "Karena data lu disimpan secara lokal di perangkat, keamanan data lu bergantung pada keamanan perangkat lu sendiri. Kami saranin buat ngunci perangkat lu pake kata sandi dan hindari pake Personal OS di komputer umum atau bersama di mana orang lain mungkin bisa ngakses data LocalStorage lu.",
        "terms_h1": "1. Penerimaan Syarat",
        "terms_p1": "Dengan ngakses dan make Personal OS, lu nerima dan setuju buat keiket sama syarat dan ketentuan perjanjian ini. Kalau lu gak setuju buat patuh sama syarat-syarat ini, tolong jangan pake aplikasi ini.",
        "terms_h2": "2. Penggunaan Aplikasi",
        "terms_p2": "Personal OS disediain sebagai alat produktivitas yang dirancang buat pemakaian pribadi. Lu setuju buat make ini cuma buat tujuan yang semestinya dan dengan cara yang gak ngelanggar hak, ngebatesin, atau ngehambat orang lain buat make dan nikmatin aplikasi ini.",
        "terms_h3": "3. Penafian Jaminan",
        "terms_p3": "Aplikasi ini disediain \\"apa adanya\\" dan \\"sebagaimana tersedia\\" tanpa pernyataan atau jaminan apa pun, baik tersurat maupun tersirat. Personal OS gak ngasih pernyataan atau jaminan sehubungan sama aplikasi ini atau informasi dan materi yang disediain. Risiko make aplikasi ini sepenuhnya ada di tangan lu.",
        "terms_h4": "4. Kehilangan Data",
        "terms_p4": "Karena Personal OS nyimpen semua data secara lokal di browser lu, <strong>ngapus data browser, cache, atau penyimpanan lokal bakal bikin data lu hilang permanen.</strong> Personal OS gak bertanggung jawab atas kehilangan data apa pun, dan itu tanggung jawab lu buat ngekspor atau nyadangin data lu secara manual kalau lu pengen data tetep aman.",
        "btn_enter": "MASUK SISTEM",
"""

# Insert into ID section
js = re.sub(r'(\s*"btn_enter": "MASUK SISTEM",)', id_legal_translation, js, count=1)

# Fix mangled English keys
js = js.replace('All of your data?"including your habits, \ndaily triggers, battle logs, and brain dumps?"is', 'All of your data—including your habits, daily triggers, battle logs, and brain dumps—is')
js = js.replace('All of your data?"including your habits,\r\ndaily triggers, battle logs, and brain dumps?"is', 'All of your data—including your habits, daily triggers, battle logs, and brain dumps—is')
js = js.replace('All of your data?"including your habits, daily triggers, battle logs, and brain dumps?"is', 'All of your data—including your habits, daily triggers, battle logs, and brain dumps—is')

# There might also be mangled text in terms_p3
# "This application is provided \"as is\" and \"as available\""
js = js.replace('This application is provided ""as is"" and ""as available""', 'This application is provided \\"as is\\" and \\"as available\\"')

with open('js/i18n.js', 'w', encoding='utf-8') as f:
    f.write(js)
