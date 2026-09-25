// ============================================
// CORE.JS - Global functions & initialization
// ============================================

// --- AUTH & ROUTING ---
try {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        document.body.classList.add('locked');
    }
} catch(e) {
    document.body.classList.add('locked');
}

const CACHE_VER = "19";
const PAGES = ['dashboard', 'battle', 'braindump', 'debrief', 'screentime', 'weekly'];

async function loadPages() {
    const main = document.getElementById('main-content');
    for (const page of PAGES) {
        try {
            const res = await fetch(`pages/${page}.html?v=${CACHE_VER}`);
            main.innerHTML += await res.text();
        } catch (e) { console.error("Failed to load page: " + page); }
    }
    try {
        const landingRes = await fetch(`pages/landingScreen.html?v=${CACHE_VER}`);
        document.getElementById('landingScreenContainer').outerHTML = await landingRes.text();
        const loginRes = await fetch(`pages/loginScreen.html?v=${CACHE_VER}`);
        document.getElementById('loginScreenContainer').outerHTML = await loginRes.text();
        const signupRes = await fetch(`pages/signupScreen.html?v=${CACHE_VER}`);
        document.getElementById('signupScreenContainer').outerHTML = await signupRes.text();
        const legalRes = await fetch(`pages/legalModals.html?v=${CACHE_VER}`);
        document.getElementById('legalModalsContainer').innerHTML = await legalRes.text();
    } catch (e) {}

    let savedLang = 'en';
    try { savedLang = localStorage.getItem('lang') || 'en'; } catch(e) {}
    setLanguage(savedLang);

    let hash = window.location.hash.substring(1);
    let isLoggedIn = false;
    try { isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; } catch(e) {}

    if (!isLoggedIn) {
        if (hash === 'login') showLoginScreen();
        else if (hash === 'signup') showSignupScreen();
        else hideLoginScreen();
    } else {
        if (!hash) hash = 'dashboard';
        if (PAGES.includes(hash)) {
            const btn = document.querySelector(`.nav-item[href="#${hash}"]`);
            let title = hash === 'dashboard' ? 'Dashboard.' : hash;
            if (btn) title = btn.getAttribute('data-title') || title;
            navTo(hash, title, btn);
        }
    }
}

// Jalan segera (script di akhir body) agar layar auth ter-render tanpa
// menunggu script CDN (tailwind/chart) yang bisa lambat/blokir di jaringan tertentu.
try { loadPages(); } catch (e) { console.error('Gagal memuat halaman:', e); }

window.addEventListener('hashchange', () => {
    let hash = window.location.hash.substring(1);
    let isLoggedIn = false;
    try { isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; } catch(e) {}
    if (!isLoggedIn) {
        if (hash === 'login') showLoginScreen();
        else if (hash === 'signup') showSignupScreen();
        else hideLoginScreen();
        return;
    }
    if (!hash) hash = 'dashboard';
    if (!PAGES.includes(hash)) return;
    const btn = document.querySelector(`.nav-item[href="#${hash}"]`);
    let title = hash === 'dashboard' ? 'Dashboard.' : hash;
    if (btn) title = btn.getAttribute('data-title') || title;
    navTo(hash, title, btn);
});

