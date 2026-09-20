import os

with open('js/core.js', 'r', encoding='utf-8') as f:
    core = f.read()

target = "document.getElementById('loginScreenContainer').outerHTML = await loginRes.text();"
replacement = "const loginRes = await fetch(pages/loginScreen.html?v=);\n        " + target

core = core.replace(target, replacement)

with open('js/core.js', 'w', encoding='utf-8') as f:
    f.write(core)
