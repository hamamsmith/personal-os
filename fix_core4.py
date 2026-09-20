import os

with open('js/core.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('js/core.js', 'w', encoding='utf-8') as f:
    for line in lines:
        if 'const footerRes' in line:
            continue
        if "document.getElementById('footerContainer').outerHTML" in line:
            # Need to keep the rest of the line if it has loginRes
            if 'const loginRes' in line:
                f.write('        const loginRes = await fetch(pages/loginScreen.html?v=);\n')
            continue
        f.write(line)
