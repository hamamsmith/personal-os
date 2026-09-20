import re

with open(r'C:\Users\Smith\.gemini\antigravity-ide\brain\8d05d5ed-887a-4700-b5b1-41dbca14ba01\temp_code.html', 'r', encoding='utf-8') as f:
    temp_html = f.read()

# count the number of badges and sections in temp_html vs landingScreen.html
with open('pages/landingScreen.html', 'r', encoding='utf-8') as f:
    landing_html = f.read()

print(f'temp_html length: {len(temp_html)}')
print(f'landing_html length: {len(landing_html)}')

temp_sections = len(re.findall(r'<section', temp_html))
landing_sections = len(re.findall(r'<section', landing_html))
print(f'Sections in temp: {temp_sections}, in landing: {landing_sections}')

temp_badges = len(re.findall(r'Badge Pill', temp_html))
landing_badges = len(re.findall(r'Badge Pill', landing_html))
print(f'Badges in temp: {temp_badges}, in landing: {landing_badges}')

