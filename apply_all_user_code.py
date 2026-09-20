import json
import re

transcript_path = r'C:\Users\Smith\.gemini\antigravity-ide\brain\8d05d5ed-887a-4700-b5b1-41dbca14ba01\.system_generated\logs\transcript_full.jsonl'

# Extract user's html snippet
html_content = ""
with open(transcript_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for line in reversed(lines):
        step = json.loads(line)
        if step.get('type') == 'USER_INPUT':
            content = step.get('content', '')
            if '<!DOCTYPE html>' in content:
                # Find the code block
                html_content = content[content.find('<!DOCTYPE html>'):]
                break

if not html_content:
    print("FAILED TO FIND HTML")
    exit(1)

# Now apply logic
# Extract header
header_match = re.search(r'<header[^>]*>.*?</header>', html_content, re.DOTALL)
header_html = header_match.group(0) if header_match else ''

# Extract main
main_match = re.search(r'<main[^>]*>.*?</main>', html_content, re.DOTALL)
main_html = main_match.group(0) if main_match else ''

# Extract footer
footer_match = re.search(r'<footer[^>]*>.*?</footer>', html_content, re.DOTALL)
footer_html = footer_match.group(0) if footer_match else ''

# --- PROCESS HEADER ---
header_html = header_html.replace('<header class="', '<header class="landing-nav ')

lang_toggle_block = r'''<div class="hidden sm:flex items-center gap-space-xs px-2.5 py-1.5 rounded-full bg-surface-subtle border border-border-subtle" onclick="toggleLanguage()" id="landingLangToggleBtn" style="cursor:pointer;">
<button class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container font-code-sm text-code-sm text-text-primary hover:text-primary transition-colors" type="button">
<span class="material-symbols-outlined text-[14px] text-secondary">language</span>
<span>EN/ID</span>
</button>
</div>'''

header_html = re.sub(
    r'<div class="hidden sm:flex items-center gap-space-xs px-2.5 py-1.5 rounded-full bg-surface-subtle border border-border-subtle">.*?</div>',
    lang_toggle_block,
    header_html,
    flags=re.DOTALL
)

user_icon_block = r'''<div class="user-dropdown-container relative">
    <button onclick="toggleUserMenu(event)" class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all" type="button">
        <span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
    </button>
    <div id="userDropdownMenu" style="display: none; position: absolute; top: 40px; right: 0; background: rgba(20, 20, 25, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 8px; width: 140px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 1001; flex-direction: column; gap: 4px;">
        <a href="#login" onclick="closeUserMenu()" style="text-decoration: none; color: white; padding: 10px 15px; border-radius: 8px; font-size: 14px; font-weight: 500; transition: 0.2s;" onmouseover="this.style.background='rgba(139, 92, 246, 0.2)'" onmouseout="this.style.background='transparent'">Sign In</a>
        <a href="#login" onclick="closeUserMenu()" style="text-decoration: none; color: white; padding: 10px 15px; border-radius: 8px; font-size: 14px; font-weight: 500; transition: 0.2s;" onmouseover="this.style.background='rgba(139, 92, 246, 0.2)'" onmouseout="this.style.background='transparent'">Sign Up</a>
    </div>
</div>'''

header_html = re.sub(
    r'<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">.*?</div>',
    user_icon_block,
    header_html,
    flags=re.DOTALL
)

header_html = header_html.replace('href="#"', 'href="#login"')

with open('pages/header.html', 'r', encoding='utf-8') as f:
    current_header = f.read()
    
new_header_file = re.sub(r'<header class="landing-nav.*?</header>', header_html, current_header, count=1, flags=re.DOTALL)
with open('pages/header.html', 'w', encoding='utf-8') as f:
    f.write(new_header_file)

# --- PROCESS MAIN ---
main_html = f'<div id="landingScreen">\n{main_html}\n</div>'
main_html = main_html.replace('href="#"', 'href="#login"')

with open('pages/landingScreen.html', 'w', encoding='utf-8') as f:
    f.write(main_html)
    
# --- PROCESS FOOTER ---
with open('pages/footer.html', 'w', encoding='utf-8') as f:
    f.write(footer_html)

print("SUCCESS")
