// ============================================
// BATTLE.JS - Battle page logic
// ============================================

const TRIGGER_LIST = ['🏃‍♂️ Jogging','📚 Belajar','🚿 Mandi Pagi','🛀 Mandi Sore/Malam','📖 Ngaji','🕌 Solat 5 Waktu','💻 Fokus Kerja','🎯 Menyelesaikan Target','🙏 Bersyukur','😴 Tidur Tepat Waktu','📱 Scroll Media Sosial','🥱 Malas','😈 Horny','🤯 Overthinking','🌧️ Kesepian','⏳ Menunda Pekerjaan','💫 Mudah Terdistraksi'];

function checkCustomTrigger() {
    const val = document.getElementById('battleTypeVal').value;
    const customInput = document.getElementById('customTriggerInput');
    if (val === 'Lainnya') {
        customInput.style.display = 'block';
    } else {
        customInput.style.display = 'none';
    }
}

function openBattleModal() {
    document.getElementById('battleModal').classList.add('show');
    const typeSel = document.getElementById('battleTypeVal');
    
    const dp = document.getElementById('battleDatePicker');
    const selectedDate = dp ? dp.value : new Date().toLocaleDateString('sv-SE');
    const doneSelected = new Set((window._cachedAllBattles || []).filter(b => b.ts.startsWith(selectedDate)).map(b => b.type));
    
    let html = '<option value="" disabled selected>Pilih trigger...</option>';
    TRIGGER_LIST.filter(b => !doneSelected.has(b)).forEach(t => html += `<option value="${t}">${t}</option>`);
    html += `<option value="Lainnya">Lainnya (Ketik manual)...</option>`;
    typeSel.innerHTML = html;
}

function closeBattleModal() {
    document.getElementById('battleModal').classList.remove('show');
    document.getElementById('battleTypeVal').value = '';
    document.getElementById('battleKategoriVal').value = 'Lainnya';
    document.getElementById('battleOutcomeVal').value = '';
    document.getElementById('battleNote').value = '';
    document.getElementById('customTriggerInput').value = '';
    document.getElementById('customTriggerInput').style.display = 'none';
    document.querySelectorAll('#battleModal .radio-btn').forEach(btn => btn.classList.remove('active'));
}

function renderBattleCard(b, container) {
    const isSuccess = b.outcome >= 3;
    const ocColor = isSuccess ? 'var(--success)' : 'var(--danger)';
    
    let ocEmoji = isSuccess ? '✅' : '❌';
    const ocLabel = isSuccess ? 'Berhasil' : 'Gagal';
    
    const badgeBg  = 'rgba(124,58,237,0.15)';
    const badgeClr = 'var(--primary)';
    const emojiMatch = b.type.match(/^[\p{Emoji}\s]+/u);
    const triggerEmoji = emojiMatch && emojiMatch[0].trim() !== '' ? emojiMatch[0].trim() : '🎯';
    const cleanType = b.type.replace(/^[\p{Emoji}\s]+/u, '').trim();
    
    let newCard = document.createElement('div');
    newCard.style = 'display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--glass-bg); border-radius: var(--radius-sm); border: 1px solid var(--glass-border); margin-bottom: 8px;';
    newCard.innerHTML = `
        <div style="display:flex; align-items:flex-start; gap:10px;">
            <span style="flex-shrink:0; margin-top:1px; font-size:11px; font-weight:700; padding:2px 7px; border-radius:20px; background:${badgeBg}; color:${badgeClr};">${triggerEmoji}</span>
            <div>
                <div style="font-size: 14px; font-weight: 600; color: var(--text-title);">${cleanType}</div>
                ${b.note ? `<div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${b.note}</div>` : ''}
            </div>
        </div>
        <div style="text-align: right; flex-shrink: 0; margin-left: 10px;">
            <div style="font-size: 14px; display:flex; align-items:center; justify-content:flex-end; gap:4px;">
                <span></span> 
                <span style="font-weight: 700; color: ${ocColor}; font-size: 15px;">${ocEmoji}</span>
            </div>
            <div style="font-size: 10px; color: ${ocColor}; font-weight: 600; margin-top: 2px;">${ocLabel}</div>
            <div style="font-size: 10px; color: var(--text-muted); margin-top: 1px;">${b.ts.substring(11,16)}</div>
        </div>
    `;
    container.appendChild(newCard);
}

function openBattleDetail(battles, date, wins, losses) {
    document.getElementById('battleDetailTitle').innerText = formatTanggal(date);
    document.getElementById('battleDetailSub').innerText = `${battles.length} log  ·  ${wins} Berhasil  ·  ${losses} Gagal`;
    const list = document.getElementById('battleDetailList');
    list.innerHTML = '';
    battles.forEach(b => renderBattleCard(b, list));
    document.getElementById('battleDetailModal').classList.add('show');
}
function closeBattleDetail() {
    document.getElementById('battleDetailModal').classList.remove('show');
}

function submitBattle() {
    let type = document.getElementById('battleTypeVal').value;
    if (type === 'Lainnya') {
        type = document.getElementById('customTriggerInput').value.trim();
    }
    const outStr = document.getElementById('battleOutcomeVal').value;
    let outcomeVal = outStr === '✅ Berhasil' ? 5 : (outStr === '❌ Gagal' ? 1 : 0);
    const kategori = document.getElementById('battleKategoriVal').value || 'Lainnya';
    const note     = document.getElementById('battleNote').value;
    
    if (!type)     { alert('Pilih atau ketik trigger-nya dulu bro!'); return; }
    if (!outcomeVal) { alert('Pilih hasil ✅ Berhasil / ❌ Gagal dulu bro!'); return; }
    
    // Validasi: 1 tipe per hari
    const dp = document.getElementById('battleDatePicker');
    const selectedDate = dp ? dp.value : new Date().toLocaleDateString('sv-SE');
    const allBattlesCache = window._cachedAllBattles || [];
    const alreadyFilled = allBattlesCache.some(b => b.ts.startsWith(selectedDate) && b.type === type);
    if (alreadyFilled) { alert(`"${type}" udah direkam untuk tanggal tersebut bro!`); return; }
    
    let btn = document.querySelector('#battleModal .btn-submit');
    let origTxt = btn.innerText;
    btn.innerText = 'MENYIMPAN...'; btn.disabled = true;

    sendToServer('saveBattle', { type, outcomeVal, note, kategori, date: selectedDate }, function(res){
        if(res.status === 'success') {
            showToast('Log berhasil disimpan!');
            closeBattleModal();
            loadDashboardData();
        } else { alert('Gagal rekam: ' + res.message); }
        btn.innerText = origTxt; btn.disabled = false;
    }, btn, origTxt);
}
