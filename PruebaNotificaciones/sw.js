'use strict';

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  
    const title = 'Push Codelab';
    const options = {
        body: 'Notificación de CTI.',
        icon: 'images/cti_logo.jpg',
        badge: 'images/badge.png',
        data: {
            url: 'https://www.ctisl.es/' // URL a la que se redirigirá al hacer clic en el botón
        }
    };

    // Creamos un evento personalizado para mostrar la notificación en la UI
    const showNotificationEvent = new CustomEvent('showNotification', { detail: options });
    self.clients.matchAll().then(function(clients) {
        clients.forEach(client => client.postMessage(showNotificationEvent));
    });
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click received.');
  
    event.notification.close();
  
    const action = event.action;
    switch (action) {
        case 'open_url':
            clients.openWindow('https://www.ctisl.es/');
            break;
        case 'dismiss':
            // Realizar alguna acción de descarte si es necesario
            break;
        default:
            // Realizar alguna acción predeterminada si es necesario
            break;
    }
  });
