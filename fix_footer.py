import re

with open('pages/footer.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the copyright text without using the special symbol
content = content.replace('2026 PersonalOS Inc.', '2026 Vareya Inc.')

# Make the logo larger
content = content.replace('height: 28px;', 'height: 48px;')

with open('pages/footer.html', 'w', encoding='utf-8') as f:
    f.write(content)

with open('pages/header.html', 'r', encoding='utf-8') as f:
    content2 = f.read()

# Make the header logo slightly larger too if needed
content2 = content2.replace('height: 36px;', 'height: 40px;')

with open('pages/header.html', 'w', encoding='utf-8') as f:
    f.write(content2)

print("Footer fixed!")
