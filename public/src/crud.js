const tbody = document.getElementById("table").children[2];
const form = document.querySelector(".form-container");

function crearHTMLTarea() {
  let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

  // Limpiar el tbody antes de mostrar las nuevas tareas
  let tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  tareas.forEach((tarea) => {
    let fila = document.createElement("tr");
    for (let propiedad in tarea) {
      let td = document.createElement("td");
      if (propiedad !== "desc" && propiedad !== "id") {
        if (propiedad !== "prioridad") {
          td.textContent = tarea[propiedad];
        }

        if (propiedad === "tiempo") {
          let tiempoHoras = calcularTiempo(tarea[propiedad]);
          td.textContent = tiempoHoras;
        }
        // Añadir clase basada en la prioridad
        if (propiedad === "prioridad") {
          td.classList.add(`prioridad-${tarea[propiedad]}`);
          let span = document.createElement("span");
          span.textContent = tarea[propiedad];
          td.appendChild(span);
        }
        fila.appendChild(td);
      }
    }

    //Añadimos el boton de editar
    let tdEditar = document.createElement("td");
    let btnEditar = document.createElement("a");
    btnEditar.classList.add("btnEditar");
    btnEditar.setAttribute("data-id", tarea.id); // Asignar el id de la tarea
    let svgEditar = `<svg width="24" class="svg-editar" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M17.204 10.796L19 9C19.5453 8.45475 19.8179 8.18213 19.9636 7.88803C20.2409 7.32848 20.2409 6.67152 19.9636 6.11197C19.8179 5.81788 19.5453 5.54525 19 5C18.4548 4.45475 18.1821 4.18213 17.888 4.03639C17.3285 3.75911 16.6715 3.75911 16.112 4.03639C15.8179 4.18213 15.5453 4.45475 15 5L13.1814 6.81866C14.1452 8.46926 15.5314 9.84482 17.204 10.796ZM11.7269 8.27311L4.8564 15.1436C4.43134 15.5687 4.21881 15.7812 4.07907 16.0423C3.93934 16.3034 3.88039 16.5981 3.7625 17.1876L3.1471 20.2646C3.08058 20.5972 3.04732 20.7635 3.14193 20.8581C3.23654 20.9527 3.40284 20.9194 3.73545 20.8529L6.81243 20.2375C7.40189 20.1196 7.69661 20.0607 7.95771 19.9209C8.21881 19.7812 8.43134 19.5687 8.8564 19.1436L15.7458 12.2542C14.1241 11.2386 12.7524 9.87627 11.7269 8.27311Z" fill="#222222"/>
</svg>`;
    btnEditar.innerHTML = svgEditar;
    tdEditar.appendChild(btnEditar);
    fila.appendChild(tdEditar);

    //Añadimos el boton de eliminar
    let tdEliminar = document.createElement("td");
    let btnEliminar = document.createElement("a");
    let svgEliminar = `<svg width="24" class="svg-eliminar" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM7 13H17V11H7V13Z" fill="#222222"/>
</svg>`;
    btnEliminar.innerHTML = svgEliminar;
    btnEliminar.setAttribute("data-id", tarea.id); // Asignar el id de la tarea
    btnEliminar.classList.add("btnEliminar");
    tdEliminar.appendChild(btnEliminar);
    fila.appendChild(tdEliminar);

    //Agregamos la fila a la tabla
    tbody.appendChild(fila);
  });

  document.querySelectorAll(".btnEliminar").forEach((btn) => {
    btn.addEventListener("click", borrarTarea);
  });
}

const crearTarea = (e) => {
  e.preventDefault();

  let tarea = {
    id: "",
    nombre: "",
    tipo: "",
    prioridad: "",
    desc: "",
    tiempo: 0,
  };

  let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

  let id = generarID();

  const nombre = document.getElementById("name").value;
  const tipo = document.getElementById("tipe-select").value;
  const prioridad = document.getElementById("priority").value;
  const desc = document.getElementById("desc").value;
  const tiempo = document.getElementById("time").value;

  let nuevaTarea = { ...tarea };
  nuevaTarea.id = id;
  nuevaTarea.nombre = nombre;
  nuevaTarea.tipo = tipo;
  nuevaTarea.prioridad = prioridad;
  nuevaTarea.desc = desc;
  nuevaTarea.tiempo = tiempo;

  tareas.push(nuevaTarea);

  localStorage.setItem("tareas", JSON.stringify(tareas));
  crearHTMLTarea();

  limpiarFormulario();
};

window.addEventListener("DOMContentLoaded", crearHTMLTarea);
form.addEventListener("submit", crearTarea);

const limpiarFormulario = () => {
  document.getElementById("name").value = "";
  document.getElementById("tipe-select").value = "";
  document.getElementById("priority").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("time").value = "";
};

function generarID() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function borrarTarea(e) {
  e.preventDefault();

  let tareaBorrar = e.target.closest("a");
  let idTareaBorrar = tareaBorrar.getAttribute("data-id");

  let tareas = JSON.parse(localStorage.getItem("tareas"));

  let nuevasTareas = tareas.filter((tarea) => tarea.id !== idTareaBorrar);
  localStorage.setItem("tareas", JSON.stringify(nuevasTareas));

  crearHTMLTarea();
}

function calcularTiempo(tiempo) {
  let horas = 0;
  let min = 0;
  if (tiempo > 60) {
    let horas = parseInt(tiempo / 60);
    let min = parseInt(tiempo % 60);
    return `${horas}h : ${min}min`;
  } else {
    return `${tiempo} min`;
  }
}
