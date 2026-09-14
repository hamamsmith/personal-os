import os
import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. Add loader function at the top of app.js
loader_script = """
async function loadPages() {
    const pages = ['dashboard', 'battle', 'braindump', 'debrief', 'screentime', 'weekly'];
    const main = document.getElementById('main-content');
    
    // Load main pages
    for (const page of pages) {
        try {
            const res = await fetch(`pages/${page}.html`);
            const html = await res.text();
            main.innerHTML += html;
        } catch (e) {
            console.error("Failed to load page: " + page);
        }
    }
    
    // Load Landing and Login Screens
    try {
        const landingRes = await fetch(`pages/landingScreen.html`);
        document.getElementById('landingScreenContainer').outerHTML = await landingRes.text();
        
        const loginRes = await fetch(`pages/loginScreen.html`);
        document.getElementById('loginScreenContainer').outerHTML = await loginRes.text();
    } catch (e) {}

    // Apply i18n to newly loaded elements
    const savedLang = localStorage.getItem('lang') || 'en';
    setLanguage(savedLang);
    
    // Check initial route
    const hash = window.location.hash.substring(1);
    if(hash && pages.includes(hash)) {
        const btn = document.querySelector(`.nav-item[onclick*="${hash}"]`);
        if(btn) navTo(hash, btn.querySelector('span:last-child').innerText, btn, false);
    }
}

// Ensure loadPages is called on load
document.addEventListener('DOMContentLoaded', loadPages);

// Handle History API Popstate
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.pageId) {
        const btn = document.querySelector(`.nav-item[onclick*="${e.state.pageId}"]`);
        navTo(e.state.pageId, e.state.title, btn, false);
    } else {
        const dashboardBtn = document.querySelector(`.nav-item[onclick*="dashboard"]`);
        if(dashboardBtn) navTo('dashboard', 'Dashboard.', dashboardBtn, false);
    }
});
"""

# Replace the existing navTo function to support history.pushState
# We need to find the function navTo(pageId, title, btn) { ... }
navTo_match = re.search(r'function navTo\s*\(pageId,\s*title,\s*btn\)\s*\{.*?\n        }', app_js, re.DOTALL)
if navTo_match:
    old_navTo = navTo_match.group(0)
    
    new_navTo = """function navTo(pageId, title, btn, pushHistory = true) {
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    const pageEl = document.getElementById(pageId);
    if(pageEl) pageEl.classList.add('active');
    if(btn) btn.classList.add('active');
    
    const topbarTitle = document.getElementById('topbar-title');
    if(topbarTitle) topbarTitle.innerText = title;

    if (pushHistory) {
        history.pushState({ pageId, title }, title, `#${pageId}`);
    }

    if (window.innerWidth <= 768) {
        closeMobileSidebar();
    }
}"""
    app_js = app_js.replace(old_navTo, new_navTo)

app_js = loader_script + "\n" + app_js

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print("App.js updated with loader and history API")
