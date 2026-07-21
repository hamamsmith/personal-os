self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { body: event.data.text() };
    }
  }

  const title = data.title || 'Sistem Personal OS';
  const options = {
    body: data.body || 'Ada pesan baru buat lu bro!',
    icon: 'https://cdn-icons-png.flaticon.com/512/263/263062.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/263/263062.png',
    vibrate: [200, 100, 200]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  // Buka tab web kalau notifikasi diklik
  event.waitUntil(clients.openWindow('/Index.html'));
});
