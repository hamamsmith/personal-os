import os
import re

html_path = "index.html"
with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

os.makedirs("css", exist_ok=True)
os.makedirs("js", exist_ok=True)

css_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
if css_match:
    css_content = css_match.group(1).strip()
    with open("css/style.css", "w", encoding="utf-8") as f:
        f.write(css_content)
    content = re.sub(r'<style>.*?</style>', '<link rel="stylesheet" href="css/style.css">', content, flags=re.DOTALL)

script_matches = re.findall(r'<script>(.*?)</script>', content, re.DOTALL)
full_js = ""
for match in script_matches:
    full_js += match.strip() + "\n\n"

if full_js:
    with open("js/app.js", "w", encoding="utf-8") as f:
        f.write(full_js)
    content = re.sub(r'<script>.*?</script>', '', content, flags=re.DOTALL)
    content = content.replace("</body>", '    <script src="js/app.js"></script>\n</body>')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Modularization complete!")
