// ============================================
// INIT.JS - App initialization & Push Notifications
// ============================================

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) { outputArray[i] = rawData.charCodeAt(i); }
    return outputArray;
}

async function openNotifModal() {
    let sub = null;
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        const reg = await navigator.serviceWorker.ready;
        sub = await reg.pushManager.getSubscription();
    }
    if (sub) {
        document.getElementById('notifModal').innerHTML = '<div class="modal-content" style="text-align: center; max-width: 400px; padding: 32px 24px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(16, 185, 129, 0.3); box-shadow: 0 0 40px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255,255,255,0.1); border-radius: 24px;"><div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05)); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(16, 185, 129, 0.4); box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);"><div style="font-size: 32px; filter: drop-shadow(0 2px 8px rgba(16, 185, 129, 0.5));">✅</div></div><h3 style="margin-bottom: 12px; font-size: 22px; font-weight: 700; background: linear-gradient(to right, #fff, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Notifikasi Aktif!</h3><p style="font-size: 14.5px; color: var(--text-muted); margin-bottom: 32px; line-height: 1.6; font-weight: 300;">Sistem telah terhubung. Anda akan menerima notifikasi pengingat evaluasi harian secara otomatis.</p><div style="display: flex; gap: 14px; justify-content: center;"><button class="btn" onclick="closeNotifModal()" style="flex:1; background: rgba(255,255,255,0.05); color: var(--text-main); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; font-weight: 500; padding: 14px 20px; font-size: 15px; transition: all 0.2s;">Tutup</button><button class="btn btn-primary" onclick="testPush()" style="flex:1; border-radius: 12px; background: linear-gradient(135deg, #10B981, #059669); font-weight: 600; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); border:none; color:#fff; padding: 14px 20px; font-size: 15px; transition: all 0.2s;">Test Notifikasi</button></div></div>';
    } else {
        document.getElementById('notifModal').innerHTML = '<div class="modal-content" style="text-align: center; max-width: 400px; padding: 32px 24px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(124, 58, 237, 0.3); box-shadow: 0 0 40px rgba(124, 58, 237, 0.15), inset 0 1px 0 rgba(255,255,255,0.1); border-radius: 24px;"><div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(124, 58, 237, 0.05)); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(124, 58, 237, 0.4); box-shadow: 0 0 20px rgba(124, 58, 237, 0.2);"><div style="font-size: 32px; filter: drop-shadow(0 2px 8px rgba(124, 58, 237, 0.5));">🔔</div></div><h3 style="margin-bottom: 12px; font-size: 22px; font-weight: 700; background: linear-gradient(to right, #fff, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Aktifkan Notifikasi</h3><p style="font-size: 14.5px; color: var(--text-muted); margin-bottom: 32px; line-height: 1.6; font-weight: 300;">Aktifkan pengingat harian otomatis untuk memastikan Anda tidak pernah melewatkan sesi evaluasi progres setiap malam.</p><div style="display: flex; gap: 14px; justify-content: center;"><button class="btn" onclick="closeNotifModal()" style="flex:1; background: rgba(255,255,255,0.05); color: var(--text-main); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; font-weight: 500; padding: 14px 20px; font-size: 15px; transition: all 0.2s;">Nanti Saja</button><button class="btn btn-primary" id="btnAktifNotif" onclick="subscribePush()" style="flex:1; border-radius: 12px; background: linear-gradient(135deg, var(--primary), var(--primary-hover)); font-weight: 600; box-shadow: 0 4px 15px var(--primary-glow); border:none; color:#fff; padding: 14px 20px; font-size: 15px; transition: all 0.2s;">Aktifkan</button></div></div>';
    }
    document.getElementById('notifModal').classList.add('show');
}

async function initPushNotifBanner() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    const reg = await navigator.serviceWorker.register('/sw.js');
    const sub = await reg.pushManager.getSubscription();
    
    // Kalau belum subscribe dan belum pernah klik Nanti Aja, tampilin otomatis
    if (!sub && !localStorage.getItem('hideNotifModal')) {
        openNotifModal();
    }
}

function closeNotifModal() {
    localStorage.setItem('hideNotifModal', 'true');
    document.getElementById('notifModal').classList.remove('show');
}

async function subscribePush() {
    try {
        const reg = await navigator.serviceWorker.ready;
        const publicVapidKey = 'BEEPhFhKFgBcKkHKfFY7WGm00FRaGmY4yact3MxVZpqS41XzZqlT1vwji_GQd2ef333szq_oHUTFG8GYwUOJ_qA';
        const sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });
        
        let api = getApiURL().replace('/api/data', '/api/subscribe');
        await fetch(api, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sub)
        });
        alert('MANTAP! Notifikasi berhasil diaktifkan buat HP ini.');
        openNotifModal();
    } catch(err) {
        alert('Gagal langganan notif: ' + err.message);
        console.error(err);
    }
}

async function testPush() {
    let btn = event.target;
    let origTxt = btn.innerText;
    btn.innerText = 'Ngetest...';
    try {
        let api = getApiURL().replace('/api/data', '/api/cron-notify');
        let res = await fetch(api);
        let json = await res.json();
        if(json.status === 'success') {
            console.log('Test Sent:', json);
        } else {
            alert('Gagal tembus ke server!');
        }
    } catch(e) {
        alert('Error ngetest API!');
    }
    btn.innerText = origTxt;
}

window.onload = async function() {
    try {
        const CACHE_VER = Date.now();
        const [headerRes, footerRes] = await Promise.all([
            fetch(`pages/header.html?v=${CACHE_VER}`),
            fetch(`pages/footer.html?v=${CACHE_VER}`)
        ]);
        const headerHtml = await headerRes.text();
        const footerHtml = await footerRes.text();
        document.getElementById('headerContainer').innerHTML = headerHtml;
        document.getElementById('footerContainer').innerHTML = footerHtml;
    } catch (e) {
        console.error('Gagal meload header/footer', e);
    }

    if (typeof initTimePickers === 'function') initTimePickers();
    
    if (typeof Chart !== 'undefined') {
        Chart.defaults.color = '#94A3B8';
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.scale.grid.color = 'rgba(255,255,255,0.05)';
        
        const chartWinLoseCanvas = document.getElementById('barChartWinLose');
        if (chartWinLoseCanvas) {
            chartWinLoseInst = new Chart(chartWinLoseCanvas, {
                type: 'bar',
                data: { labels: [], datasets: [{ label: 'Berhasil', data: [], backgroundColor: '#10B981', borderRadius: 4 }, { label: 'Kebablasan', data: [], backgroundColor: '#EF4444', borderRadius: 4 }] },
                options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true, grid: { display: false }, border: { display: false } }, y: { stacked: true, beginAtZero: true, border: { display: false } } }, plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 12, padding: 20 } } } }
            });
        }

        const chartBattleCanvas = document.getElementById('barChartBattle');
        if (chartBattleCanvas) {
            chartBattleInst = new Chart(chartBattleCanvas, {
                type: 'bar',
                data: { labels: [], datasets: [{ label: 'Frekuensi', data: [], backgroundColor: 'rgba(124, 58, 237, 0.8)', borderRadius: 6 }] },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, border: { display: false } }, x: { grid: { display: false }, border: { display: false } } }, plugins: { legend: { display: false } } }
            });
        }
    }

    if (typeof loadDashboardData === 'function') loadDashboardData();
    setTimeout(initPushNotifBanner, 1000);
}
