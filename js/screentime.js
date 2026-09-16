// ============================================
// SCREENTIME.JS - Screen Time page logic
// ============================================

function initTimePickers() {
    let jamOpts = '<option value="0">0</option>';
    for(let i=1; i<=24; i++) jamOpts += `<option value="${i}">${i}</option>`;
    let menitOpts = '<option value="0">0</option>';
    for(let i=1; i<=59; i++) menitOpts += `<option value="${i}">${i}</option>`;
    
    const totJam = document.getElementById('totJam');
    const totMenit = document.getElementById('totMenit');
    if (totJam) totJam.innerHTML = jamOpts; 
    if (totMenit) totMenit.innerHTML = menitOpts;
    
    [1,2,3].forEach(n => { 
        const appJam = document.getElementById('app' + n + 'Jam');
        const appMenit = document.getElementById('app' + n + 'Menit');
        if (appJam) appJam.innerHTML = jamOpts; 
        if (appMenit) appMenit.innerHTML = menitOpts; 
    });
    
    // Init screenDatePicker: hari ini & kemarin
    const today = new Date();
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
    const toStr = d => d.toLocaleDateString('sv-SE');
    const toLabel = d => d.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long' });
    
    const dpScreen = document.getElementById('screenDatePicker');
    if(dpScreen) dpScreen.innerHTML = `<option value="${toStr(today)}">Hari Ini — ${toLabel(today)}</option><option value="${toStr(yesterday)}">Kemarin — ${toLabel(yesterday)}</option>`;
    
    const dpBattle = document.getElementById('battleDatePicker');
    if(dpBattle) dpBattle.innerHTML = `<option value="${toStr(today)}">Hari Ini — ${toLabel(today)}</option><option value="${toStr(yesterday)}">Kemarin — ${toLabel(yesterday)}</option>`;
}

function submitScreenTime() { 
    let selectedDate = document.getElementById('screenDatePicker').value;
    let jam = parseInt(document.getElementById('totJam').value || 0);
    let mnt = parseInt(document.getElementById('totMenit').value || 0);
    if(jam == 0 && mnt == 0) { alert('Total durasi ngga boleh kosong!'); return; }

    // Validasi: tanggal yang dipilih belum diisi
    const allScreensCache = window._cachedAllScreenTimes || [];
    const alreadyFilled = allScreensCache.some(s => s.date === selectedDate);
    if (alreadyFilled) { alert(`Screen time ${selectedDate === new Date().toLocaleDateString('sv-SE') ? 'hari ini' : 'kemarin'} udah diisi bro!`); return; }

    let totalFloat = jam + (mnt / 60);
    let a1j = parseInt(document.getElementById('app1Jam').value || 0); let a1m = parseInt(document.getElementById('app1Menit').value || 0);
    let a2j = parseInt(document.getElementById('app2Jam').value || 0); let a2m = parseInt(document.getElementById('app2Menit').value || 0);
    let a3j = parseInt(document.getElementById('app3Jam').value || 0); let a3m = parseInt(document.getElementById('app3Menit').value || 0);

    let payload = {
        date: selectedDate,
        total: totalFloat.toFixed(2),
        app1Name: document.getElementById('app1Name').value, app1Dur: (a1j + (a1m/60)).toFixed(2),
        app2Name: document.getElementById('app2Name').value, app2Dur: (a2j + (a2m/60)).toFixed(2),
        app3Name: document.getElementById('app3Name').value, app3Dur: (a3j + (a3m/60)).toFixed(2)
    };

    let btn = document.querySelector('#screentime .btn-submit');
    let origTxt = btn.innerText;
    btn.innerText = "MENYIMPAN..."; btn.disabled = true;

    sendToServer('saveScreenTime', payload, function(res){
        if(res.status === 'success') {
            showToast("Screen Time dicatat di Database!"); resetForm('screentime'); 
            navTo('dashboard', 'Overview.', document.querySelectorAll('.nav-item')[0]); 
            loadDashboardData();
        } else { alert("Gagal simpan: " + res.message); }
        btn.innerText = origTxt; btn.disabled = false;
    }, btn, origTxt);
}
