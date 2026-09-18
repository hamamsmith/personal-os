import re

with open('pages/header.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_header = '''<header class="landing-nav fixed top-0 left-0 w-full z-50 bg-surface/85 backdrop-blur-xl border-b border-border-subtle shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
<div class="h-20 w-full px-margin flex items-center justify-between gap-space-md">
    <div class="flex items-center gap-space-lg">
        <a class="flex items-center gap-space-sm group" data-path="overview" href="#">
            <div class="w-9 h-9 rounded-lg bg-surface-subtle border border-border-highlight flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.25)]">
                <span class="material-symbols-outlined text-primary text-[20px]">deployed_code</span>
            </div>
            <div class="flex items-center gap-space-xs">
                <span class="font-headline-sm text-headline-sm text-text-primary tracking-tight">Personal<span class="text-primary">OS</span></span>
                <span class="px-2 py-0.5 rounded-full bg-primary/10 border border-border-highlight text-primary font-code-sm text-code-sm uppercase tracking-wider">v2.6</span>
            </div>
        </a>
        <nav class="hidden lg:flex items-center gap-1" data-active-classes="bg-primary-container text-on-primary-container font-semibold rounded-lg">
            <a class="px-3 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-subtle transition-colors" href="#features">Features</a>
            <a class="px-3 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-subtle transition-colors" href="#architecture">Architecture</a>
            <a class="px-3 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-subtle transition-colors" href="#framework">Framework</a>
        </nav>
    </div>
    
    <div class="flex items-center gap-space-md">
        <!-- Language Toggle -->
        <div id="landingLangToggleBtn" onclick="toggleLanguage()" class="flex items-center justify-center w-9 h-9 rounded-full bg-surface-subtle border border-border-subtle cursor-pointer hover:border-primary transition-colors">
            <img src="https://flagcdn.com/w40/gb.png" alt="en" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">
        </div>

        <a class="hidden sm:flex items-center gap-space-xs px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all" data-path="enter-system" href="#login">
            <span class="material-symbols-outlined text-[16px]">terminal</span><span>Mulai Sekarang</span>
        </a>

        <!-- User Dropdown -->
        <div class="user-dropdown-container relative">
            <button onclick="toggleUserMenu(event)" class="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all" type="button">
                <span class="material-symbols-outlined text-on-primary text-[20px]">person</span>
            </button>
            <div id="userDropdownMenu" style="display: none; position: absolute; top: 50px; right: 0; background: rgba(20, 20, 25, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 8px; width: 140px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 1001; flex-direction: column; gap: 4px;">
                <a href="#login" onclick="closeUserMenu()" style="text-decoration: none; color: white; padding: 10px 15px; border-radius: 8px; font-size: 14px; font-weight: 500; transition: 0.2s;" onmouseover="this.style.background='rgba(139, 92, 246, 0.2)'" onmouseout="this.style.background='transparent'">Sign In</a>
                <a href="#login" onclick="closeUserMenu()" style="text-decoration: none; color: white; padding: 10px 15px; border-radius: 8px; font-size: 14px; font-weight: 500; transition: 0.2s;" onmouseover="this.style.background='rgba(139, 92, 246, 0.2)'" onmouseout="this.style.background='transparent'">Sign Up</a>
            </div>
        </div>
    </div>
</div>
</header>'''

# Replace everything from <nav class="landing-nav"> to </nav>
content = re.sub(r'<nav class="landing-nav">.*?</nav>', new_header, content, flags=re.DOTALL)

with open('pages/header.html', 'w', encoding='utf-8') as f:
    f.write(content)
