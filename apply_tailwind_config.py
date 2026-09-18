import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the duplication at the top
content = re.sub(r'<!DOCTYPE html>.*?</script>\s*<!DOCTYPE html>', '<!DOCTYPE html>', content, flags=re.DOTALL)

# Add tailwind and fonts
head_insert = '''
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@500;600;700&display=swap" rel="stylesheet"/>
<style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style>
<script src="https://cdn.tailwindcss.com"></script>
<script id="tailwind-config">
tailwind.config = {
    "corePlugins": { "preflight": false },
    "darkMode": "class",
    "theme": {
        "extend": {
            "colors": {
                "primary-fixed-dim": "#d0bcff", "border-highlight": "rgba(139, 92, 246, 0.3)", "surface": "#11131C", "on-secondary": "#003640", "secondary": "#4cd7f6", "surface-subtle": "#171A26", "surface-variant": "#34343a", "surface-container-low": "#1a1b21", "text-secondary": "#94A3B8", "on-primary-container": "#340080", "secondary-fixed-dim": "#4cd7f6", "on-tertiary-fixed-variant": "#005236", "inverse-surface": "#e3e1e9", "surface-container": "#1e1f25", "on-primary": "#3c0091", "primary-fixed": "#e9ddff", "on-primary-fixed": "#23005c", "primary": "#d0bcff", "border-subtle": "rgba(255, 255, 255, 0.08)", "on-secondary-fixed-variant": "#004e5c", "on-secondary-fixed": "#001f26", "text-primary": "#F8FAFC", "surface-bright": "#38393f", "on-error-container": "#ffdad6", "surface-container-highest": "#34343a", "text-muted": "#64748B", "tertiary-fixed": "#6ffbbe", "surface-tint": "#d0bcff", "surface-dim": "#121318", "background": "#121318", "on-error": "#690005", "on-secondary-container": "#00424e", "error": "#ffb4ab", "on-tertiary-fixed": "#002113", "tertiary-container": "#00a572", "secondary-container": "#03b5d3", "on-surface": "#e3e1e9", "outline": "#958ea0", "on-surface-variant": "#cbc3d7", "surface-container-lowest": "#0d0e13", "on-background": "#e3e1e9", "on-primary-fixed-variant": "#5516be", "inverse-primary": "#6d3bd7", "secondary-fixed": "#acedff", "primary-glow": "rgba(139, 92, 246, 0.35)", "on-tertiary": "#003824", "primary-container": "#a078ff", "inverse-on-surface": "#2f3036", "tertiary-fixed-dim": "#4edea3", "on-tertiary-container": "#00311f", "error-container": "#93000a", "surface-container-high": "#292a2f", "tertiary": "#4edea3", "outline-variant": "#494454"
            },
            "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
            "spacing": { "margin": "2rem", "space-xs": "0.25rem", "margin-mobile": "1rem", "space-sm": "0.5rem", "gutter": "1.25rem", "space-xl": "2.5rem", "space-lg": "1.5rem", "space-md": "1rem", "gutter-mobile": "0.75rem" },
            "fontFamily": { "body-md": ["Inter"], "code-sm": ["JetBrains Mono"], "headline-sm": ["Outfit"], "body-sm": ["Inter"], "label-sm": ["Inter"], "headline-lg": ["Outfit"], "headline-md": ["Outfit"], "display-lg-mobile": ["Outfit"], "body-lg": ["Inter"], "label-md": ["Inter"], "display-lg": ["Outfit"] },
            "fontSize": { "body-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0em", "fontWeight": "400"}], "code-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "-0.01em", "fontWeight": "500"}], "headline-sm": ["20px", {"lineHeight": "28px", "letterSpacing": "-0.01em", "fontWeight": "600"}], "body-sm": ["12px", {"lineHeight": "18px", "letterSpacing": "0.01em", "fontWeight": "400"}], "label-sm": ["11px", {"lineHeight": "14px", "letterSpacing": "0.04em", "fontWeight": "600"}], "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "600"}], "headline-md": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.015em", "fontWeight": "600"}], "display-lg-mobile": ["36px", {"lineHeight": "44px", "letterSpacing": "-0.025em", "fontWeight": "700"}], "body-lg": ["16px", {"lineHeight": "24px", "letterSpacing": "-0.005em", "fontWeight": "400"}], "label-md": ["13px", {"lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "500"}], "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.03em", "fontWeight": "700"}] }
        }
    }
};
</script>
'''

content = content.replace('</head>', head_insert + '</head>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
