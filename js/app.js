"use strict";

//*Variables
const carrito = document.querySelector("#carrito");
const listaCursos = document.querySelector("#lista-cursos");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
let articulosCarrito = [];

cargarEventListeners();

function cargarEventListeners() {
  //*Cuando agregas un curso presionando 'Agregar al carrito'
  listaCursos.addEventListener("click", agregarCurso);
  //*eliminar cursos del carrito
  carrito.addEventListener("click", eliminarCurso);

  //*muestra los cursos del localStorage

  document.addEventListener("DOMContentLoaded", () => {
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carritoHTML();
  });

  //*vaciar carrito
  vaciarCarritoBtn.addEventListener("click", () => {
    articulosCarrito = []; //reseteamos el arreglo
    limpiarHTML(); //eliminamos todo el html
  });
}

//*Funciones
function agregarCurso(e) {
  e.preventDefault();

  if (e.target.classList.contains("agregar-carrito")) {
    const cursoSeleccionado = e.target.parentElement.parentElement;
    leerDatosCurso(cursoSeleccionado);
  }
}

//*Eliminar un curso del carrito

function eliminarCurso(e) {
  if (e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute("data-id");

    //eliminar el arreglo de articulosCarrito por el data-id

    articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId);

    carritoHTML();
  }
}

//*Lee el contenido del HTML al que le dimos click y extrae la información

function leerDatosCurso(curso) {
  //*Crear un objeto con el contenido del curso actual
  //console.log(curso);
  const infoCurso = {
    imagen: curso.querySelector("img").src,
    titulo: curso.querySelector("h4").textContent,
    precio: parseFloat(curso.querySelector(".precio span").textContent),
    id: curso.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };
  console.log(infoCurso.precio);
  //*Revisa si un elemento ya existe en el carrito
  const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);

  if (existe) {
    //*Actualizamos la cantidad
    const cursos = articulosCarrito.map((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        curso.precio = parseFloat(curso.precio) + parseFloat(infoCurso.precio);

        return curso; //* retorna el objeto actualizado
      } else {
        return curso; //retorna los objetos que no son duplicados
      }
    });
    articulosCarrito = [...cursos];
  } else {
    //*Agrega elementos al arreglo de carrito
    articulosCarrito = [...articulosCarrito, infoCurso];
  }

  console.log(articulosCarrito);

  carritoHTML();
}

//*Muestra el carrito en el HTML

function carritoHTML() {
  //*Limpiar el HTML

  limpiarHTML();

  //*Recorre el carrito y genera el Html
  articulosCarrito.forEach((curso) => {
    const row = document.createElement("tr");
    row.innerHTML = `

    <td>
      <img src='${curso.imagen}'width='120'>
    </td>
    <td>
      ${curso.titulo}
    </td>
     <td>

      $${curso.precio.toFixed(2)}
    </td>
     <td>

      ${curso.cantidad}
    </td>

    <td>

    <a href="#" class="borrar-curso" data-id="${curso.id}"> X </a>
    </td>



    
    `;

    //*Agrega el HTML del Carrito en el tbody

    contenedorCarrito.appendChild(row);
  });

  //*agregar el carrito de compras a storage

  sincronizarStorage();
}

function sincronizarStorage() {
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

//*elimina los cursos del tbody

function limpiarHTML() {
  //forma lenta
  // contenedorCarrito.innerHTML = '';

  //forma rápida
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}
