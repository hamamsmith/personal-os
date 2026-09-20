import re

with open('index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

# Remove the extra footer container I injected earlier inside auth-content
idx = idx.replace('<!-- FOOTER --><div id="footerContainer"></div><!-- LOGIN SCREEN -->', '<!-- LOGIN SCREEN -->')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(idx)

with open('js/core.js', 'r', encoding='utf-8') as f:
    core = f.read()

# Remove footer loading from core.js
core = re.sub(r"const footerRes = await fetch\(pages/footer\.html\?v=\$\{CACHE_VER\}\); \ndocument\.getElementById\('footerContainer'\)\.outerHTML = await footerRes\.text\(\); ", "", core)

with open('js/core.js', 'w', encoding='utf-8') as f:
    f.write(core)

with open('pages/footer.html', 'r', encoding='utf-8') as f:
    footer = f.read()

# Remove the image from footer.html
footer = re.sub(r'<img src="picture/logo\.png"[^>]*>', '', footer)

with open('pages/footer.html', 'w', encoding='utf-8') as f:
    f.write(footer)

with open('pages/header.html', 'r', encoding='utf-8') as f:
    header = f.read()

# Increase header image size
header = header.replace('height: 40px;', 'height: 56px;') # Making it even larger

with open('pages/header.html', 'w', encoding='utf-8') as f:
    f.write(header)

print("Fixes applied.")
