import re

temp_html_path = r'C:\Users\Smith\.gemini\antigravity-ide\brain\8d05d5ed-887a-4700-b5b1-41dbca14ba01\temp_code.html'

with open(temp_html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

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

lang_toggle_block = r'''<div id="landingLangToggleBtn" onclick="toggleLanguage()" class="hidden sm:flex items-center gap-space-xs px-1 py-1 rounded-full bg-surface-subtle border border-border-subtle cursor-pointer hover:border-primary transition-colors">
            <img src="https://flagcdn.com/w40/gb.png" alt="en" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1px solid var(--glass-border); display: block;">
        </div>'''

header_html = re.sub(
    r'<div class="hidden sm:flex items-center gap-space-xs px-2.5 py-1.5 rounded-full bg-surface-subtle border border-border-subtle">.*?</div>',
    lang_toggle_block,
    header_html,
    flags=re.DOTALL
)

user_icon_block = r'''<div class="user-dropdown-container relative">
    <button onclick="toggleUserMenu(event)" class="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all" type="button">
        <span class="material-symbols-outlined text-on-primary text-[20px]">person</span>
    </button>
    <div id="userDropdownMenu" style="display: none; position: absolute; top: 50px; right: 0; background: rgba(20, 20, 25, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 8px; width: 140px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 1001; flex-direction: column; gap: 4px;">
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

# Replace 'href="#"' with 'href="#login"'
header_html = header_html.replace('href="#"', 'href="#login"')

with open('pages/header.html', 'r', encoding='utf-8') as f:
    current_header = f.read()
    
# Replace ONLY the landing-nav block
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
