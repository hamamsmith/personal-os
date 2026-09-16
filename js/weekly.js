// ============================================
// WEEKLY.JS - Weekly review logic
// ============================================

function buildWeeklyReview(allBattles, allDebriefs, allScreenTimes, res) {
    const now = new Date();
    // Buat array 7 hari (D-6 s/d hari ini)
    const days7 = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        days7.push(d.toLocaleDateString('sv-SE'));
    }

    // Hitung Overall Rate 1W
    const b1w = allBattles ? allBattles.filter(b => days7.includes(b.ts.substring(0,10))) : [];
    if(b1w.length > 0) {
        const wins = b1w.filter(b => b.outcome >= 3).length;
        const losses = b1w.filter(b => b.outcome < 3).length;
        const total = wins + losses;
        const successRate = total > 0 ? Math.round((wins/total)*100) : 0;
        
        let kontrolCount = 0, targetKontrol = 0;
        b1w.forEach(b => {
            if(b.outcome === 5 || b.outcome === 1) targetKontrol++;
            if(b.outcome === 5) kontrolCount++;
        });
        const kontrolRate = targetKontrol > 0 ? Math.round((kontrolCount/targetKontrol)*100) : successRate;

        window._wkRateData = { overall: successRate, sukses: successRate, kontrol: kontrolRate };
        
        // Pemicu Terbanyak 1W
        const counts = {};
        b1w.forEach(b => { counts[b.type] = (counts[b.type]||0)+1; });
        let maxT = null, maxC = 0;
        for (let t in counts) { if(counts[t] > maxC) { maxC = counts[t]; maxT = t; } }
        
        const cleanT = t => (t || '').replace(/^[\p{Emoji}\s]+/u, '').trim();
        const setEl = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
        
        setEl('wkRateDisplay', successRate + '%');
        setEl('wkMostFrequent', maxT ? cleanT(maxT) : '-');
        setEl('wkBattleRatio', `${wins}W / ${losses}L`);
    } else {
        window._wkRateData = { overall: '-', sukses: '-', kontrol: '-' };
        const setEl = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
        setEl('wkRateDisplay', '-');
        setEl('wkMostFrequent', '-');
        setEl('wkBattleRatio', '-');
    }

    // Hitung Average Screen Time 1W
    const s1w = allScreenTimes ? allScreenTimes.filter(s => days7.includes(s.date)) : [];
    if(s1w.length > 0) {
        let tot = 0; s1w.forEach(s => tot += parseFloat(s.total || 0));
        let avgS = (tot / s1w.length).toFixed(1);
        const setEl = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
        setEl('wkAvgScreen', avgS + 'j');
        
        const appCnts = {};
        s1w.forEach(s => {
            if(s.a1) appCnts[s.a1] = (appCnts[s.a1]||0) + parseFloat(s.d1||0);
            if(s.a2) appCnts[s.a2] = (appCnts[s.a2]||0) + parseFloat(s.d2||0);
            if(s.a3) appCnts[s.a3] = (appCnts[s.a3]||0) + parseFloat(s.d3||0);
        });
        let maxApp = null, maxD = 0;
        for (let a in appCnts) { if(appCnts[a] > maxD) { maxD = appCnts[a]; maxApp = a; } }
        setEl('wkTopApp', maxApp ? maxApp : '-');
    } else {
        const setEl = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
        setEl('wkAvgScreen', '-');
        setEl('wkTopApp', '-');
    }

    // Mood & Energy Average 1W
    const d1w = allDebriefs ? allDebriefs.filter(d => days7.includes(d.date)) : [];
    if(d1w.length > 0) {
        let totE = 0;
        let moodCnt = {};
        d1w.forEach(d => {
            totE += parseFloat(d.energy || 0);
            moodCnt[d.mood] = (moodCnt[d.mood]||0)+1;
        });
        const setEl = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
        setEl('wkAvgEnergy', (totE / d1w.length).toFixed(1) + '/5');
        
        let maxM = null, maxC = 0;
        for(let m in moodCnt) { if(moodCnt[m] > maxC) { maxC = moodCnt[m]; maxM = m; } }
        setEl('wkDomMood', maxM || '-');
    } else {
        const setEl = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
        setEl('wkAvgEnergy', '-');
        setEl('wkDomMood', '-');
    }
}
