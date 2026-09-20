import os

files = ['backend/server.js', 'api/index.js']
for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        content = content.replace('Personal OS', 'Vareya')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
