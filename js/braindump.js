// ============================================
// BRAINDUMP.JS - Braindump page logic
// ============================================

function submitBrainDump() { 
    let content = document.getElementById('dumpContent').value;
    if(!content) return;
    
    let btn = document.querySelector('#braindump .btn-submit');
    let origTxt = btn.innerText;
    btn.innerText = "MENYIMPAN..."; btn.disabled = true;
    
    sendToServer('saveBrainDump', content, function(res){
        if(res.status === 'success') {
            showToast("Notes berhasil diupdate!"); 
            loadDashboardData();
            navTo('dashboard', 'Overview.', document.querySelectorAll('.nav-item')[0]);
        } else { alert("Gagal simpan: " + res.message); }
        btn.innerText = origTxt; btn.disabled = false;
    }, btn, origTxt);
}
