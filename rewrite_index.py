import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the modals with a container
html = re.sub(r'<!-- PRIVACY MODAL -->[\s\S]*?</div>\n</div>', '<div id="legalModalsContainer"></div>', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
