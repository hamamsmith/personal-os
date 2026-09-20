# Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

if 'id="footerContainer"' not in idx:
    idx = idx.replace('<!-- LOGIN SCREEN -->', '<!-- FOOTER -->\n        <div id="footerContainer"></div>\n        <!-- LOGIN SCREEN -->')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(idx)

# Update core.js
with open('js/core.js', 'r', encoding='utf-8') as f:
    core = f.read()

if 'pages/footer.html' not in core:
    footer_load_code = '''const footerRes = await fetch(pages/footer.html?v=);
        document.getElementById('footerContainer').outerHTML = await footerRes.text();'''
    core = core.replace("const loginRes = await fetch(pages/loginScreen.html?v=);", footer_load_code + "\n        const loginRes = await fetch(pages/loginScreen.html?v=);")
    with open('js/core.js', 'w', encoding='utf-8') as f:
        f.write(core)

print("UPDATED index.html and core.js for footer")
