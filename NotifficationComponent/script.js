var count = 0;
const title = "Notificaciones CTI";
const description = "Revisa tus tareas pendientes.";

document.getElementById('abrirNotificacion').addEventListener('click', function() {
  mostrarNotificacion(title, description);
});

function mostrarNotificacion(title, description) {
  let maxNotification = 4;
  let id = parseInt(generateUniqueId());
  let date = new Date();
  
  var notificacion = document.createElement('div');
  notificacion.className = 'notification';
  notificacion.dataset.id = id; // asignamos un id a la notificación
  notificacion.innerHTML = `
  <div id="notification" onclick="abrirEnlace(${id}, event)">
    <img src="https://www.ctisl.es/wp-content/uploads/2020/02/ico_44_44.png" alt="Notification image">
    <div>
      <h2><strong>${title} - ${count}</strong></h2>
      <p>${description}</p>
    </div>
    <button id="closeNotificationButton" onclick="cerrarNotificacion(${id}, event)" aria-label="Close notification">
      <span aria-hidden="true">&times;</span>
    </button>
    <div class="notification-bar"> 
      <div class="notification-bar-progress"></div>
    </div>
  </div>
  `;

  setTimeout(function() {
    notificacion.classList.add("hidden");
  }, 10000);
    
    let children = document.getElementById('notificaciones').children;
    if(children.length >= maxNotification){
      for(var i = 0; i < children.length && children.length >= maxNotification; i++) {
        document.getElementById('notificaciones').removeChild(children[i]);
      }
    }
    
    document.getElementById('notificaciones').appendChild(notificacion);
    count++;
};

function generateUniqueId() {
  return Math.random().toString(36).substring(2) + Date.now() .toString(36);
}

function cerrarNotificacion(id, event) {
  let notificacion = document.querySelector(`.notification[data-id="${id}"]`);
  document.getElementById('notificaciones').removeChild(notificacion);
  event.stopPropagation();
}

function abrirEnlace(id, event){
  window.open("https://www.ctisl.es/");
  cerrarNotificacion(id, event);
}

//  funtion cerrarNotificacion(id){
//   var notificacion = document.querySelector(`.notificacion[data-id="${id}"]`);
//   var notificaciones = document.getElementsByClassName('notificacion');
//   notificacion.style.opacity = 0;
//   setTimeout(function() {
//     notificacion.remove();
//     for (var i = id - 1; i < notificaciones.length; i++) {
//       notificaciones[i].style.bottom = parseInt(notificaciones[i].style.bottom) - 120 + 'px';
//     }
//     contadorNotificaciones--;
//   }, 300);
// }
