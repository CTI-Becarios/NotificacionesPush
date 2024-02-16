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

/* eslint-env browser, es6 */

'use strict';

const applicationServerPublicKey = 'BAppw7Lq4aMkZnNmnsWSmba6MsmCjBVHHiVIH0ebMHhOZqtc1NOApshNQ1suXQa79-cv_ezcP4Qy3vwVZtuKH8U';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function initializeUI() {
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if(isSubscribed) {
      //Todo
    } else {
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed.');

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(error) {
    console.error('Failed to subscribe the user: ', error);
    updateBtn();
  });
}

function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}

function updateBtn() {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

pushButton.addEventListener('click', function() {
  pushButton.disabled = true;
  if (isSubscribed) {
    unsubscribeUser();
  } else {
    subscribeUser();
  }
});

function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription.unsubscribe();
    }
  })
  .catch(function(error) {
    console.log('Error unsubscribing', error);
  })
  .then(function() {
    updateSubscriptionOnServer(null);

    console.log('User is unsubscribed.');
    isSubscribed = false;

    updateBtn();
  });
}

navigator.serviceWorker.register('sw.js')
.then(function(swReg) {
  console.log('Service Worker is registered', swReg);

  swRegistration = swReg;
  initializeUI();
})

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push are supported');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}


/*
const button = document.getElementById("notificationButton");
const notification = document.getElementById("notification");
const closeButton = document.getElementById("closeNotificationButton");
const title = "Notificaciones CTI";
const description = "Revisa tus tareas pendientes.";

notification.addEventListener("click", function() {
  window.open("https://www.ctisl.es/");
  notification.classList.add("hidden");
  
})

button.addEventListener("click", function() {
  notification.classList.remove("hidden");
});

closeButton.addEventListener("click", function() {
  notification.classList.add("hidden");
});
*/

const title = "Notificaciones CTI";
const description = "Revisa tus tareas pendientes.";

document.addEventListener("DOMContentLoaded", function() {
  const notificationButton = document.getElementById("notificationButton");

  const notificationDiv = document.createElement('div');
  notificationDiv.classList.add('notification');
  notificationDiv.classList.add('hidden');
  notificationDiv.innerHTML = `
  <div id="notification">
    <img src="https://www.ctisl.es/wp-content/uploads/2020/02/ico_44_44.png" alt="Notification image">
    <div>
      <h2><strong>${title}</strong></h2>
      <p>${description}</p>
    </div>
    <button id="closeNotificationButton" aria-label="Close notification">
      <span aria-hidden="true">&times;</span>
    </button>
    <div class="notification-bar"> 
      <div class="notification-bar-progress"></div>
    </div>
  </div>
  `;

  document.body.appendChild(notificationDiv);

  notificationButton.addEventListener("click", function() {
    notificationDiv.classList.remove("hidden");

    setTimeout(function() {
      notificationDiv.classList.add("hidden");
    }, 5000);
  });

  notificationDiv.addEventListener("click", function() {
    window.open("https://www.ctisl.es/");
    notificationDiv.classList.add("hidden");
  });

  const closeNotificationButton = document.getElementById("closeNotificationButton");
  closeNotificationButton.addEventListener("click", function(event) {
    event.stopPropagation();
    notificationDiv.classList.add("hidden");
  });
});


