import re

# 1. Update index.html footer
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

new_footer = """<footer class="landing-footer">
        <div class="footer-content">
            <div class="footer-left">
                <p>&copy; 2026 Personal OS &mdash; <span data-i18n="footer_tagline">Designed for focus.</span></p>
            </div>
            <div class="footer-right">
                <a href="privacy.html" target="_blank" class="footer-link" data-i18n="footer_privacy">Privacy Policy</a>
                <span class="footer-dot">&bull;</span>
                <a href="terms.html" target="_blank" class="footer-link" data-i18n="footer_terms">Terms & Conditions</a>
            </div>
        </div>
    </footer>"""

html = re.sub(r'<footer class="landing-footer">[\s\S]*?</footer>', new_footer, html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)


# 2. Update style.css
with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

footer_css = """        /* Footer */
        .landing-footer {
            position: fixed; bottom: 0; left: 0; width: 100%; z-index: 100;
            color: var(--text-muted); font-size: 14px; padding: 15px 40px;
            border-top: 1px solid var(--glass-border);
            background: rgba(11, 12, 16, 0.8); backdrop-filter: blur(10px);
            box-sizing: border-box;
        }
        .footer-content {
            display: flex; justify-content: space-between; align-items: center;
            max-width: 1200px; margin: 0 auto;
        }
        .footer-right { display: flex; align-items: center; gap: 15px; }
        .footer-link {
            color: var(--text-muted); text-decoration: none; transition: 0.3s; cursor: pointer;
        }
        .footer-link:hover { color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.5); }
        .footer-dot { color: var(--glass-border); }
        
        @media (max-width: 768px) {
            .footer-content { flex-direction: column; gap: 10px; text-align: center; }
            .landing-footer { padding: 15px 20px; }
        }"""

css = re.sub(r'/\* Footer \*/[\s\S]*?@media \(max-width: 768px\) \{', footer_css + '\n\n        @media (max-width: 768px) {', css)

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)


# 3. Update i18n.js
with open('js/i18n.js', 'r', encoding='utf-8') as f:
    i18n = f.read()

en_footer_i18n = """
        "footer_privacy": "Privacy Policy",
        "footer_terms": "Terms & Conditions",
"""

id_footer_i18n = """
        "footer_privacy": "Kebijakan Privasi",
        "footer_terms": "Syarat & Ketentuan",
"""

i18n = re.sub(r'("footer_tagline": "Designed for focus.",\s*\n)', r'\1' + en_footer_i18n, i18n)
i18n = re.sub(r'("footer_tagline": "Didesain untuk fokus.",\s*\n)', r'\1' + id_footer_i18n, i18n)

with open('js/i18n.js', 'w', encoding='utf-8') as f:
    f.write(i18n)

print("Updated footer, css, and i18n")
