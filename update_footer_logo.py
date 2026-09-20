import re

with open('pages/footer.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the text logo and fix the copyright string
logo_pattern = r'<span class="font-headline-sm text-headline-sm text-text-primary tracking-tight">Personal<span class="text-primary">OS</span></span>'
new_logo = r'<img src="picture/logo.png" alt="Vareya Logo" style="height: 28px; width: auto; object-fit: contain;">'

content = re.sub(logo_pattern, new_logo, content)

content = content.replace('Ac 2026 PersonalOS Inc.', '&copy; 2026 Vareya Inc.')

with open('pages/footer.html', 'w', encoding='utf-8') as f:
    f.write(content)
