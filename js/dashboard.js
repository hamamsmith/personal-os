// ============================================
// DASHBOARD.JS - Dashboard logic & charts
// ============================================

let chartWinLoseInst = null;
let chartBattleInst = null;
let chartEnergyInst = null;

// Filter Rate UI Logic
window._rateData = { overall: 0, sukses: 0, kontrol: 0 };
function changeRateFilter() {
    const f = document.getElementById('rateFilter').value;
    const labels = { overall: '📊 Overall Rate', sukses: '✅ Sukses Rate', kontrol: '🎯 Kontrol Rate' };
    document.getElementById('rateLabel').innerText = labels[f];
    document.getElementById('valRateDisplay').innerText = window._rateData[f] + '%';
}

// Filter Avg Screen Logic
window._allScreenTimes = [];
function changeScreenFilter() {
    const f = document.getElementById('screenFilter').value;
    const now = new Date();
    const cutoff = new Date();
    if (f === '7') cutoff.setDate(now.getDate() - 6);
    else if (f === '30') cutoff.setDate(now.getDate() - 29);
    else cutoff.setFullYear(2000);
    const cutStr = cutoff.toLocaleDateString('sv-SE');
    const filtered = window._allScreenTimes.filter(s => s.date >= cutStr);
    const avg = filtered.length > 0
        ? (filtered.reduce((sum, s) => sum + parseFloat(s.total || 0), 0) / filtered.length).toFixed(1)
        : '-';
    const el = document.getElementById('valAvgScreen');
    if (el) el.innerText = avg !== '-' ? avg + 'j' : '-';
}

// Chart Navigator — Senin s/d Minggu per pekan
let _chartWeekOffset = 0; // 0 = minggu ini, -1 = minggu lalu, dst
function shiftWeek(dir) {
    // Blokir maju ke minggu depan (future)
    if (dir > 0 && _chartWeekOffset >= 0) return;
    _chartWeekOffset += dir;
    renderWeekChart();
}
function renderWeekChart() {
    if (!chartWinLoseInst || !window._cachedAllBattles) return;
    const now = new Date();
    // Cari Senin minggu ini
    const dayOfWeek = now.getDay(); // 0=minggu
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday + (_chartWeekOffset * 7));
    monday.setHours(0,0,0,0);

    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        days.push(d);
    }
    const dayStrs = days.map(d => d.toLocaleDateString('sv-SE'));
    const dayLabels = days.map(d => d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }));

    const wins = dayStrs.map(ds => window._cachedAllBattles.filter(b => b.ts.startsWith(ds) && b.outcome >= 4).length);
    const losses = dayStrs.map(ds => window._cachedAllBattles.filter(b => b.ts.startsWith(ds) && b.outcome <= 2).length);

    chartWinLoseInst.data.labels = dayLabels;
    chartWinLoseInst.data.datasets[0].data = wins;
    chartWinLoseInst.data.datasets[1].data = losses;
    chartWinLoseInst.update();

    // Label navigasi + disable next button jika sudah minggu ini
    const startLabel = days[0].toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const endLabel   = days[6].toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const weekLabel = _chartWeekOffset === 0 ? 'Minggu Ini'
        : _chartWeekOffset === -1 ? 'Minggu Lalu'
        : `${startLabel} – ${endLabel}`;
    const el = document.getElementById('chartWeekLabel');
    if (el) el.innerText = weekLabel;
    const btnNext = document.getElementById('btnNextWeek');
    if (btnNext) {
        btnNext.disabled = _chartWeekOffset >= 0;
        btnNext.style.opacity = _chartWeekOffset >= 0 ? '0.3' : '1';
        btnNext.style.cursor = _chartWeekOffset >= 0 ? 'not-allowed' : 'pointer';
    }
}

