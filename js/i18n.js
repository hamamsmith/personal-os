// ============================================================
// TRANSLATOR ENGINE - Real-time Auto Translation
// Menggunakan MyMemory API (Gratis, tanpa API key)
// Default: Bahasa Inggris. Ganti ke Bahasa Indonesia via tombol.
// ============================================================

const TranslatorEngine = (() => {
    const CACHE_PREFIX = 'tr_cache_';
    const API_URL = 'https://api.mymemory.translated.net/get';
    let currentLang = 'en';
    let isTranslating = false;

    // Selector elemen yang PERLU diterjemahkan (bukan seluruh DOM)
    const TRANSLATABLE_SELECTOR = [
        'h1', 'h2', 'h3', 'h4',
        'p',
        'button', '.btn', '.btn-submit',
        'label',
        'a.nav-item span:not(.nav-icon)',
        '.topbar-title',
        '.landing-title', '.landing-subtitle',
        '.feature-card h3', '.feature-card p',
        '.card h1', '.card h3',
        '[data-translate="true"]',
        '.summary-box .label',
        '.footer-left p',
        '.empty-state', '.empty-msg'
    ].join(', ');

    // Simpan teks asli (Inggris) sebelum translate
    function saveOriginals() {
        document.querySelectorAll(TRANSLATABLE_SELECTOR).forEach(el => {
            if (!el.dataset.originalText && el.innerText && el.innerText.trim().length > 0) {
                el.dataset.originalText = el.innerText.trim();
            }
        });
    }

    // Restore ke teks asli Bahasa Inggris
    function restoreOriginals() {
        document.querySelectorAll('[data-original-text]').forEach(el => {
            if (el.dataset.originalText) {
                el.innerText = el.dataset.originalText;
            }
        });
    }

    // Terjemahkan satu teks via MyMemory API dengan cache
    async function translateOne(text, from, to) {
        if (!text || text.trim().length < 2) return text;

        const safeKey = text.substring(0, 60).replace(/[^a-z0-9]/gi, '_');
        const cacheKey = `${CACHE_PREFIX}${to}_${safeKey}`;

        try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) return cached;
        } catch(e) {}

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000); // 5 detik timeout per request
            const url = `${API_URL}?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeout);
            const data = await res.json();

            if (data.responseStatus === 200 && data.responseData?.translatedText) {
                const translated = data.responseData.translatedText;
                try { localStorage.setItem(cacheKey, translated); } catch(e) {}
                return translated;
            }
        } catch(e) {
            // Timeout atau error network — pakai teks asli
        }
        return text;
    }

    // Terjemahkan seluruh halaman ke bahasa target
    async function translatePage(from, to) {
        if (isTranslating) return;
        isTranslating = true;
        showLoader(true);

        try {
            if (to === 'en') {
                // Kembalikan ke Bahasa Inggris (teks asli)
                restoreOriginals();
                return;
            }

            // Simpan teks asli dulu
            saveOriginals();

            // Ambil semua elemen yang perlu ditranslate
            const elements = [...document.querySelectorAll(TRANSLATABLE_SELECTOR)]
                .filter(el => el.dataset.originalText && el.dataset.originalText.trim().length > 1);

            // Batch 4 sekaligus biar tidak spam API
            const BATCH_SIZE = 4;
            for (let i = 0; i < elements.length; i += BATCH_SIZE) {
                const batch = elements.slice(i, i + BATCH_SIZE);
                await Promise.all(batch.map(async el => {
                    const original = el.dataset.originalText;
                    const translated = await translateOne(original, from, to);
                    el.innerText = translated;
                }));
            }
        } catch(e) {
            console.error('Gagal menerjemahkan halaman:', e);
        } finally {
            // Pastikan loader SELALU hilang
            showLoader(false);
            isTranslating = false;
        }
    }

    function showLoader(show) {
        let loader = document.getElementById('translate-loader');
        if (show && !loader) {
            loader = document.createElement('div');
            loader.id = 'translate-loader';
            loader.style.cssText = [
                'position:fixed', 'bottom:90px', 'right:20px',
                'background:rgba(15,23,42,0.95)', 'color:#a78bfa',
                'padding:10px 18px', 'border-radius:12px', 'z-index:99999',
                'font-family:Inter,sans-serif', 'font-size:13px', 'font-weight:600',
                'border:1px solid rgba(124,58,237,0.4)',
                'box-shadow:0 4px 20px rgba(124,58,237,0.2)',
                'display:flex', 'align-items:center', 'gap:8px',
                'transition:opacity 0.3s'
            ].join(';');

            if (!document.getElementById('spin-style')) {
                const style = document.createElement('style');
                style.id = 'spin-style';
                style.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
                document.head.appendChild(style);
            }

            loader.innerHTML = `
                <div style="width:14px;height:14px;border:2px solid rgba(124,58,237,0.3);border-top-color:#a78bfa;border-radius:50%;animation:spin 0.7s linear infinite;flex-shrink:0"></div>
                <span>Translating...</span>
            `;
            document.body.appendChild(loader);
        } else if (!show && loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader?.remove(), 300);
        }
    }

    async function setLanguage(lang) {
        currentLang = lang;
        try { localStorage.setItem('lang', lang); } catch(e) {}

        // Update tombol toggle
        ['langToggleBtn', 'landingLangToggleBtn'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.innerText = lang === 'en' ? 'EN' : 'ID';
        });

        if (lang === 'id') {
            await translatePage('en', 'id');
        } else {
            // Kembali ke Inggris = restore saja, tidak perlu API
            showLoader(false);
            isTranslating = false;
            restoreOriginals();
        }
    }

    async function toggleLanguage() {
        const newLang = currentLang === 'en' ? 'id' : 'en';
        await setLanguage(newLang);
    }

    function init() {
        let savedLang = 'en';
        try { savedLang = localStorage.getItem('lang') || 'en'; } catch(e) {}
        currentLang = savedLang;

        // Update label tombol
        ['langToggleBtn', 'landingLangToggleBtn'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.innerText = savedLang === 'en' ? 'EN' : 'ID';
        });

        // Kalau user sebelumnya pakai Bahasa Indonesia, terjemahkan
        if (savedLang === 'id') {
            setTimeout(() => translatePage('en', 'id'), 1000);
        }
    }

    return { setLanguage, toggleLanguage, init };
})();

// Expose ke global
function setLanguage(lang) { TranslatorEngine.setLanguage(lang); }
function toggleLanguage() { TranslatorEngine.toggleLanguage(); }

document.addEventListener('DOMContentLoaded', () => TranslatorEngine.init());
