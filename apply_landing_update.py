import re

with open('pages/landingScreen.html', 'w', encoding='utf-8') as f:
    f.write('''<div id="landingScreen">
    <main class="w-full pt-20 bg-background text-on-surface">
        <div class="flex flex-col w-full">
            <!-- SECTION 1: AMBIENT HERO -->
            <section class="relative w-full px-margin pt-space-xl pb-space-xl overflow-hidden">
                <!-- Atmospheric Glow Mesh -->
                <div class="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-gradient-to-b from-primary-glow/30 via-primary-glow/10 to-transparent blur-3xl opacity-80 -z-10 rounded-full"></div>
                <div class="pointer-events-none absolute top-48 left-12 w-80 h-80 bg-secondary/10 blur-[120px] rounded-full -z-10"></div>
                <div class="pointer-events-none absolute top-64 right-16 w-96 h-96 bg-primary/10 blur-[140px] rounded-full -z-10"></div>
                
                <div class="max-w-5xl mx-auto flex flex-col items-center text-center">
                    <!-- Badge Pill -->
                    <div class="inline-flex items-center gap-space-sm px-4 py-1.5 rounded-full bg-surface-subtle/80 backdrop-blur-md shadow-md">
                        <span class="inline-flex items-center justify-center w-2 h-2 rounded-full bg-primary animate-ping"></span>
                        <span class="font-code-sm text-code-sm text-text-primary uppercase tracking-widest">PersonalOS 2.0 • The Operating System for High Agency Individuals</span>
                    </div>
                    
                    <!-- Main Headline with Gradient Sheen -->
                    <h1 class="mt-space-lg font-display-lg text-display-lg text-text-primary tracking-tight max-w-4xl">
                        Elevate Your Routine. <br/>
                        <span class="bg-gradient-to-r from-text-primary via-primary to-secondary bg-clip-text text-transparent">Master Your Internal State.</span>
                    </h1>
                    
                    <!-- Subtitle -->
                    <p class="mt-space-md font-body-lg text-body-lg text-text-secondary max-w-2xl">
                        A distraction-free, privacy-first command center to track non-negotiable habits, log behavioral triggers, clear mental noise, and execute strategic weekly debriefs.
                    </p>
                    
                    <!-- Dual CTAs -->
                    <div class="mt-space-xl flex flex-wrap items-center justify-center gap-space-md">
                        <a class="group relative flex items-center gap-space-sm px-6 py-3.5 rounded-xl bg-primary-container text-on-primary font-label-md text-label-md font-semibold shadow-xl hover:shadow-[0_0_30px_rgba(139,92,246,0.45)] transition-all" href="#login">
                            <span class="material-symbols-outlined text-[18px]">terminal</span>
                            <span>ENTER SYSTEM</span>
                            <span class="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                        </a>
                    </div>
                    
                    <!-- Trust Badge Telemetry Row -->
                    <div class="mt-space-xl pt-space-lg flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-code-sm text-code-sm text-text-muted">
                        <div class="flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                            <span>Zero Tracking • Clean Room Vault</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                            <span>Local-First AES-GCM Encryption</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            <span>Real-time PWA Telemetry Sync</span>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- SECTION 2: HIGH-FIDELITY DASHBOARD MOCKUP -->
            <section class="relative w-full px-margin pb-space-xl" id="demo-preview">
                <div class="max-w-6xl mx-auto">
                    <!-- Decorative Backdrop Radial -->
                    <div class="relative rounded-2xl bg-surface-subtle/70 backdrop-blur-xl shadow-2xl p-2 sm:p-3">
                        <!-- Titanium Window Shell -->
                        <div class="w-full bg-surface-container-lowest rounded-xl overflow-hidden shadow-inner flex flex-col">
                            <!-- Window Header Bar -->
                            <div class="h-11 bg-surface-container-low px-4 flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 rounded-full bg-[#FF5F56]/80 inline-block shadow-sm"></span>
                                    <span class="w-3 h-3 rounded-full bg-[#FFBD2E]/80 inline-block shadow-sm"></span>
                                    <span class="w-3 h-3 rounded-full bg-[#27C93F]/80 inline-block shadow-sm"></span>
                                </div>
                                <div class="flex items-center gap-2 px-3 py-1 rounded-md bg-surface-subtle font-code-sm text-code-sm text-text-secondary">
                                    <span class="material-symbols-outlined text-[14px] text-primary">lock</span>
                                    <span>personalos://dashboard/live</span>
                                </div>
                                <div class="flex items-center gap-3 text-text-muted font-code-sm text-code-sm">
                                    <span class="inline-flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-tertiary"></span>SYNCED</span>
                                    <span class="material-symbols-outlined text-[16px]">tune</span>
                                </div>
                            </div>
                            <!-- Window Inner Workspace: Dock + Main Canvas -->
                            <div class="flex w-full min-h-[440px]">
                                <!-- Left Mini Dock -->
                                <div class="hidden md:flex flex-col justify-between items-center w-16 py-4 bg-surface-subtle/50">
                                    <div class="flex flex-col items-center gap-4">
                                        <button class="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center shadow-inner"><span class="material-symbols-outlined text-[20px]">view_quilt</span></button>
                                        <button class="w-10 h-10 rounded-lg text-text-muted flex items-center justify-center"><span class="material-symbols-outlined text-[20px]">radar</span></button>
                                        <button class="w-10 h-10 rounded-lg text-text-muted flex items-center justify-center"><span class="material-symbols-outlined text-[20px]">edit_note</span></button>
                                        <button class="w-10 h-10 rounded-lg text-text-muted flex items-center justify-center"><span class="material-symbols-outlined text-[20px]">insights</span></button>
                                    </div>
                                    <div class="flex flex-col items-center gap-3">
                                        <span class="material-symbols-outlined text-[18px] text-text-muted">settings</span>
                                        <div class="w-7 h-7 rounded-full bg-surface-bright flex items-center justify-center font-code-sm text-code-sm text-primary font-bold">P</div>
                                    </div>
                                </div>
                                <!-- Live Dashboard Body -->
                                <div class="flex-1 p-space-md grid grid-cols-1 lg:grid-cols-12 gap-space-md bg-surface/90">
                                    <div class="lg:col-span-7 bg-surface-subtle/80 rounded-xl p-space-md flex flex-col justify-between shadow-sm">
                                        <div>
                                            <div class="flex items-center justify-between mb-space-sm">
                                                <div class="flex items-center gap-2">
                                                    <span class="material-symbols-outlined text-primary text-[18px]">routine</span>
                                                    <span class="font-headline-sm text-headline-sm text-text-primary">Habit Matrix</span>
                                                </div>
                                                <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-code-sm text-code-sm">Week 42 • 92% Focus</span>
                                            </div>
                                            <div class="space-y-3">
                                                <div class="p-2.5 rounded-lg bg-surface-container flex items-center justify-between gap-2">
                                                    <div class="flex items-center gap-3 min-w-0">
                                                        <span class="material-symbols-outlined text-secondary text-[18px]">wb_twilight</span>
                                                        <div class="truncate">
                                                            <p class="font-label-md text-label-md text-text-primary truncate">Circadian Sunlight + Hydration</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="p-2.5 rounded-lg bg-surface-container flex items-center justify-between gap-2">
                                                    <div class="flex items-center gap-3 min-w-0">
                                                        <span class="material-symbols-outlined text-primary text-[18px]">bolt</span>
                                                        <div class="truncate">
                                                            <p class="font-label-md text-label-md text-text-primary truncate">90m Deep Focus Sprint</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- RIGHT PANEL -->
                                    <div class="lg:col-span-5 flex flex-col gap-space-md">
                                        <div class="p-space-md rounded-xl bg-surface-subtle/80 flex flex-col justify-between shadow-sm">
                                            <div class="flex items-center justify-between mb-2">
                                                <span class="font-headline-sm text-headline-sm text-text-primary flex items-center gap-2">
                                                    <span class="material-symbols-outlined text-secondary text-[18px]">psychology_alt</span>
                                                    Trigger Telemetry
                                                </span>
                                            </div>
                                            <div class="my-2 flex items-center justify-between bg-surface-container p-3 rounded-lg">
                                                <div class="flex flex-col">
                                                    <span class="font-body-sm text-body-sm text-text-muted">Primary Resistance Point</span>
                                                    <span class="font-label-md text-label-md text-text-primary">Afternoon Dopamine Seeking</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- SECTION 3: 4 CORE ARCHITECTURAL MODULES -->
            <section class="w-full px-margin py-space-xl bg-surface-subtle/30" id="features">
                <div class="max-w-6xl mx-auto">
                    <div class="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-4">
                        <div>
                            <div class="inline-flex items-center gap-2 text-primary font-code-sm text-code-sm uppercase tracking-wider mb-2">
                                <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                Telemetry Architecture
                            </div>
                            <h2 class="font-headline-lg text-headline-lg text-text-primary">Engineered for Radical Self-Governance</h2>
                        </div>
                        <p class="font-body-md text-body-md text-text-secondary max-w-md">
                            Conventional productivity tools optimize for vanity checklists. PersonalOS treats your cognition, habits, and psychology as an integrated operating stack.
                        </p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                        <div class="group p-space-lg rounded-2xl bg-surface-subtle border border-border-subtle hover:border-border-highlight transition-all shadow-md">
                            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary transition-all mb-space-md">
                                <span class="material-symbols-outlined text-[22px] group-hover:text-white">all_inclusive</span>
                            </div>
                            <h3 class="font-headline-md text-headline-md text-text-primary mb-2">Autonomous Habit Engine</h3>
                            <p class="font-body-md text-body-md text-text-secondary">Construct flexible micro-rituals tied to circadian biological markers. Track uninterrupted momentum without shame when life demands variance.</p>
                        </div>
                        <div class="group p-space-lg rounded-2xl bg-surface-subtle border border-border-subtle hover:border-border-highlight transition-all shadow-md">
                            <div class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary transition-all mb-space-md">
                                <span class="material-symbols-outlined text-[22px] group-hover:text-white">radar</span>
                            </div>
                            <h3 class="font-headline-md text-headline-md text-text-primary mb-2">Behavioral Trigger Radar</h3>
                            <p class="font-body-md text-body-md text-text-secondary">Intercept self-sabotage at the origin. Log physiological and contextual triggers within three taps and watch pattern-matching reveal internal blindspots.</p>
                        </div>
                        <div class="group p-space-lg rounded-2xl bg-surface-subtle border border-border-subtle hover:border-border-highlight transition-all shadow-md">
                            <div class="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:bg-tertiary transition-all mb-space-md">
                                <span class="material-symbols-outlined text-[22px] group-hover:text-white">filter_drama</span>
                            </div>
                            <h3 class="font-headline-md text-headline-md text-text-primary mb-2">Stream of Thought (Brain Dump)</h3>
                            <p class="font-body-md text-body-md text-text-secondary">Zero-friction cognitive offloading. Unload racing thoughts, unresolved threads, and spontaneous insights into a localized buffer that synthesizes automatically.</p>
                        </div>
                        <div class="group p-space-lg rounded-2xl bg-surface-subtle border border-border-subtle hover:border-border-highlight transition-all shadow-md">
                            <div class="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-fixed group-hover:bg-primary-container transition-all mb-space-md">
                                <span class="material-symbols-outlined text-[22px] group-hover:text-white">auto_graph</span>
                            </div>
                            <h3 class="font-headline-md text-headline-md text-text-primary mb-2">Strategic Weekly Debrief</h3>
                            <p class="font-body-md text-body-md text-text-secondary">Transform raw activity telemetry into actionable weekly wisdom. Run high-resolution retrospectives to recalibrate friction tolerances for the cycle ahead.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- SECTION 4: INTERACTIVE FINAL CTA BANNER -->
            <section class="w-full px-margin py-space-xl mb-space-xl">
                <div class="max-w-4xl mx-auto relative rounded-3xl bg-surface-subtle p-space-xl border border-border-highlight shadow-2xl overflow-hidden text-center">
                    <!-- Glow nebula backdrop -->
                    <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/25 blur-3xl rounded-full"></div>
                    <div class="relative z-10 flex flex-col items-center">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-code-sm text-code-sm mb-space-sm uppercase tracking-wider">
                            <span class="material-symbols-outlined text-[14px]">terminal</span>
                            System Readiness: Nominal
                        </div>
                        <h2 class="font-display-lg text-display-lg text-text-primary max-w-xl">
                            Boot Up Your Personal OS Today.
                        </h2>
                        <p class="mt-space-sm font-body-lg text-body-lg text-text-secondary max-w-lg mb-space-lg">
                            Take command of your internal architecture. Zero setup fees, zero telemetry sharing, and immediate localized deployment.
                        </p>
                        <a class="px-6 py-3 rounded-xl bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:shadow-[0_0_24px_rgba(139,92,246,0.5)] transition-all flex items-center justify-center gap-2 shrink-0" href="#login">
                            <span>Launch PersonalOS</span>
                            <span class="material-symbols-outlined text-[16px]">chevron_right</span>
                        </a>
                        <p class="mt-space-md font-code-sm text-code-sm text-text-muted">
                            Instant PWA sync • Offline first • Free Core Tier forever
                        </p>
                    </div>
                </div>
            </section>
        </div>
    </main>
</div>''')
