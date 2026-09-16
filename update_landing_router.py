import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    app = f.read()

# 1. Update the hashchange listener to handle login/landing
old_hashchange = r"window\.addEventListener\('hashchange', \(\) => \{[\s\S]*?\}\);"
new_hashchange = """window.addEventListener('hashchange', () => {
    let hash = window.location.hash.substring(1);
    
    // Check if logged in
    let isLoggedIn = false;
    try { isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; } catch(e) {}
    
    if (!isLoggedIn) {
        if (hash === 'login') {
            showLoginScreen();
        } else {
            hideLoginScreen();
        }
        return;
    }

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

# 2. Update initial route check
old_initial = r"// Check initial route[\s\S]*?\}\s*\}\s*// Ensure loadPages is called on load"
new_initial = """// Check initial route
    let hash = window.location.hash.substring(1);
    
    let isLoggedIn = false;
    try { isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; } catch(e) {}
    
    if (!isLoggedIn) {
        if (hash === 'login') showLoginScreen();
        else hideLoginScreen();
    } else {
        if (!hash) hash = 'dashboard';
        if(pages.includes(hash)) {
            const btn = document.querySelector(`.nav-item[href="#${hash}"]`);
            let title = hash;
            if (btn) title = btn.getAttribute('data-title') || hash;
            else if (hash === 'dashboard') title = 'Dashboard.';
            navTo(hash, title, btn);
        }
    }
}
// Ensure loadPages is called on load"""

app = re.sub(old_initial, new_initial, app)

# 3. Add hideLoginScreen function right after showLoginScreen
hide_login_func = """function hideLoginScreen() {
    document.body.classList.remove('show-login');
    const landing = document.getElementById('landingScreen');
    if (landing) {
        landing.style.opacity = '1';
    }
}"""
app = re.sub(r"(function showLoginScreen\(\) \{[\s\S]*?\}\s*)\n", r"\1\n" + hide_login_func + "\n\n", app)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(app)

print("Updated app.js for landing/login routing.")
