
/*
  Para practicar mis habilidades ire agregando a este proyecto Local Storage
*/
// VARIABLES
var precio = '$ 12';

console.log(precio.substring(2, precio.length));
const formulario = document.getElementById('agregar-gasto'),
      eliminarGasto = document.querySelector('ul.list-group'),
      nuevoPresupuesto = document.getElementById('btn-presupuesto'),
      limpiarGastos = document.getElementById('btn-limpiar');

let cantidadPresupuesto;

let presupuestoUsuario;

if (localStorage.getItem('presupuesto') === null || localStorage.getItem('presupuesto') == 'null') {
  presupuestoUsuario = prompt('¿Cual es tu presupuesto semanal?');
}
else{
  presupuestoUsuario = localStorage.getItem('presupuesto');
}
// console.log(presupuestoUsuario);


/*
 ==========================================
              ALMACENAMIENTO
 ==========================================
*/


/*
 =========================================
             PRESUPUESTO
 =========================================
*/
class Presupuesto{
  constructor(presupuesto){
    this.presupuesto = Number(presupuestoUsuario);
    this.restante = Number(presupuestoUsuario);
  }

  // METODO PARA IRLE RESTANDO AL PRESUPUESTO ACTUAL

  presupuestoRestante(cantidad = 0){
    return this.restante -= Number(cantidad);
  }

  // METODO PARA SUMAR LO ELIMINADO AL PRESUPUESTO ACTUAL

  presupuestoAgregado(monto = 0){
    return this.restante += Number(monto);
  }

  registrarNuevoPresupuesto(){
    const presupuestoNuevo = prompt('¿Cual es tu nuevo Presupuesto?'),
          restanteSpan = document.querySelector('span#restante'),
          ui = new Interfaz();

    // var i = 0;

    if (presupuestoNuevo <= 0 || presupuestoNuevo === null || presupuestoNuevo === '' || presupuestoNuevo == 'null') {
      localStorage.setItem('presupuesto', presupuestoUsuario);
      ui.insertarPresupuesto(presupuestoUsuario);
    }
    else{
      presupuestoUsuario = presupuestoNuevo;
      localStorage.setItem('presupuesto', presupuestoNuevo);
      ui.insertarPresupuesto(presupuestoUsuario);
      cantidadPresupuesto = new Presupuesto(presupuestoUsuario);

      let itemsGastos = document.querySelectorAll('.gasto-desc');
      let sumaGastos = 0;
      itemsGastos.forEach(function(elemento){
        let gastoNeto = elemento.innerText;
        gastoNeto = gastoNeto.substring(2, gastoNeto.length);
        sumaGastos += Number(gastoNeto);
      });

      cantidadPresupuesto.presupuestoRestante(sumaGastos);
      restanteSpan.innerHTML = cantidadPresupuesto.restante;
      ui.comprobarPresupuesto();
    }





    // xusuario.insertarPresupuesto(presupuestoNuevo);
  }



}
class Almacenamiento{
  guardarPresupuesto(presupuestoInicial){
    localStorage.setItem('presupuesto', presupuestoInicial);
  }

  agregarGastoLocalStorage(detallesGasto){
    let gastoLS = this.obtenerGastosLocalStorage();

    gastoLS.push(detallesGasto);

    localStorage.setItem('gasto', JSON.stringify(gastoLS));
    console.log('Agregado Correcamente al Local Storage');
  }

  eliminarGastoLocalStorage(descripcionGasto){
    // let gastoLS = this.obtenerGastosLocalStorage();
  }

  obtenerGastosLocalStorage(){
    let gastos;

    if (localStorage.getItem('gasto') === null){
      gastos = [];
    }else{
      gastos = JSON.parse( localStorage.getItem('gasto') );
    }

    return gastos;
  }

  limpiarGastosLocalStorage(){
    localStorage.setItem('gasto', JSON.stringify([]));

    const ui = new Interfaz();
    ui.insertarPresupuesto(document.getElementById('total').innerHTML);


    let itemsGastos = document.querySelectorAll('.gasto-desc');
    let sumaGastos = 0;
    itemsGastos.forEach(function(elemento){
      let gastoNeto = elemento.innerText;
      gastoNeto = gastoNeto.substring(2, gastoNeto.length);
      sumaGastos += Number(gastoNeto);
    });

    cantidadPresupuesto.presupuestoAgregado(sumaGastos);

    // console.log(cantidadPresupuesto);

    const restante = document.querySelector('.restante');
    restante.className = 'restante alert alert-success';
    eliminarGasto.innerHTML = '';

  }

  leerGastosLocalStorage(){
    let gastosLS;
    gastosLS = this.obtenerGastosLocalStorage();
    const gastoListado = document.querySelector('#gastos ul'),
          restanteSpan = document.querySelector('span#restante'),
          ui = new Interfaz();

    gastosLS.forEach(function(gasto){



      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      // Insertar el gasto
      li.innerHTML = `
        <span id="detalleGasto">${gasto.descripcion}</span>
        <div>
          <span class="badge badge-primary badge-pill gasto-desc"> $ ${gasto.precio} </span>
          <span class="badge badge-danger badge-pill eliminar"> X </span>
        </div>
      `;

      // INSERTAR EL HTML
      gastoListado.appendChild(li);

    });

    let itemsGastos = document.querySelectorAll('.gasto-desc');
    let sumaGastos = 0;
    itemsGastos.forEach(function(elemento){
      let gastoNeto = elemento.innerText;
      gastoNeto = gastoNeto.substring(2, gastoNeto.length);
      sumaGastos += Number(gastoNeto);
    });

    cantidadPresupuesto.presupuestoRestante(sumaGastos);
    restanteSpan.innerHTML = cantidadPresupuesto.restante;
    ui.comprobarPresupuesto();
  }


}

