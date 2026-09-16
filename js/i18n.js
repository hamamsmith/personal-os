// ============================================================
// TRANSLATOR ENGINE - Real-time Auto Translation
// Menggunakan MyMemory API (Gratis, tanpa API key)
// Semua teks diterjemahkan otomatis. Tidak ada dictionary manual.
// ============================================================

const TranslatorEngine = (() => {
    const CACHE_PREFIX = 'tr_cache_';
    const API_URL = 'https://api.mymemory.translated.net/get';
    let currentLang = 'id';
    let isTranslating = false;

    // Ambil semua node teks yang relevan di halaman
    function getTranslatableNodes() {
        const result = [];
        const skipTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'INPUT', 'TEXTAREA', 'SELECT']);

        function walk(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                // Skip teks kosong, teks pendek (emoji/angka saja), atau sudah ada atribut data-original
                if (text.length > 1 && /[a-zA-ZÀ-ÖØ-öø-ÿ\u00C0-\u024F\u0100-\u024F\u4E00-\u9FFF\u3000-\u303F\u0900-\u097F\u0600-\u06FF\u0080-\u00FF]/.test(text)) {
                    result.push(node);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (skipTags.has(node.tagName)) return;
                // Skip modal yang sedang tersembunyi
                if (node.style && node.style.display === 'none') return;
                node.childNodes.forEach(walk);
            }
        }

        // Scan seluruh body
        walk(document.body);
        return result;
    }

    // Terjemahkan satu teks via MyMemory API, dengan cache localStorage
    async function translateOne(text, from, to) {
        const cacheKey = CACHE_PREFIX + to + '_' + btoa(unescape(encodeURIComponent(text.substring(0, 50)))).replace(/[^a-z0-9]/gi, '');
        
        // Cek cache dulu
        try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) return cached;
        } catch(e) {}

        try {
            const url = `${API_URL}?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
            const res = await fetch(url);
            const data = await res.json();
            
            if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
                const translated = data.responseData.translatedText;
                // Simpan ke cache supaya tidak panggil API lagi
                try { localStorage.setItem(cacheKey, translated); } catch(e) {}
                return translated;
            }
        } catch(e) {
            console.warn('Gagal menerjemahkan:', text, e);
        }
        return text; // Fallback: teks asli
    }

    // Terjemahkan seluruh halaman sekaligus (batch)
    async function translatePage(from, to) {
        if (isTranslating) return;
        isTranslating = true;

        // Tampilkan loading indicator
        showTranslateLoader(true);

        try {
            const nodes = getTranslatableNodes();

            // Simpan teks asli (bahasa Indonesia) di data attribute jika belum ada
            nodes.forEach(node => {
                const parent = node.parentElement;
                if (parent && !parent.dataset.originalText) {
                    parent.dataset.originalText = node.textContent.trim();
                    parent.dataset.originalLang = 'id';
                }
            });

            if (to === 'id') {
                // Kembalikan ke teks asli (Indonesia)
                nodes.forEach(node => {
                    const parent = node.parentElement;
                    if (parent && parent.dataset.originalText) {
                        node.textContent = parent.dataset.originalText;
                    }
                });
            } else {
                // Translate secara batch dengan concurrency terbatas (5 sekaligus biar ga rate-limit)
                const CONCURRENCY = 5;
                for (let i = 0; i < nodes.length; i += CONCURRENCY) {
                    const batch = nodes.slice(i, i + CONCURRENCY);
                    await Promise.all(batch.map(async node => {
                        const parent = node.parentElement;
                        const textToTranslate = (parent && parent.dataset.originalText) 
                            ? parent.dataset.originalText 
                            : node.textContent.trim();
                        
                        if (textToTranslate && textToTranslate.length > 1) {
                            const translated = await translateOne(textToTranslate, from, to);
                            node.textContent = translated;
                        }
                    }));
                }
            }
        } catch(e) {
            console.error('Gagal menerjemahkan halaman:', e);
        } finally {
            showTranslateLoader(false);
            isTranslating = false;
        }
    }

    // Loading indicator saat proses translate
    function showTranslateLoader(show) {
        let loader = document.getElementById('translate-loader');
        if (!loader && show) {
            loader = document.createElement('div');
            loader.id = 'translate-loader';
            loader.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: rgba(15,23,42,0.95); color: #a78bfa; padding: 20px 32px;
                border-radius: 16px; z-index: 99999; font-family: 'Inter', sans-serif;
                font-size: 15px; font-weight: 600; letter-spacing: 0.5px;
                border: 1px solid rgba(124,58,237,0.4);
                box-shadow: 0 8px 32px rgba(124,58,237,0.2);
                display: flex; align-items: center; gap: 12px;
            `;
            loader.innerHTML = `
                <div style="width:20px;height:20px;border:2px solid rgba(124,58,237,0.3);border-top-color:#a78bfa;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
                <span>Menerjemahkan...</span>
            `;
            // Tambah animasi spin
            if (!document.getElementById('spin-style')) {
                const style = document.createElement('style');
                style.id = 'spin-style';
                style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
                document.head.appendChild(style);
            }
            document.body.appendChild(loader);
        } else if (loader && !show) {
            loader.remove();
        }
    }

    // Set bahasa dan terjemahkan
    async function setLanguage(lang) {
        const prevLang = currentLang;
        currentLang = lang;
        try { localStorage.setItem('lang', lang); } catch(e) {}

        // Update tombol toggle
        ['langToggleBtn', 'landingLangToggleBtn'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.innerText = lang.toUpperCase();
        });

        if (lang !== 'id') {
            await translatePage('id', lang);
        } else {
            await translatePage(prevLang, 'id');
        }
    }

    // Toggle antara ID dan EN
    async function toggleLanguage() {
        const newLang = currentLang === 'id' ? 'en' : 'id';
        await setLanguage(newLang);
    }

    // Init saat DOMContentLoaded
    function init() {
        let savedLang = 'id';
        try { savedLang = localStorage.getItem('lang') || 'id'; } catch(e) {}
        currentLang = savedLang;

        // Update tombol
        ['langToggleBtn', 'landingLangToggleBtn'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.innerText = savedLang.toUpperCase();
        });

        // Kalau bahasa tersimpan bukan Indonesia, terjemahkan halaman
        if (savedLang !== 'id') {
            // Sedikit delay biar halaman render dulu sepenuhnya
            setTimeout(() => translatePage('id', savedLang), 800);
        }
    }

    return { setLanguage, toggleLanguage, init };
})();

// Expose fungsi global supaya bisa dipanggil dari HTML onclick
function setLanguage(lang) { TranslatorEngine.setLanguage(lang); }
function toggleLanguage() { TranslatorEngine.toggleLanguage(); }

document.addEventListener('DOMContentLoaded', () => TranslatorEngine.init());