// --- LOGIN / LOGOUT ---
function showLoginScreen() {
    if (window.location.hash !== '#login') window.location.hash = 'login';
    document.body.classList.add('show-login');
    const login = document.getElementById('loginScreen');
    const signup = document.getElementById('signupScreen');
    if (login) login.classList.add('auth-active');
    if (signup) signup.classList.remove('auth-active');
    if (login) login.style.display = 'flex';
    if (signup) signup.style.display = 'none';
    const landing = document.getElementById('landingScreen');
    if (landing) landing.style.opacity = '0';
}
function showSignupScreen() {
    if (window.location.hash !== '#signup') window.location.hash = 'signup';
    document.body.classList.add('show-login');
    const login = document.getElementById('loginScreen');
    const signup = document.getElementById('signupScreen');
    if (login) login.classList.remove('auth-active');
    if (signup) signup.classList.add('auth-active');
    if (login) login.style.display = 'none';
    if (signup) signup.style.display = 'flex';
    const landing = document.getElementById('landingScreen');
    if (landing) landing.style.opacity = '0';
}
function hideLoginScreen() {
    document.body.classList.remove('show-login');
    const landing = document.getElementById('landingScreen');
    if (landing) landing.style.opacity = '1';
    const login = document.getElementById('loginScreen');
    const signup = document.getElementById('signupScreen');
    if (login) { login.classList.remove('auth-active'); login.style.display = 'none'; }
    if (signup) { signup.classList.remove('auth-active'); signup.style.display = 'none'; }
}
function handleLogoClick(e) {
    if (e) e.preventDefault();
    let isLoggedIn = false;
    try { isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; } catch(err) {}
    if (isLoggedIn) {
        window.location.hash = 'dashboard';
        return;
    }
    document.body.classList.remove('show-login');
    const landing = document.getElementById('landingScreen');
    if (landing) landing.style.opacity = '1';
    try { if (window.location.hash) window.location.hash = ''; } catch(err) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function loginOS(e) {
    e.preventDefault();
    try { localStorage.setItem('isLoggedIn', 'true'); } catch(e) {}
    const loginScreen = document.getElementById('loginScreen');
    if (loginScreen) {
        loginScreen.style.opacity = '0';
        setTimeout(() => {
            document.body.classList.remove('locked');
            document.body.classList.remove('show-login');
            window.location.hash = 'dashboard';
            loadDashboardData();
            loginScreen.classList.remove('auth-active');
            loginScreen.style.opacity = '';
            loginScreen.style.display = 'none';
        }, 500);
    } else {
        document.body.classList.remove('locked');
        document.body.classList.remove('show-login');
        window.location.hash = 'dashboard';
        loadDashboardData();
    }
}
function signupOS(e) {
    e.preventDefault();
    const f = e.target;
    const username = (f.querySelector('input[name="username"]') || {}).value ? f.querySelector('input[name="username"]').value.trim() : '';
    const email = (f.querySelector('input[name="email"]') || {}).value ? f.querySelector('input[name="email"]').value.trim() : '';
    const password = (f.querySelector('input[name="password"]') || {}).value || '';
    const confirmPass = (f.querySelector('input[name="confirm-password"]') || {}).value || '';
    if (!username) { alert('Username wajib diisi, bro.'); return; }
    if (!email) { alert('Email wajib diisi, bro.'); return; }
    if (password === confirmPass && password) {
        try { localStorage.setItem('os_user', username); } catch(e) {}
        try { localStorage.setItem('isLoggedIn', 'true'); } catch(e) {}
        document.body.classList.remove('locked');
        document.body.classList.remove('show-login');
        window.location.hash = 'dashboard';
        loadDashboardData();
        const signupScreen = document.getElementById('signupScreen');
        if (signupScreen) {
            signupScreen.classList.remove('auth-active');
            signupScreen.style.display = 'none';
        }
    } else {
        alert('Password dan konfirmasi password beda, bro. Cek lagi.');
    }
}
function logoutOS() {
    if (confirm("Lu yakin mau keluar dari sesi ini?")) {
        try { localStorage.removeItem('isLoggedIn'); } catch(e) {}
        document.body.classList.add('locked');
        document.body.classList.remove('show-login');
        closeMobileSidebar();
        const landing = document.getElementById('landingScreen');
        if (landing) landing.style.opacity = '1';
        const loginScreen = document.getElementById('loginScreen');
        if (loginScreen) loginScreen.querySelectorAll('input').forEach(i => i.value = '');
        const signupScreen = document.getElementById('signupScreen');
        if (signupScreen) {
            signupScreen.querySelectorAll('input').forEach(i => i.value = '');
            signupScreen.style.display = 'none';
        }
        if (loginScreen) loginScreen.style.display = 'none';
    }
}

// --- SIDEBAR & NAV ---
let sidebarOpen = window.innerWidth > 768;

function toggleLandingMenu() {
    const menu = document.getElementById('landingMenu');
    if (menu) menu.classList.toggle('mobile-show');
}
function closeLandingMenu() {
    const menu = document.getElementById('landingMenu');
    if (menu) menu.classList.remove('mobile-show');
}

function toggleUserMenu(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('userDropdownMenu');
    if (menu) menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}
function closeUserMenu() {
    const menu = document.getElementById('userDropdownMenu');
    if (menu) menu.style.display = 'none';
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main-content');
    if (window.innerWidth <= 768) {
        sidebarOpen = !sidebarOpen;
        sidebarOpen ? sidebar.classList.add('mobile-show') : sidebar.classList.remove('mobile-show');
    } else {
        sidebar.classList.toggle('collapsed');
        main.classList.toggle('expanded');
    }
}
function closeMobileSidebar() {
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('mobile-show');
        sidebarOpen = false;
    }
}
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.querySelector('.hamburger');
    if (sidebar && hamburger && window.innerWidth <= 768 && sidebarOpen) {
        if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) closeMobileSidebar();
    }
    
    // Close user menu
    const userMenu = document.getElementById('userDropdownMenu');
    const userContainer = document.querySelector('.user-dropdown-container');
    if (userMenu && userContainer && !userContainer.contains(e.target)) {
        closeUserMenu();
    }
});
function navTo(pageId, pageTitle, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const topbarTitle = document.getElementById('topbar-title');
    if (topbarTitle) topbarTitle.innerText = pageTitle;
    setTimeout(() => {
        const targetPage = document.getElementById(pageId);
        if (targetPage) targetPage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
    if (el) el.classList.add('active');
    closeMobileSidebar();
    if (['battle', 'braindump', 'debrief', 'screentime', 'weekly'].includes(pageId)) loadDashboardData();
}

// --- UTILITIES ---
function formatTanggal(dateStr) {
    if (!dateStr || dateStr.length < 10) return dateStr;
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}
function formatDur(val) {
    const h = parseFloat(val);
    if (isNaN(h) || h > 24 || h < 0) return '?';
    const hours = Math.floor(h);
    const mins = Math.round((h - hours) * 60);
    if (hours === 0) return `${mins}m`;
    return mins > 0 ? `${hours}j ${mins}m` : `${hours}j`;
}
function showToast(msg) {
    let toast = document.getElementById("toast");
    if (msg) toast.innerText = "✅ " + msg;
    toast.className = "show";
    if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
    setTimeout(function() { toast.className = toast.className.replace("show", ""); }, 3000);
}
function resetForm(pageId) {
    let page = document.getElementById(pageId);
    page.querySelectorAll('input:not([type="hidden"]), textarea').forEach(el => el.value = '');
    page.querySelectorAll('select').forEach(el => el.value = '0');
    page.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
    page.querySelectorAll('input[type="hidden"]').forEach(el => el.value = '');
}
function selectRadio(element, groupName) {
    let container = element.parentElement;
    container.querySelectorAll('.radio-btn, .emoji-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    if (navigator.vibrate) navigator.vibrate(20);
    let val = element.innerText.trim();
    document.getElementById(groupName + 'Val').value = val;
    if (groupName === 'mood') {
        const energySelect = document.getElementById('energyVal');
        if (energySelect) {
            if (val === '😁') energySelect.value = '5';
            else if (val === '🙂') energySelect.value = '4';
            else if (val === '😐') energySelect.value = '3';
            else if (val === '😕') energySelect.value = '2';
            else if (val === '😞') energySelect.value = '1';
        }
    }
}

// --- API ---
function getApiURL() { return '/api/data'; }
function sendToServer(action, dataPayload, callback, btnElement, origTxt) {
    fetch(getApiURL(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: action, data: dataPayload })
    })
    .then(r => r.json())
    .then(res => callback(res))
    .catch(err => {
        alert("Error Koneksi API: " + err.message);
        if (btnElement) { btnElement.innerText = origTxt; btnElement.disabled = false; }
    });
}

// --- LEGAL MODALS ---
function openPrivacyModal() { document.getElementById('privacyModal').classList.add('show'); }
function closePrivacyModal() { document.getElementById('privacyModal').classList.remove('show'); }
function openTermsModal() { document.getElementById('termsModal').classList.add('show'); }
function closeTermsModal() { document.getElementById('termsModal').classList.remove('show'); }
