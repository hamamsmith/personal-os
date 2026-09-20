import os

with open('pages/footer.html', 'r', encoding='utf-8') as f:
    footer = f.read()

# Fix the copyright string and add the big logo back
footer = footer.replace('<span class="hidden sm:inline-block text-text-muted">', '<img src="picture/logo.png" alt="Vareya Logo" style="height: 72px; width: auto; object-fit: contain; margin-right: 16px;"><span class="hidden sm:inline-block text-text-muted">')
footer = footer.replace('Ac 2026 Vareya Inc.', '&copy; 2026 Vareya Inc.')
# Sometimes it shows as ? or some other character, just use a broad replace
import re
footer = re.sub(r'[^>]*2026 Vareya Inc\.', '&copy; 2026 Vareya Inc.', footer)

with open('pages/footer.html', 'w', encoding='utf-8') as f:
    f.write(footer)
