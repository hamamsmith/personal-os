import re

# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

auth_layout = """<!-- LOGGED OUT LAYOUT -->
<div id="authLayout">
    <nav class="landing-nav">
        <div class="landing-logo">Personal<span>OS</span></div>
        <div id="landingLangToggleBtn" onclick="toggleLanguage()" class="landing-lang-btn">EN</div>
    </nav>
    
    <div class="auth-content">
        <!-- LANDING SCREEN -->
        <div id="landingScreenContainer"></div>
        <!-- LOGIN SCREEN -->
        <div id="loginScreenContainer"></div>
    </div>

    <footer class="landing-footer">
        <p>&copy; 2026 Personal OS. <span data-i18n="footer_tagline">Designed for focus.</span></p>
    </footer>
</div>
"""

# Replace the old containers with the new auth layout
html = re.sub(r'<!-- LANDING SCREEN -->[\s\S]*?<!-- LOGIN SCREEN -->\n<div id="loginScreenContainer"></div>', auth_layout, html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)


# 2. Update pages/landingScreen.html
# Remove the nav and footer from it
with open('pages/landingScreen.html', 'r', encoding='utf-8') as f:
    landing = f.read()

landing = re.sub(r'<nav class="landing-nav">[\s\S]*?</nav>', '', landing)
landing = re.sub(r'<footer class="landing-footer">[\s\S]*?</footer>', '', landing)

with open('pages/landingScreen.html', 'w', encoding='utf-8') as f:
    f.write(landing)


# 3. Update css/style.css
with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Add display logic for authLayout
new_css_rules = """
        #authLayout { display: none; }
        body.locked #authLayout { display: block; }
"""
css = css.replace("/* Landing Screen Base Styles */", "/* Landing Screen Base Styles */\n" + new_css_rules)

# Update landingScreen height because it's no longer the fixed wrapper
css = css.replace("height: 100vh;", "min-height: 100vh;")
css = css.replace("position: fixed;", "position: relative;") # for #landingScreen

# Fix #loginScreen so it's vertically centered within auth-content
css = css.replace("body.locked #loginScreen { display: none; }", "body.locked #loginScreen { display: none; }")
css = css.replace("body.locked.show-login #loginScreen { display: flex !important; opacity: 1; pointer-events: auto; }", 
                  "body.locked.show-login #loginScreen { display: flex !important; opacity: 1; pointer-events: auto; min-height: 100vh; padding-top: 80px; padding-bottom: 80px; }")

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Updated index, landing, and css for shared auth layout.")
