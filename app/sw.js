/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, serviceworker, es6 */

'use strict';

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  
    const title = 'Notificaciones CTI';
    const options = {
      body: 'Revisa tus tareas',
      icon: 'https://www.ctisl.es/wp-content/uploads/2020/02/ico_44_44.png',
      badge: 'https://www.ctisl.es/wp-content/uploads/2020/02/cti_transp.png',
      actions: [
        {action: 'open', title: 'Abrir'},
        {action: 'close', title: 'Cerrar'}
      ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options).then((notification) => {
          return new Promise((resolve, reject) => {
            //const timeout = setTimeout(() => {
              //notification.close();
              //reject();
            //}, 60000); 
    
            self.addEventListener('notificationclick', function(event) {
                //clearTimeout(timeout);
                //notification.close();
                if (event.action === 'open') {
                    clients.openWindow('https://www.ctisl.es/');
                  //event.clients.openWindow('https://google.com');
                } else if (event.action === 'close') {
                  //notification.close();
                }
                resolve();
            });
          });
        })
      );
  
    //event.waitUntil(self.registration.showNotification(title, options));
});

/* Abrir google cuando se hace un click general en la notificación
self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://google.com')
    );
});
*/