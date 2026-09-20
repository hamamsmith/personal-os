import re

with open('pages/footer.html', 'r', encoding='utf-8') as f:
    footer = f.read()

# 1. Remove the image from footer completely using regex
footer = re.sub(r'<img src="picture/logo\.png"[^>]*>', '', footer)

# 2. Fix the modal triggers
footer = footer.replace('data-path="privacy-policy" href="#"', 'href="#" onclick="openPrivacyModal(); return false;"')
footer = footer.replace('data-path="terms-of-service" href="#"', 'href="#" onclick="openTermsModal(); return false;"')

with open('pages/footer.html', 'w', encoding='utf-8') as f:
    f.write(footer)

with open('pages/header.html', 'r', encoding='utf-8') as f:
    header = f.read()

# 3. Enlarge header logo to 64px
header = re.sub(r'style="height: \d+px; width: auto; object-fit: contain;"', 'style="height: 64px; width: auto; object-fit: contain;"', header)

with open('pages/header.html', 'w', encoding='utf-8') as f:
    f.write(header)

print("Fixes applied.")
