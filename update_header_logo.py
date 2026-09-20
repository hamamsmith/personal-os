import re

with open('pages/header.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific HTML logo block
logo_pattern = r'<div class="w-9 h-9 rounded-lg bg-surface-subtle border border-border-highlight flex items-center justify-center shadow-\[0_0_12px_rgba\(139,92,246,0\.25\)\]"><span class="material-symbols-outlined text-primary text-\[20px\]">deployed_code</span></div><div class="flex items-center gap-space-xs"><span class="font-headline-sm text-headline-sm text-text-primary tracking-tight">Personal<span class="text-primary">OS</span></span>'
new_logo = r'<img src="picture/logo.png" alt="Vareya Logo" style="height: 36px; width: auto; object-fit: contain;">'

content = re.sub(logo_pattern, new_logo, content)

with open('pages/header.html', 'w', encoding='utf-8') as f:
    f.write(content)
