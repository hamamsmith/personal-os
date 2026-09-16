import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace toggle btn with google translate element
html = re.sub(r'<div id="landingLangToggleBtn"[^>]*>EN</div>', '<div id="google_translate_element"></div>', html)

# Add google translate scripts before </body>
google_scripts = """
<!-- Google Translate -->
<script type="text/javascript">
function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
}
</script>
<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
"""
html = html.replace('</body>', google_scripts + '\n</body>')

# Remove i18n.js
html = re.sub(r'<script src="js/i18n\.js[^>]*></script>\n?', '', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
