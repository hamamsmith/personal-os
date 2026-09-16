import re

# Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace all onclick="navTo('id', 'title', this)" with href="#id" data-title="title"
def replace_navTo(match):
    pageId = match.group(1)
    title = match.group(2)
    return f'href="#{pageId}" data-title="{title}"'

html = re.sub(r'onclick="navTo\(\'([^\']+)\',\s*\'([^\']+)\',\s*this\)"', replace_navTo, html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

# Update app.js
with open('js/app.js', 'r', encoding='utf-8') as f:
    app = f.read()

# 1. Remove the old hashchange logic
old_hashchange = r"window\.addEventListener\('hashchange', \(\) => \{[\s\S]*?\}\);"
new_hashchange = """window.addEventListener('hashchange', () => {
    let hash = window.location.hash.substring(1);
    if (!hash) hash = 'dashboard';
    
    // Check if the hash is one of our pages
    const pages = ['dashboard', 'battle', 'braindump', 'debrief', 'screentime', 'weekly'];
    if (!pages.includes(hash)) return;

    const btn = document.querySelector(`.nav-item[href="#${hash}"]`);
    let title = hash;
    if (btn) {
        title = btn.getAttribute('data-title') || hash;
    } else if (hash === 'dashboard') {
        title = 'Dashboard.';
    }
    
    navTo(hash, title, btn);
});"""

app = re.sub(old_hashchange, new_hashchange, app)

# 2. Modify navTo to NOT touch history anymore. It just updates the DOM.
old_navTo = r"function navTo\(pageId, pageTitle, el, pushHistory = true\) \{[\s\S]*?if \(\['battle', 'braindump', 'debrief', 'screentime', 'weekly'\]\.includes\(pageId\)\) \{\s*loadDashboardData\(\);\s*\}\s*\}"
new_navTo = """function navTo(pageId, pageTitle, el) {
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

app = re.sub(old_navTo, new_navTo, app)

# 3. Update the initial route logic
old_initial = r"// Check initial route[\s\S]*?if\(btn\) navTo\(hash, btn\.querySelector\('span:last-child'\)\.innerText, btn, false\);\s*\}"
new_initial = """// Check initial route
    let hash = window.location.hash.substring(1);
    if (!hash) hash = 'dashboard';
    if(pages.includes(hash)) {
        const btn = document.querySelector(`.nav-item[href="#${hash}"]`);
        let title = hash;
        if (btn) title = btn.getAttribute('data-title') || hash;
        else if (hash === 'dashboard') title = 'Dashboard.';
        navTo(hash, title, btn);
    }"""
app = re.sub(old_initial, new_initial, app)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app)

print("Updated index.html and app.js to use native href for routing.")