function loadDashboardData() {
    sendToServer('getDashboardData', {}, function(res) {
        if(res.status === 'success') {
            // Update Summary Dashboard
            const s = res.summary;
            const setEl = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
            
            setEl('valControlPoint', s.controlPoint);
            setEl('valControlDetail', `${s.totalBerhasil} Berhasil | ${s.totalGagal} Gagal`);
            setEl('valConsistencyPoint', s.consistencyPoint);
            setEl('valRateDisplay', s.successRate + '%');
            setEl('valRateDisplaySmall', s.successRate + '%');
            
            const cleanT = t => (t || '').replace(/^[\p{Emoji}\s]+/u, '').trim();
            setEl('valMostFrequent', s.mostFrequent ? cleanT(s.mostFrequent) : 'Belum ada data');
            
            // Update allScreenTimes cache & avg screen
            window._allScreenTimes = res.allScreenTimes || [];
            changeScreenFilter();

            // Cache allBattles lalu render chart Senin-Minggu
            window._cachedAllBattles = res.allBattles || [];
            window._cachedAllScreenTimes = res.allScreenTimes || [];
            renderWeekChart();

            if (chartBattleInst && res.chartData) {
                // Tampilkan label dengan emoji aslinya (tidak di-strip)
                chartBattleInst.data.labels = res.chartData.freqLabels;
                chartBattleInst.data.datasets[0].data = res.chartData.freqData;
                // Warna per bar sesuai kategori: hijau=Positif, merah=Negatif
                const freqColors = (res.chartData.freqKategori || []).map(k =>
                    k === 'Positif' ? 'rgba(16,185,129,0.85)' : 'rgba(239,68,68,0.85)'
                );
                chartBattleInst.data.datasets[0].backgroundColor = freqColors;
                chartBattleInst.update();
            }

            // Render Battle Hari Ini
            const todayStr = new Date().toLocaleDateString('sv-SE');
            const todayBattles = res.allBattles ? res.allBattles.filter(b => b.ts.startsWith(todayStr)) : [];
            const pastBattles = res.allBattles ? res.allBattles.filter(b => !b.ts.startsWith(todayStr)) : [];

            // Sembunyikan opsi BATTLE_LIST yang sudah diisi hari ini di selectKategori
            window._todayBattleTypes = new Set(todayBattles.map(b => b.type));

            const todayListContainer = document.getElementById('battleTodayList');
            if (todayListContainer) {
                todayListContainer.innerHTML = '';
                if(todayBattles.length === 0) {
                    todayListContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-size: 14px; margin-top: 20px;">Belum ada battle hari ini. Sikat!</p>`;
                } else {
                    if (typeof renderBattleCard === 'function') {
                        todayBattles.forEach(b => renderBattleCard(b, todayListContainer));
                    }
                }
            }

            // Render Riwayat Battle Sebelumnya — Accordion per hari
            const historyContainer = document.getElementById('battleHistoryList');
            if (historyContainer) {
                historyContainer.innerHTML = '';
                if(pastBattles.length === 0) {
                    historyContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-size: 14px; margin-top: 20px;">Belum ada catatan battle sebelumnya.</p>`;
                } else {
                    // Group by date
                    const grouped = {};
                    pastBattles.forEach(b => {
                        const d = b.ts.substring(0,10);
                        if (!grouped[d]) grouped[d] = [];
                        grouped[d].push(b);
                    });
                    const sortedDates = Object.keys(grouped).sort((a,b) => b.localeCompare(a));
                    // Tampilkan maksimal 14 hari terakhir
                    sortedDates.slice(0, 14).forEach(date => {
                        const battles = grouped[date];
                        const wins = battles.filter(b => b.outcome >= 3).length;
                        const losses = battles.filter(b => b.outcome < 3).length;
                        const uid = 'acc-' + date;

                        // Header accordion → buka popup saat diklik
                        const header = document.createElement('div');
                        header.style = 'display: flex; justify-content: space-between; align-items: center; padding: 13px 16px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-sm); margin-bottom: 8px; cursor: pointer; user-select: none;';
                        header.innerHTML = `
                            <div>
                                <div style="font-size: 13px; font-weight: 600; color: var(--text-title);">${formatTanggal(date)}</div>
                                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${battles.length} log &nbsp;·&nbsp; <span style="color:var(--success);">${wins} ✅</span> <span style="color:var(--danger);">${losses} ❌</span></div>
                            </div>
                            <span style="font-size: 14px; color: var(--text-muted);">›</span>
                        `;
                        if (typeof openBattleDetail === 'function') {
                            header.onclick = () => openBattleDetail(battles, date, wins, losses);
                        }

                        historyContainer.appendChild(header);
                    });
                }
            }
            
            // Render Debrief + Validasi + Date Picker
            const yesterdayDbStr = (() => { const d = new Date(); d.setDate(d.getDate()-1); return d.toLocaleDateString('sv-SE'); })();
            const todayDebrief = res.allDebriefs ? res.allDebriefs.find(d => d.date === todayStr) : null;
            const yesterDebrief = res.allDebriefs ? res.allDebriefs.find(d => d.date === yesterdayDbStr) : null;

            // Setup debriefDatePicker
            const ddp = document.getElementById('debriefDatePicker');
            if (ddp) {
                const toLabel = d => d.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long' });
                const todayD = new Date(); const yesterD = new Date(); yesterD.setDate(todayD.getDate()-1);
                let opts = '';
                if (!todayDebrief) opts += `<option value="${todayStr}">Hari Ini \u2014 ${toLabel(todayD)}</option>`;
                if (!yesterDebrief) opts += `<option value="${yesterdayDbStr}">Kemarin \u2014 ${toLabel(yesterD)}</option>`;
                if (!opts) opts = `<option disabled selected>Hari ini & kemarin sudah diisi ✅</option>`;
                ddp.innerHTML = opts;
            }

            const btnDebrief = document.getElementById('btnSelesaiHari');
            const hasActiveOpt = ddp && ddp.options.length > 0 && !ddp.options[0].disabled;
            if (btnDebrief) {
                btnDebrief.disabled = !hasActiveOpt;
                btnDebrief.innerText = hasActiveOpt ? 'SELESAIKAN HARI' : '\u2705 SUDAH DIISI SEMUA';
            }

            // Update Timeline Mood & Energi
            const latestCard = document.getElementById('latestEnergyCard');
            const timelineContainer = document.getElementById('debriefEnergyTimeline');
            if (latestCard && timelineContainer && res.allDebriefs) {
                const energyDebriefs = [...res.allDebriefs].slice(0, 7); // dari terbaru ke terlama
                if (energyDebriefs.length === 0) {
                    latestCard.innerHTML = '<p style="font-size: 13px; color: var(--text-muted); text-align: center; width: 100%;">Belum ada riwayat mood & energi.</p>';
                } else {
                    // Tampilan Card 1 (Terbaru)
                    const latest = energyDebriefs[0];
                    const latestDate = new Date(latest.date);
                    const dayStr = latestDate.toLocaleDateString('id-ID', {weekday:'long'});
                    const dateStr = latestDate.toLocaleDateString('id-ID', {day:'2-digit', month:'short', year:'2-digit'}); // ex: 20 Jul 26
                    
                    const color = latest.energy <= 2 ? '#EF4444' : (latest.energy >= 4 ? '#10B981' : '#FBBF24');
                    const bg = latest.energy <= 2 ? 'rgba(239,68,68,0.15)' : (latest.energy >= 4 ? 'rgba(16,185,129,0.15)' : 'rgba(251,191,36,0.15)');
                    
                    latestCard.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; background: ${bg}; border: 1px solid ${color}40; border-radius: 12px; padding: 16px;">
                            <div>
                                <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Terakhir Diisi</div>
                                <div style="font-size: 15px; font-weight: 700; color: var(--text-title);">${dayStr}, ${dateStr}</div>
                                <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">Klik untuk riwayat seminggu ▾</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <span style="font-size: 32px;">${latest.mood}</span>
                                <div style="font-size: 20px; font-weight: 800; font-family: 'Outfit'; color: ${color};">${latest.energy}<span style="font-size:12px;color:var(--text-muted);">/5</span></div>
                            </div>
                        </div>
                    `;

                    // Tampilan Timeline (disembunyikan secara default)
                    const reversedTimeline = [...energyDebriefs].reverse(); // diurutkan kiri ke kanan (terlama ke terbaru)
                    timelineContainer.innerHTML = reversedTimeline.map(d => {
                        const dd = new Date(d.date);
                        const dayName = dd.toLocaleDateString('id-ID', {weekday:'short'});
                        const shortDate = dd.toLocaleDateString('id-ID', {day:'numeric', month:'short'});
                        const c = d.energy <= 2 ? '#EF4444' : (d.energy >= 4 ? '#10B981' : '#FBBF24');
                        const cbg = d.energy <= 2 ? 'rgba(239,68,68,0.15)' : (d.energy >= 4 ? 'rgba(16,185,129,0.15)' : 'rgba(251,191,36,0.15)');
                        return `
                            <div style="background: ${cbg}; border: 1px solid ${c}40; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
                                <div style="font-size: 11px; font-weight: 700; color: var(--text-title); margin-bottom: 2px;">${dayName}</div>
                                <div style="font-size: 9px; color: var(--text-muted); margin-bottom: 8px;">${shortDate}</div>
                                <div style="font-size: 22px; margin-bottom: 6px;">${d.mood}</div>
                                <div style="font-size: 14px; font-weight: 800; font-family: 'Outfit'; color: ${c};">${d.energy}<span style="font-size:10px;color:var(--text-muted);">/5</span></div>
                            </div>
                        `;
                    }).join('');
                }
            }

            const debriefContainer = document.getElementById('debriefHistoryList');
            if (debriefContainer) {
                debriefContainer.innerHTML = '';
                const pastDebriefs = res.allDebriefs ? res.allDebriefs.filter(d => d.date !== todayStr) : [];
                
                if (!todayDebrief && pastDebriefs.length === 0) {
                    debriefContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-size: 14px; margin-top: 20px;">Belum ada catatan debrief.</p>`;
                } else {
                    const renderDebriefCard = (d, label) => {
                        let dateEl = document.createElement('p');
                        dateEl.style = 'font-size: 12px; color: var(--primary); font-weight: 700; text-transform: uppercase; margin: 20px 0 8px 4px; letter-spacing: 1px;';
                        dateEl.innerText = label;
                        debriefContainer.appendChild(dateEl);
                        let card = document.createElement('div');
                        card.className = 'card'; card.style.padding = '16px';
                        card.innerHTML = `
                            ${d.lesson ? `<p style="font-size: 13.5px; color: var(--text-main); line-height:1.5; margin-bottom: 12px;">\ud83d\udca1 <strong style="color:var(--text-muted); font-size:12px;">Pelajaran Hari Ini:</strong><br>${d.lesson}</p>` : ''}
                            ${d.fix ? `<p style="font-size: 13.5px; color: var(--text-main); line-height:1.5;">\ud83c\udfaf <strong style="color:var(--text-muted); font-size:12px;">Target Besok:</strong><br>${d.fix}</p>` : ''}
                        `;
                        if(!d.lesson && !d.fix) card.innerHTML = `<p style="font-size: 13px; color: var(--text-muted); font-style: italic; text-align: center;">Hanya mencatat mood & energi.</p>`;
                        debriefContainer.appendChild(card);
                    };
                    if (todayDebrief) renderDebriefCard(todayDebrief, 'Hari Ini');
                    pastDebriefs.forEach(d => renderDebriefCard(d, formatTanggal(d.date)));
                }
            }

            // Validasi + Render Riwayat Screen Time
            const yesterdayStr = (() => { const d = new Date(); d.setDate(d.getDate()-1); return d.toLocaleDateString('sv-SE'); })();
            const todayScreen = res.allScreenTimes ? res.allScreenTimes.find(s => s.date === todayStr) : null;
            const yesterScreen = res.allScreenTimes ? res.allScreenTimes.find(s => s.date === yesterdayStr) : null;
            const btnScreen = document.getElementById('btnSimpanScreen');
            const dp = document.getElementById('screenDatePicker');

            if (todayScreen && yesterScreen) {
                // Keduanya sudah diisi → kunci form
                if (btnScreen) { btnScreen.disabled = true; btnScreen.innerText = '\u2705 HARI INI & KEMARIN SUDAH DIISI'; }
                if (dp) dp.disabled = true;
            } else {
                // Rebuild opsi: hapus yang sudah diisi
                if (dp) {
                    dp.disabled = false;
                    const toLabel = d => d.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long' });
                    const todayD = new Date(); const yesterD = new Date(); yesterD.setDate(todayD.getDate()-1);
                    let opts = '';
                    if (!todayScreen) opts += `<option value="${todayStr}">Hari Ini \u2014 ${toLabel(todayD)}</option>`;
                    if (!yesterScreen) opts += `<option value="${yesterdayStr}">Kemarin \u2014 ${toLabel(yesterD)}</option>`;
                    dp.innerHTML = opts;
                }
                if (btnScreen) { btnScreen.disabled = false; btnScreen.innerText = 'SIMPAN SCREEN TIME'; }
            }

            const screenContainer = document.getElementById('screenHistoryList');
            if (screenContainer) {
                screenContainer.innerHTML = '';
                const pastScreens = res.allScreenTimes ? res.allScreenTimes.filter(s => s.date !== todayStr) : [];

                if (!todayScreen && pastScreens.length === 0) {
                    screenContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-size: 14px; margin-top: 20px;">Belum ada catatan screen time.</p>`;
                } else {
                    const renderScreenCard = (s, label) => {
                        let totalH = parseFloat(s.total || 0);
                        let totalDisplay = formatDur(totalH > 0 ? totalH : 0);
                        let apps = [{ name: s.a1, dur: s.d1 }, { name: s.a2, dur: s.d2 }, { name: s.a3, dur: s.d3 }].filter(a => a.name);
                        let dateEl = document.createElement('p');
                        dateEl.style = 'font-size: 12px; color: var(--primary); font-weight: 700; text-transform: uppercase; margin: 20px 0 8px 4px; letter-spacing: 1px;';
                        dateEl.innerText = label;
                        screenContainer.appendChild(dateEl);
                        let card = document.createElement('div');
                        card.className = 'card'; card.style.padding = '16px';
                        card.innerHTML = `
                            <div style="display: flex; align-items: baseline; gap: 6px; margin-bottom: ${apps.length > 0 ? '12px' : '0'};">
                                <span style="font-size: 28px; font-weight: 800; font-family: 'Outfit'; color: white;">${totalDisplay}</span>
                                <span style="font-size: 13px; color: var(--text-muted);">total layar</span>
                            </div>
                            ${apps.map(a => `<div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--text-muted); margin-bottom: 4px;"><span>${a.name}</span><span style="color: white; font-weight: 600;">${formatDur(a.dur)}</span></div>`).join('')}
                        `;
                        screenContainer.appendChild(card);
                    };
                    if (todayScreen) renderScreenCard(todayScreen, 'Hari Ini');
                    pastScreens.forEach(s => renderScreenCard(s, formatTanggal(s.date)));
                }
            }
            
            // Cache untuk validasi duplikat
            window._cachedAllBattles = res.allBattles || [];
            window._cachedAllScreenTimes = res.allScreenTimes || [];
            
            if (res.todayBrainDumpText) {
                document.getElementById('dumpContent').value = res.todayBrainDumpText;
            } else {
                document.getElementById('dumpContent').value = '';
            }
            
            const bdhContainer = document.getElementById('brainDumpHistoryList');
            if (bdhContainer) {
                bdhContainer.innerHTML = '';
                if(!res.pastBrainDumps || res.pastBrainDumps.length === 0) {
                    bdhContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-size: 14px; margin-top: 30px;">Belum ada catatan di hari-hari sebelumnya.</p>`;
                } else {
                    res.pastBrainDumps.forEach(d => {
                        let newCard = document.createElement('div');
                        newCard.className = 'card'; newCard.style.padding = '16px';
                        // Fix: gunakan formatTanggal bukan raw date
                        newCard.innerHTML = `<div style="font-size: 12px; color: var(--primary); font-weight: 700; margin-bottom: 8px; letter-spacing: 0.5px;">${formatTanggal(d.date)}</div><p style="font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.5; white-space: pre-wrap;">${d.text}</p>`;
                        bdhContainer.appendChild(newCard);
                    });
                }
            }
            // Build Weekly Review
            if (typeof buildWeeklyReview === 'function') {
                buildWeeklyReview(res.allBattles, res.allDebriefs, res.allScreenTimes, res);
            }
        } else {
            console.error("Gagal load data: ", res.message);
        }
    }, null, null);
}
