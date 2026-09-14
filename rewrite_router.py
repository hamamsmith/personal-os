import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. Remove the old popstate listener
app_js = re.sub(r"window\.addEventListener\('popstate', \(e\) => \{.*?\}\);", "", app_js, flags=re.DOTALL)

# 2. Add the hashchange listener
hashchange_listener = """
window.addEventListener('hashchange', () => {
    let hash = window.location.hash.substring(1);
    if (!hash) hash = 'dashboard';
    const btn = document.querySelector(`.nav-item[onclick*="${hash}"]`);
    if (btn) {
        const titleSpan = btn.querySelector('span:nth-child(2)');
        const title = titleSpan ? titleSpan.innerText : hash;
        navTo(hash, title, btn, false);
    } else if (hash === 'dashboard') {
        navTo('dashboard', 'Dashboard.', null, false);
    }
});
"""
# Insert it after DOMContentLoaded
app_js = re.sub(r"(document\.addEventListener\('DOMContentLoaded', loadPages\);)", r"\1\n" + hashchange_listener, app_js)

# 3. Modify navTo to just use pushState manually OR hash assignment.
# Actually, if we just use pushState, it won't trigger hashchange.
# If we set window.location.hash, it triggers hashchange.
# But navTo already does the UI change! So we don't want hashchange to re-trigger it.
# So we SHOULD use pushState, but also listen to hashchange OR popstate.
# Let's use robust popstate + hash fallback.
# Wait, let's just make it purely hash-driven!
# navTo will ONLY set the hash.
# The hashchange listener will do the actual UI updates.

# Let's rewrite navTo completely!
new_navTo = """function navTo(pageId, pageTitle, el, pushHistory = true) {
    if (pushHistory) {
        // Only set hash, let hashchange handle the rest
        window.location.hash = pageId;
        return;
    }

    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    
    const topbarTitle = document.getElementById('topbar-title');
    if (topbarTitle) topbarTitle.innerText = pageTitle;
    
    setTimeout(() => { 
        const targetPage = document.getElementById(pageId);
        if(targetPage) targetPage.classList.add('active'); 
        window.scrollTo({top: 0, behavior: 'smooth'}); 
    }, 50);
    
    if(el) el.classList.add('active'); 
    closeMobileSidebar();
    
    if (['battle', 'braindump', 'debrief', 'screentime', 'weekly'].includes(pageId)) {
        loadDashboardData();
    }
}"""

app_js = re.sub(r"function navTo\(pageId, pageTitle, el, pushHistory = true\) \{.*?\}\n        \}", new_navTo, app_js, flags=re.DOTALL)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
print("Router rewritten.")
