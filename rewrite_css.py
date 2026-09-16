import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace the old landing screen base styles
old_css_regex = r"/\* Landing Screen Base Styles \*/[\s\S]*?\.landing-features \{[\s\S]*?\}"

new_css = """/* Landing Screen Base Styles */
        #landingScreen {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            display: none; opacity: 0; pointer-events: none;
            z-index: 9999; transition: opacity 0.5s ease;
            background: rgba(11, 12, 16, 0.6);
            backdrop-filter: blur(15px);
            overflow-y: auto; overflow-x: hidden;
            color: var(--text-main);
        }
        
        .landing-nav {
            display: flex; justify-content: space-between; align-items: center;
            padding: 20px 40px; position: sticky; top: 0; z-index: 10;
            background: linear-gradient(to bottom, rgba(11, 12, 16, 0.9), transparent);
        }
        .landing-logo { font-size: 24px; font-weight: 800; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px; }
        .landing-logo span { color: var(--brand); }
        .landing-lang-btn {
            cursor: pointer; font-weight: 700; color: var(--text-muted); font-size: 14px;
            background: rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 8px;
            border: 1px solid var(--glass-border); transition: 0.3s;
        }
        .landing-lang-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

        .landing-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        
        /* Hero Section */
        .landing-hero {
            display: flex; align-items: center; justify-content: space-between;
            min-height: 70vh; gap: 40px; margin-bottom: 80px;
        }
        .hero-content { flex: 1; max-width: 600px; }
        .landing-title { font-size: 64px; font-weight: 800; font-family: 'Outfit', sans-serif; line-height: 1.1; margin-bottom: 20px; background: linear-gradient(135deg, #fff, var(--brand)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .landing-subtitle { font-size: 20px; color: var(--text-muted); line-height: 1.6; margin-bottom: 40px; }
        
        .hero-cta-wrapper { display: flex; gap: 20px; align-items: center; }
        .btn-enter {
            background: var(--brand); color: #fff; font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700;
            padding: 16px 40px; border: none; border-radius: 12px; cursor: pointer; transition: 0.3s;
            box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4); letter-spacing: 1px;
        }
        .btn-enter:hover { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(124, 58, 237, 0.6); }
        
        .pulse-fx { animation: pulseBtn 2s infinite; }
        @keyframes pulseBtn { 0% { box-shadow: 0 0 0 0 rgba(124,58,237, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(124,58,237, 0); } 100% { box-shadow: 0 0 0 0 rgba(124,58,237, 0); } }

        /* Abstract Mockup */
        .hero-mockup { flex: 1; position: relative; display: flex; justify-content: center; }
        .mockup-window {
            width: 100%; max-width: 500px; height: 350px; background: rgba(0,0,0,0.4);
            border: 1px solid var(--glass-border); border-radius: 16px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5); backdrop-filter: blur(20px);
            display: flex; flex-direction: column; overflow: hidden; position: relative; z-index: 2;
            transform: perspective(1000px) rotateY(-10deg) rotateX(5deg);
            transition: transform 0.5s ease;
        }
        .mockup-window:hover { transform: perspective(1000px) rotateY(0deg) rotateX(0deg); }
        .mockup-header { height: 30px; border-bottom: 1px solid var(--glass-border); display: flex; align-items: center; padding: 0 15px; gap: 8px; }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot.red { background: #ff5f56; } .dot.yellow { background: #ffbd2e; } .dot.green { background: #27c93f; }
        .mockup-body { display: flex; flex: 1; padding: 15px; gap: 15px; }
        .mockup-sidebar { width: 60px; border-radius: 8px; background: rgba(255,255,255,0.05); }
        .mockup-main { flex: 1; display: flex; flex-direction: column; gap: 15px; }
        .mockup-chart { flex: 1; border-radius: 8px; background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(255,255,255,0.02)); }
        .mockup-cards { display: flex; gap: 10px; height: 80px; }
        .mockup-card { flex: 1; border-radius: 8px; background: rgba(255,255,255,0.05); }
        .mockup-glow {
            position: absolute; width: 100%; height: 100%; background: var(--brand);
            filter: blur(100px); opacity: 0.3; z-index: 1; top: 0; left: 0; border-radius: 50%;
        }

        /* Features Section */
        .landing-features-grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin-bottom: 80px;
        }
        .feature-card {
            background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 16px;
            padding: 30px; transition: 0.3s;
        }
        .feature-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.06); border-color: rgba(124,58,237,0.5); }
        .feature-icon { font-size: 32px; margin-bottom: 20px; }
        .feature-card h3 { font-size: 22px; font-weight: 700; margin-bottom: 10px; }
        .feature-card p { color: var(--text-muted); line-height: 1.5; }

        /* Footer */
        .landing-footer { text-align: center; color: var(--text-muted); font-size: 14px; padding-top: 40px; border-top: 1px solid var(--glass-border); }
        
        @media (max-width: 768px) {
            .landing-hero { flex-direction: column; text-align: center; margin-top: 20px; }
            .hero-cta-wrapper { justify-content: center; }
            .landing-title { font-size: 48px; }
            .mockup-window { transform: none; }
            .mockup-window:hover { transform: none; }
        }
"""

css = re.sub(old_css_regex, new_css, css)

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Updated style.css")
