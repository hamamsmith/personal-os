import re

# Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    r'<h3 style="margin-bottom: 0;">Take Control</h3>': r'<h3 style="margin-bottom: 0;" data-i18n="modal_battle_title">Take Control</h3>',
    r'<label>1\. Tanggal \(Hari ini/Kemarin\)</label>': r'<label data-i18n="lbl_battle_date">1. Date (Today/Yesterday)</label>',
    r'<label>2\. Pilih Trigger</label>': r'<label data-i18n="lbl_battle_trigger">2. Select Trigger</label>',
    r'<option disabled="" selected="" value="">Pilih trigger\.\.\.</option>': r'<option disabled="" selected="" value="" data-i18n="opt_battle_trigger_default">Select trigger...</option>',
    r'placeholder="Ketik trigger lu di sini\.\.\."': r'placeholder="Type your trigger here..." data-i18n="ph_battle_custom_trigger"',
    r'<label>3\. Hasil</label>': r'<label data-i18n="lbl_battle_outcome">3. Outcome</label>',
    r'✅ Berhasil</div>': r'✅ Win</div>',
    r'onclick="selectRadio\(this, \'battleOutcome\'\)">✅ Win': r'data-i18n="lbl_battle_win" onclick="selectRadio(this, \'battleOutcome\')">✅ Win',
    r'❌ Gagal</div>': r'❌ Lose</div>',
    r'onclick="selectRadio\(this, \'battleOutcome\'\)">❌ Lose': r'data-i18n="lbl_battle_lose" onclick="selectRadio(this, \'battleOutcome\')">❌ Lose',
    r'<label>4\. Catatan \(Opsional\)</label>': r'<label data-i18n="lbl_battle_note">4. Notes (Optional)</label>',
    r'placeholder="Tulis konteks singkat\.\.\."': r'placeholder="Write brief context..." data-i18n="ph_battle_note"',
    r'>SIMPAN</button>': r'>SAVE</button>',
    r'onclick="submitBattle\(\)">SAVE': r'data-i18n="btn_save" onclick="submitBattle()">SAVE',
}

for k, v in replacements.items():
    content = re.sub(k, v, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

# Update i18n.js
with open('js/i18n.js', 'r', encoding='utf-8') as f:
    i18n = f.read()

# Add to English dictionary
en_additions = """
        "modal_battle_title": "Take Control",
        "lbl_battle_date": "1. Date (Today/Yesterday)",
        "lbl_battle_trigger": "2. Select Trigger",
        "opt_battle_trigger_default": "Select trigger...",
        "ph_battle_custom_trigger": "Type your trigger here...",
        "lbl_battle_outcome": "3. Outcome",
        "lbl_battle_win": "✅ Win",
        "lbl_battle_lose": "❌ Lose",
        "lbl_battle_note": "4. Notes (Optional)",
        "ph_battle_note": "Write brief context...",
        "btn_save": "SAVE",
"""

# Add to Indonesian dictionary
id_additions = """
        "modal_battle_title": "Ambil Kendali",
        "lbl_battle_date": "1. Tanggal (Hari ini/Kemarin)",
        "lbl_battle_trigger": "2. Pilih Trigger",
        "opt_battle_trigger_default": "Pilih trigger...",
        "ph_battle_custom_trigger": "Ketik trigger lu di sini...",
        "lbl_battle_outcome": "3. Hasil",
        "lbl_battle_win": "✅ Berhasil",
        "lbl_battle_lose": "❌ Gagal",
        "lbl_battle_note": "4. Catatan (Opsional)",
        "ph_battle_note": "Tulis konteks singkat...",
        "btn_save": "SIMPAN",
"""

i18n = re.sub(r'("lang_toggle": "EN / ID"\s*\n)', r'\1' + en_additions, i18n)
i18n = re.sub(r'("lang_toggle": "ID / EN"\s*\n)', r'\1' + id_additions, i18n)

with open('js/i18n.js', 'w', encoding='utf-8') as f:
    f.write(i18n)

print("i18n updated successfully")
