// ============================================
// DEBRIEF.JS - Debrief page logic
// ============================================

function toggleEnergyHistory() {
    const el = document.getElementById('debriefEnergyTimeline');
    if (el) el.style.display = el.style.display === 'none' ? 'grid' : 'none';
}

function submitDebrief() { 
    let mood = document.getElementById('moodVal').value;
    let energy = document.getElementById('energyVal').value;
    let lesson = document.getElementById('pelajaranVal').value;
    let fix = document.getElementById('perbaikanVal').value;
    const ddp = document.getElementById('debriefDatePicker');
    const selectedDate = ddp ? ddp.value : new Date().toLocaleDateString('sv-SE');

    if(!mood || !energy) { alert("Mood & Level Energi wajib diisi!"); return; }
    if(!selectedDate) { alert("Pilih tanggal dulu!"); return; }

    let payload = { mood, energy, lesson, fix, date: selectedDate };
    let btn = document.querySelector('#debrief .btn-submit');
    let origTxt = btn.innerText;
    btn.innerText = "MENYIMPAN..."; btn.disabled = true;

    sendToServer('saveDebrief', payload, function(res){
        if(res.status === 'success') {
            showToast("Debrief malam dicatat!"); resetForm('debrief');
            loadDashboardData();
        } else { alert("Gagal simpan: " + res.message); }
        btn.innerText = origTxt; btn.disabled = false;
    }, btn, origTxt);
}
