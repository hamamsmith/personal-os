const fs = require('fs');
const path = require('path');
const https = require('https');

// ==========================================
// PENGATURAN API KEY DEEPL
// ==========================================
// Masukkan API Key DeepL lu di bawah ini. Pastikan ujungnya ada tulisan ":fx" jika pakai akun Free.
const DEEPL_API_KEY = "GANTI_DENGAN_API_KEY_DEEPL_LU_DISINI"; 
const TARGET_LANGS = ["EN-US"]; // Bahasa target. Contoh lain: "JA", "ES", "ZH"

const I18N_PATH = path.join(__dirname, '../js/i18n.js');

// Helper buat panggil API DeepL tanpa library external axios biar ga usah npm install
function translateText(text, targetLang) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            text: [text],
            target_lang: targetLang,
            source_lang: "ID" // Asumsi semua teks original lu pakai bahasa Indonesia
        });

        const options = {
            hostname: 'api-free.deepl.com',
            port: 443,
            path: '/v2/translate',
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let resData = '';
            res.on('data', chunk => resData += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const parsed = JSON.parse(resData);
                        resolve(parsed.translations[0].text);
                    } catch (e) {
                        reject('Gagal parsing JSON dari DeepL');
                    }
                } else {
                    reject(`Error dari API DeepL: ${res.statusCode} - ${resData}`);
                }
            });
        });

        req.on('error', e => reject(e.message));
        req.write(data);
        req.end();
    });
}

async function run() {
    console.log("Membaca file i18n.js...");
    let content = fs.readFileSync(I18N_PATH, 'utf8');
    
    // Hapus sisa-sisa module.exports kalau ada di file asli
    content = content.replace(/if\s*\(typeof\s+module\s*!==\s*'undefined'\)\s*module\.exports\s*=\s*translations;/g, '');
    content += `\nmodule.exports = translations;`;

    // Tarik object dari script dengan mock DOM
    const tempModule = { exports: {} };
    const mockDocument = { addEventListener: () => {}, querySelectorAll: () => [] };
    const mockStorage = { getItem: () => {}, setItem: () => {} };
    const tempFn = new Function('module', 'document', 'localStorage', content);
    tempFn(tempModule, mockDocument, mockStorage);
    
    let translations = tempModule.exports;
    
    if (!translations || !translations.id) {
        console.error("Error: Tidak menemukan bahasa Indonesia ('id') di i18n.js");
        return;
    }

    const masterDict = translations.id;
    console.log(`Ditemukan ${Object.keys(masterDict).length} kalimat/kata dalam bahasa Indonesia.`);

    if (DEEPL_API_KEY === "GANTI_DENGAN_API_KEY_DEEPL_LU_DISINI") {
        console.error("\n[ERROR] API KEY BELUM DIISI! Buka file scripts/deepl_translator.js dan masukkan API Key lu di baris 7.");
        return;
    }

    for (let lang of TARGET_LANGS) {
        let shortLang = lang.split('-')[0].toLowerCase();
        console.log(`\n=== Memulai proses terjemahan ke ${shortLang.toUpperCase()} ===`);
        
        if (!translations[shortLang]) {
            translations[shortLang] = {};
        }

        let keys = Object.keys(masterDict);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let idText = masterDict[key];

            // Kalau udah pernah ditranslate dan isinya ada, skip aja biar irit kuota
            if (translations[shortLang][key] && translations[shortLang][key] !== idText) {
                console.log(`[SKIP] "${key}" sudah ditranslate: ${translations[shortLang][key]}`);
                continue;
            }

            console.log(`[PROSES ${i+1}/${keys.length}] Translating "${key}"...`);
            try {
                let result = await translateText(idText, lang);
                translations[shortLang][key] = result;
                console.log(`   -> Hasil: ${result}`);
                // Delay 300ms biar nggak kena rate-limit DeepL
                await new Promise(r => setTimeout(r, 300));
            } catch (err) {
                console.error(`   -> GAGAL: ${err}`);
            }
        }
    }

    console.log("\nProses terjemahan selesai. Menyimpan kembali ke i18n.js...");
    
    // Tulis ulang JS file-nya
    let newContent = `const translations = ${JSON.stringify(translations, null, 4)};\n\n`;
    newContent += `function setLanguage(lang) {\n`;
    newContent += `    try { localStorage.setItem('lang', lang); } catch(e) {}\n`;
    newContent += `    document.querySelectorAll('[data-i18n]').forEach(el => {\n`;
    newContent += `        const key = el.getAttribute('data-i18n');\n`;
    newContent += `        if (translations[lang] && translations[lang][key]) {\n`;
    newContent += `            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {\n`;
    newContent += `                el.placeholder = translations[lang][key];\n`;
    newContent += `            } else if (el.tagName === 'OPTION') {\n`;
    newContent += `                el.innerHTML = translations[lang][key];\n`;
    newContent += `            } else {\n`;
    newContent += `                el.innerHTML = translations[lang][key];\n`;
    newContent += `            }\n`;
    newContent += `        }\n`;
    newContent += `    });\n\n`;
    newContent += `    const toggleBtn = document.getElementById('langToggleBtn');\n`;
    newContent += `    if (toggleBtn) { toggleBtn.innerText = lang.toUpperCase(); }\n`;
    newContent += `    const landingToggleBtn = document.getElementById('landingLangToggleBtn');\n`;
    newContent += `    if (landingToggleBtn) { landingToggleBtn.innerText = lang.toUpperCase(); }\n`;
    newContent += `}\n\n`;
    newContent += `function toggleLanguage() {\n`;
    newContent += `    let currentLang = 'id';\n`;
    newContent += `    try { currentLang = localStorage.getItem('lang') || 'id'; } catch(e) {}\n`;
    newContent += `    const newLang = currentLang === 'id' ? 'en' : 'id';\n`;
    newContent += `    setLanguage(newLang);\n`;
    newContent += `}\n\n`;
    newContent += `document.addEventListener('DOMContentLoaded', () => {\n`;
    newContent += `    const savedLang = localStorage.getItem('lang') || 'id';\n`;
    newContent += `    setLanguage(savedLang);\n`;
    newContent += `});\n\n`;
    newContent += `if (typeof module !== 'undefined') module.exports = translations;\n`;

    fs.writeFileSync(I18N_PATH, newContent, 'utf8');
    console.log("BERHASIL! i18n.js telah diupdate. Silakan cek file i18n.js untuk melihat perubahannya.");
}

run();
