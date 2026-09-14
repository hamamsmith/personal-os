import os
from bs4 import BeautifulSoup

with open('index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

os.makedirs('pages', exist_ok=True)

# List of components to extract
components = [
    'landingScreen',
    'loginScreen',
    'dashboard',
    'battle',
    'braindump',
    'debrief',
    'screentime',
    'weekly'
]

for comp_id in components:
    elem = soup.find(id=comp_id)
    if elem:
        if comp_id == 'landingScreen':
            # Add lang toggle to landing screen
            btn_html = '<div id="landingLangToggleBtn" onclick="toggleLanguage()" style="position:absolute; top:20px; right:20px; cursor:pointer; font-weight:700; color:var(--text-muted); font-size: 14px; background: rgba(255,255,255,0.05); padding: 5px 10px; border-radius: 8px; border: 1px solid var(--glass-border); z-index:99999;">EN</div>'
            elem.insert(0, BeautifulSoup(btn_html, 'html.parser'))

        with open(f'pages/{comp_id}.html', 'w', encoding='utf-8') as f:
            f.write(str(elem))
        
        # We will dynamically inject them, but to keep the layout, we should leave placeholders.
        # However, for SPA, we can just empty the containers.
        if comp_id in ['dashboard', 'battle', 'braindump', 'debrief', 'screentime', 'weekly']:
            elem.extract()
        else:
            # For landing and login, they are outside main-content
            new_elem = soup.new_tag('div')
            new_elem['id'] = f"{comp_id}Container"
            elem.replace_with(new_elem)

# Let's keep main-content empty, except for placeholders or just let the loader inject directly.
# Wait, main-content had pages inside. We extracted them all.
main_content = soup.find(id='main-content')
if main_content:
    main_content.clear()

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))

print("HTML Components extracted successfully!")
