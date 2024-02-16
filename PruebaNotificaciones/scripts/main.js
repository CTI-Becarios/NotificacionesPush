'use strict';

const applicationServerPublicKey = 'BJd2EgS_NGUDOr_ZF1SKV7UxlPR_g3mHsSmpho1XVuZJ5RDp24_EwDDd4WZtXS8-1SNk7EARfIQGTio4h8Db0A0';

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

function initializeUI() {

  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
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

navigator.serviceWorker.register('sw.js')
.then(function(swReg) {
  console.log('Service Worker is registered', swReg);

  swRegistration = swReg;
  initializeUI();
});

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

    // Personalizar la notificación aquí
    mostrarNotificacionPersonalizada();

    updateBtn();
  })
  .catch(function(error) {
    console.error('Failed to subscribe the user: ', error);
    updateBtn();
  });
}

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

// Función para mostrar la notificación personalizada
function mostrarNotificacionPersonalizada() {
  // Crear un elemento div para la notificación personalizada
  const notificationDiv = document.createElement('div');
  notificationDiv.classList.add('notification-container');
  notificationDiv.innerHTML = `
    <style>
    .notification-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #007bff;
      color: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      max-width: 400px;
  }
  
  /* Estilos para el logotipo de la empresa */
  .notification-logo {
      width: 100px; /* Ajustar el tamaño según sea necesario */
      height: 100px; /* Ajustar el tamaño según sea necesario */
      margin-bottom: 20px;
  }
  
  /* Estilos para el título de la notificación */
  .notification-title {
      font-size: 24px;
      margin-bottom: 10px;
  }
  
  /* Estilos para el mensaje de la notificación */
  .notification-message {
      font-size: 18px;
      margin-bottom: 20px;
  }
  
  /* Estilos para las opciones de la notificación */
  .notification-options {
      display: flex;
      justify-content: center;
  }
  
  /* Estilos para cada botón de la notificación */
  .notification-button {
      margin: 0 10px; /* Espaciado entre botones */
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      background-color: #ffffff;
      color: #007bff;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
  }
  
  .notification-button:hover {
      background-color: rgba(255, 255, 255, 0.8);
  }
    </style>
    <div class="notification-container">
      <!-- Contenido de la notificación -->
      <img src="images/logo_cti.jpg" class="notification-logo" alt="Logo de CTI">
      <h2 class="notification-title">Notificación de CTI</h2>
      <p class="notification-message">Este es el mensaje de la notificación.</p>
      <div class="notification-options">
        <button class="notification-button" onclick="irALaURL()">Ir a la URL</button>
        <button class="notification-button" onclick="cerrarNotificacion()">Cerrar notificación</button>
      </div>
    </div>
  `;
  // Agregar el elemento a la página
  document.body.appendChild(notificationDiv);

  // Cerrar la notificación automáticamente después de 6 segundos
  setTimeout(cerrarNotificacion, 6000);
}

// Función para ir a la URL al hacer clic en la opción correspondiente
function irALaURL() {
  window.open('https://www.ctisl.es/'); // Cambiar 'https://www.ejemplo.com' por la URL deseada
  cerrarNotificacion(); // Cerrar la notificación después de abrir la URL
}

// Función para cerrar la notificación al hacer clic en la opción correspondiente
function cerrarNotificacion() {
  const notificationDiv = document.querySelector('.notification-container');
  if (notificationDiv) {
    notificationDiv.remove();
  }
}
