import re

with open('js/core.js', 'r', encoding='utf-8') as f:
    core = f.read()

# Use a broad regex to match and remove the footerRes fetching logic
core = re.sub(r'const footerRes = await fetch[^\n]*\n.*outerHTML = await footerRes\.text\(\); ', '', core)

with open('js/core.js', 'w', encoding='utf-8') as f:
    f.write(core)

print("Regex removal applied.")