/*
 =========================================
               INTERFAZ
 =========================================
*/
// SE ENCARGA DE MANEJAR TODA LA INTERACCION CON EL USUARIO
class Interfaz{


  insertarPresupuesto(cantidad){
    const presupuestoSpan = document.querySelector('span#total');
    const restanteSpan = document.querySelector('span#restante');

    // INSERTAR AL HTML
    presupuestoSpan.innerHTML= `${cantidad}`;
    restanteSpan.innerHTML= `${cantidad}`;
  }


  imprimirMensaje(mensaje, tipo){
    const divMensaje = document.createElement('div');

    divMensaje.classList.add('text-center', 'alert');
    if (tipo === 'error') {
      divMensaje.classList.add('alert-danger');
    }
    else{
      divMensaje.classList.add('alert-success')
    }

    divMensaje.appendChild(document.createTextNode(mensaje));

    // INSERTAR EN EL DOM
    document.querySelector('.primario').insertBefore(divMensaje, formulario);

    setTimeout(function(){
      divMensaje.remove();
      formulario.reset();
    }, 3000);


  }

  agregarGastoListado(nombre, cantidad){
    const gastoListado = document.querySelector('#gastos ul');

    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    // Insertar el gasto
    li.innerHTML = `
      <span id="detalleGasto">${nombre}</span>
      <div>
        <span class="badge badge-primary badge-pill gasto-desc"> $ ${cantidad} </span>
        <span class="badge badge-danger badge-pill eliminar"> X </span>
      </div>
    `;

    // INSERTAR EL HTML
    gastoListado.appendChild(li);
  }

  // COMPRUEBA EL PRESUPUESTO RESTANTE
  presupuestoRestante(cantidad){
    const restante = document.querySelector('span#restante');

    // Leer el presupuesto restante
    const presupuestoRestanteUsuario = cantidadPresupuesto.presupuestoRestante(cantidad);
    restante.innerHTML = `${presupuestoRestanteUsuario}`

    this.comprobarPresupuesto();
  }

  // CAMBIAR EL COLOR DEL RESTANTE

  comprobarPresupuesto(){

    const presupuestoTotal = Number(cantidadPresupuesto.presupuesto);
    const presupuestoRestante = cantidadPresupuesto.restante;

    // COMPROBAR EL 25% DEL GASTO

    if (presupuestoTotal / 4 > presupuestoRestante) {
      const restante = document.querySelector('.restante');

      restante.classList.remove('alert-success', 'alert-warning');
      restante.classList.add('alert-danger');
    }else{
      if (presupuestoTotal / 2 > presupuestoRestante) {
        const restante = document.querySelector('.restante');

        restante.classList.remove('alert-success');
        restante.classList.add('alert-warning');
      }
    }
    console.log('Se comprobo el presupuesto');
    // console.log(cantidadPresupuesto);
  }

}


/*
============================================
            EVENT LISTENERS
============================================
*/
/*
  Si el evento esta mal escrito tu codigo sigue funcionando sin que te mande error
*/
const local = new Almacenamiento();
document.addEventListener('DOMContentLoaded', function(){

  if (presupuestoUsuario === null || presupuestoUsuario === '' || presupuestoUsuario <= 0) {
    window.location.reload();
  }
  else{
    //Instanciando la clase presupuesto

    console.log('Agregado Correctamente');

    cantidadPresupuesto = new Presupuesto(presupuestoUsuario);

    // INSTANCIAR LA CLASE INTERFAZ

    const ui = new Interfaz();
    const local = new Almacenamiento();

    ui.insertarPresupuesto(cantidadPresupuesto.presupuesto);
    local.guardarPresupuesto(presupuestoUsuario);
    local.leerGastosLocalStorage();

    // console.log(cantidadPresupuesto);
  }
});

// EVENTO SUBMIT PARA AGREGAR UN NUEVO GASTO A NUESTRO PRESUPUESTO
formulario.addEventListener('submit', function(e){
  e.preventDefault();

  // Leer del formulario de gastos

  const nombreGasto = document.querySelector('#gasto').value;
  const cantidadGasto = document.querySelector('#cantidad').value;

  const ui = new Interfaz();

  if (nombreGasto === '' || cantidadGasto === '') {
    console.log('Hubo un error');
    ui.imprimirMensaje('Hubo un Error', 'error');
  }
  else{

    if (cantidadGasto > cantidadPresupuesto.restante) {
      ui.imprimirMensaje('No puedes gastar más de lo que tienes', 'error');
    }
    else{
      ui.imprimirMensaje('Gasto Agregado', 'exito');
      ui.agregarGastoListado(nombreGasto, cantidadGasto);
      ui.presupuestoRestante(cantidadGasto);


      var gastoLS = {
        descripcion: nombreGasto,
        precio: cantidadGasto
      }
      local.agregarGastoLocalStorage(gastoLS);
    }

  }

  // FIN DEL EVENTO
});

// EVENTO PARA ELIMINAR UN GASTO Y ELIMINARLO AL MISMO TIEMPO DEL LOCAL STORAGE

eliminarGasto.addEventListener('click', function(e){
  if (e.target.classList.contains('eliminar')) {
    // local.eliminarGastoLocalStorage(nombreGasto);
  }
  else{

  }
});

// REGISTRAR UN NUEVO PRESUPUESTO
nuevoPresupuesto.addEventListener('click', function(){

  const newPresupuesto = new Presupuesto();

  newPresupuesto.registrarNuevoPresupuesto();

});



// LIMPIAR LOCAL STORAGE

limpiarGastos.addEventListener('click', function(){
  local.limpiarGastosLocalStorage();
});









// FIN
