import os

with open('index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

# Remove the SECOND footerContainer (line 123)
# We can do this by finding the exact string context.
idx = idx.replace('<div id="legalModalsContainer"></div>\n\n<div id="footerContainer"></div>', '<div id="legalModalsContainer"></div>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(idx)

with open('js/core.js', 'r', encoding='utf-8') as f:
    core = f.read()

# Remove footer logic from core.js
target = "const footerRes = await fetch(pages/footer.html?v=); \ndocument.getElementById('footerContainer').outerHTML = await footerRes.text(); "
core = core.replace(target, "")

with open('js/core.js', 'w', encoding='utf-8') as f:
    f.write(core)

with open('pages/footer.html', 'r', encoding='utf-8') as f:
    footer = f.read()

# Remove the logo image from footer
footer = footer.replace('<img src="picture/logo.png" alt="Vareya Logo" style="height: 48px; width: auto; object-fit: contain;">', '')

with open('pages/footer.html', 'w', encoding='utf-8') as f:
    f.write(footer)

with open('pages/header.html', 'r', encoding='utf-8') as f:
    header = f.read()

# Only enlarge the logo image, NOT headerBell
header = header.replace('<img src="picture/logo.png" alt="Vareya Logo" style="height: 40px; width: auto; object-fit: contain;">', '<img src="picture/logo.png" alt="Vareya Logo" style="height: 56px; width: auto; object-fit: contain;">')

with open('pages/header.html', 'w', encoding='utf-8') as f:
    f.write(header)

print("Fixes carefully applied.")
