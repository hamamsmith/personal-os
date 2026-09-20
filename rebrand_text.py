import os
import re

files_to_rebrand = [
    'index.html',
    'js/core.js',
    'sw.js',
    'pages/landingScreen.html',
    'pages/legalModals.html'
]

for file in files_to_rebrand:
    if os.path.exists(file):
        try:
            with open(file, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
            with open(file, 'r', encoding='windows-1252') as f:
                content = f.read()
        
        # Replace PersonalOS and Personal OS
        content = re.sub(r'Personal\s?OS', 'Vareya', content, flags=re.IGNORECASE)
        
        if file == 'index.html':
            content = content.replace('"primary": "#d0bcff"', '"primary": "#8b5cf6"')
            content = content.replace('"primary-container": "#a078ff"', '"primary-container": "#5b21b6"')
            
            content = content.replace('"secondary": "#4cd7f6"', '"secondary": "#E2C275"')
            content = content.replace('"secondary-container": "#03b5d3"', '"secondary-container": "#D4AF37"')
            
            content = content.replace('"tertiary": "#4edea3"', '"tertiary": "#F6AD55"')
            content = content.replace('"tertiary-container": "#00a572"', '"tertiary-container": "#C05621"')
            
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Updated {file}")

print("Rebranding text replacements complete.")
