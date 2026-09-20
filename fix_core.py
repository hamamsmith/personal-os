import os

with open('js/core.js', 'r', encoding='utf-8') as f:
    core = f.read()

# Just remove the string literally
target = "const footerRes = await fetch(pages/footer.html?v=); \ndocument.getElementById('footerContainer').outerHTML = await footerRes.text(); "
core = core.replace(target, "")

with open('js/core.js', 'w', encoding='utf-8') as f:
    f.write(core)
