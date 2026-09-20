import json

transcript_path = r'C:\Users\Smith\.gemini\antigravity-ide\brain\8d05d5ed-887a-4700-b5b1-41dbca14ba01\.system_generated\logs\transcript_full.jsonl'

with open(transcript_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for line in reversed(lines):
        step = json.loads(line)
        if step.get('type') == 'USER_INPUT':
            print("USER INPUT FOUND (length):", len(step.get('content', '')))
            print("PREFIX:", step.get('content', '')[:100])
