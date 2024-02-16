var contadorNotificaciones = 0;

document.getElementById('abrirNotificacion').addEventListener('click', function() {
  let maxNotification = 4;
  let id = parseInt(generateUniqueId());
  let date = new Date();
  
  var notificacion = document.createElement('div');
  notificacion.className = 'notificacion';
  notificacion.dataset.id = id; // asignamos un id a la notificación
  notificacion.innerHTML = `
  <div class="notification">
  <button class="closeButton" onclick="cerrarNotificacion(${id})"><strong>x</strong></button>
  <table class="infoNotification">
  <tr>
  <td rowspan="3" class="imageCell"><img src="cti.png" alt="Imagen" class="imagen"></img></td>
  <td colspan="3" class="title">Titulo de la notificacion ${contadorNotificaciones}</td>
  </tr>
  <tr>
  <td colspan="3">Esto es una prueba sobre la descripción de una notificación</td>
  </tr>
      <tr>
      <td colspan="3">${date.getHours()}:${date.getMinutes()} · cti.es</td>
        
      </tr>
      </table>
      </div>
      `;
      
      let children = document.getElementById('notificaciones').children;
      if(children.length >= maxNotification){
        for(var i = 0; i < children.length && children.length >= maxNotification; i++) {
          document.getElementById('notificaciones').removeChild(children[i]);
        }
      }
      
      document.getElementById('notificaciones').appendChild(notificacion);
      contadorNotificaciones++;
});

function generateUniqueId() {
  return Math.random().toString(36).substring(2) + Date.now() .toString(36);
}

function cerrarNotificacion(id) {
  let notificacion = document.querySelector(`.notificacion[data-id="${id}"]`);
  document.getElementById('notificaciones').removeChild(notificacion);
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
