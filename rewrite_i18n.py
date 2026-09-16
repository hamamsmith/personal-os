import re

with open('js/i18n.js', 'r', encoding='utf-8') as f:
    i18n = f.read()

en_additions = """
        "feat_track_title": "Track Habits",
        "feat_track_desc": "Build consistency with a visually rewarding tracker.",
        "feat_control_title": "Take Control",
        "feat_control_desc": "Log your daily triggers, wins, and losses to master your behavior.",
        "feat_dump_title": "Brain Dump",
        "feat_dump_desc": "Instantly clear your mind and declutter your thoughts.",
        "feat_review_title": "Weekly Debrief",
        "feat_review_desc": "Reflect on your progress and plan your next strategic move.",
        "footer_tagline": "Designed for focus.",
"""

id_additions = """
        "feat_track_title": "Lacak Kebiasaan",
        "feat_track_desc": "Bangun konsistensi dengan tracker visual yang memuaskan.",
        "feat_control_title": "Ambil Kendali",
        "feat_control_desc": "Catat trigger, kemenangan, & kekalahan harian untuk menguasai dirimu.",
        "feat_dump_title": "Brain Dump",
        "feat_dump_desc": "Bebaskan beban pikiran dan rapihkan ide di kepalamu secara instan.",
        "feat_review_title": "Evaluasi Mingguan",
        "feat_review_desc": "Evaluasi progresmu dan rencanakan langkah strategis berikutnya.",
        "footer_tagline": "Didesain untuk fokus.",
"""

# Insert into EN dict
i18n = re.sub(r'("landing_subtitle": "A professional, distraction-free environment to track habits, take control, and debrief your life.",\s*\n)', r'\1' + en_additions, i18n)

# Insert into ID dict
i18n = re.sub(r'("landing_subtitle": "Lingkungan profesional dan bebas distraksi untuk melacak kebiasaan, mengambil kendali, dan mengevaluasi hidup lu.",\s*\n)', r'\1' + id_additions, i18n)

with open('js/i18n.js', 'w', encoding='utf-8') as f:
    f.write(i18n)

print("Updated i18n.js")
