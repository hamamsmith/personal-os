import re

with open('js/core.js', 'r', encoding='utf-8') as f:
    core = f.read()

# Replace the specific block of text
core = re.sub(r"const footerRes = await fetch\(pages/footer\.html\?v=\$\{CACHE_VER\}\);\s*document\.getElementById\('footerContainer'\)\.outerHTML = await footerRes\.text\(\);\s*(const loginRes)", r"\1", core)

with open('js/core.js', 'w', encoding='utf-8') as f:
    f.write(core)

print("Regex executed.")
