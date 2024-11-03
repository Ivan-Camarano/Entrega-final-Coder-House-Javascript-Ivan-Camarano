// Array para manejar las tareas activas y las eliminadas
let tareas = [];
let historial = [];

// Cargar tareas e historial desde el almacenamiento local o archivo JSON inicial
async function cargarDatos() {
  try {
    // Intento cargar tareas desde un archivo JSON
    const response = await fetch('tareas.json');
    if (!response.ok) throw new Error('Error al cargar el archivo JSON');
    const tareasJSON = await response.json();
    tareas = tareasJSON;
  } catch (error) {
    console.error("No se pudo cargar el archivo JSON, usando localStorage:", error);
    tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  }

  historial = JSON.parse(localStorage.getItem("historial")) || [];

  mostrarTareas();
  mostrarHistorial();
}

// Guardar tareas e historial en localStorage
function guardarDatos() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
  localStorage.setItem("historial", JSON.stringify(historial));
}

// Agregar una nueva tarea con sus detalles
function agregarTarea() {
  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const prioridad = document.getElementById("prioridad").value;
  const fecha = new Date().toLocaleDateString();

  if (!titulo) {
    Swal.fire("Ups!", "La tarea necesita un título", "error");
    return;
  }

  const nuevaTarea = {
    id: Date.now(),
    titulo,
    descripcion,
    prioridad,
    fecha,
    estado: "Pendiente"
  };

  tareas.push(nuevaTarea);
  guardarDatos();
  mostrarTareas();
  Swal.fire("¡Tarea añadida!", "Tu nueva tarea ha sido guardada", "success");
}

// Eliminar tarea y pasarla al historial
function eliminarTarea(id) {
  const tareaEliminada = tareas.find(tarea => tarea.id === id);
  
  Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás recuperarla una vez eliminada.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminarla",
  }).then((result) => {
    if (result.isConfirmed) {
      tareas = tareas.filter(tarea => tarea.id !== id);
      historial.push(tareaEliminada);
      guardarDatos();
      mostrarTareas();
      mostrarHistorial();
      Swal.fire("Eliminada", "La tarea ha sido eliminada", "success");
    }
  });
}

// Marcar tarea como completada o pendiente
function marcarCompletada(id) {
  const tarea = tareas.find(tarea => tarea.id === id);
  if (tarea) {
    tarea.estado = tarea.estado === "Pendiente" ? "Completada" : "Pendiente";
    guardarDatos();
    mostrarTareas();
  }
}

// Mostrar tareas activas en el DOM
function mostrarTareas() {
  const listaTareas = document.getElementById("lista-tareas");
  listaTareas.innerHTML = "";

  tareas.forEach(tarea => {
    const tareaDiv = document.createElement("div");
    tareaDiv.classList.add("tarea");
    if (tarea.estado === "Completada") tareaDiv.classList.add("completada");

    tareaDiv.classList.add(tarea.prioridad.toLowerCase());

    tareaDiv.innerHTML = `
      <h3>${tarea.titulo}</h3>
      <p>${tarea.descripcion}</p>
      <p><strong>Fecha:</strong> ${tarea.fecha}</p>
      <p><strong>Prioridad:</strong> ${tarea.prioridad}</p>
      <p><strong>Estado:</strong> ${tarea.estado}</p>
      <div class="acciones">
        <button class="boton" onclick="marcarCompletada(${tarea.id})">Marcar ${tarea.estado === "Pendiente" ? "Completada" : "Pendiente"}</button>
        <button class="boton" onclick="eliminarTarea(${tarea.id})">Eliminar</button>
      </div>
    `;

    listaTareas.appendChild(tareaDiv);
  });
}

// Mostrar historial de tareas eliminadas en el DOM
function mostrarHistorial() {
  const historialDiv = document.getElementById("historial-tareas");
  historialDiv.innerHTML = "";

  historial.forEach(tarea => {
    const tareaDiv = document.createElement("div");
    tareaDiv.classList.add("tarea");

    tareaDiv.innerHTML = `
      <h3>${tarea.titulo} (Eliminada)</h3>
      <p>${tarea.descripcion}</p>
      <p><strong>Fecha:</strong> ${tarea.fecha}</p>
      <p><strong>Prioridad:</strong> ${tarea.prioridad}</p>
    `;

    historialDiv.appendChild(tareaDiv);
  });
}

// Limpiar historial de tareas eliminadas
function limpiarHistorial() {
  Swal.fire({
    title: "¿Quieres limpiar el historial?",
    text: "Esto borrará todas las tareas eliminadas.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, limpiar",
  }).then((result) => {
    if (result.isConfirmed) {
      historial = [];
      guardarDatos();
      mostrarHistorial();
      Swal.fire("Historial limpio", "Todas las tareas eliminadas han sido borradas", "success");
    }
  });
}

// Filtrar tareas por prioridad
function filtrarTareas() {
  const prioridadSeleccionada = document.getElementById("filtrarPrioridad").value;
  const tareasFiltradas = prioridadSeleccionada ? tareas.filter(tarea => tarea.prioridad === prioridadSeleccionada) : tareas;
  
  mostrarTareasFiltradas(tareasFiltradas);
}

// Mostrar tareas filtradas en el DOM
function mostrarTareasFiltradas(tareasFiltradas) {
  const listaTareas = document.getElementById("lista-tareas");
  listaTareas.innerHTML = "";

  tareasFiltradas.forEach(tarea => {
    const tareaDiv = document.createElement("div");
    tareaDiv.classList.add("tarea");
    if (tarea.estado === "Completada") tareaDiv.classList.add("completada");

    tareaDiv.classList.add(tarea.prioridad.toLowerCase());

    tareaDiv.innerHTML = `
      <h3>${tarea.titulo}</h3>
      <p>${tarea.descripcion}</p>
      <p><strong>Fecha:</strong> ${tarea.fecha}</p>
      <p><strong>Prioridad:</strong> ${tarea.prioridad}</p>
      <p><strong>Estado:</strong> ${tarea.estado}</p>
      <div class="acciones">
        <button class="boton" onclick="marcarCompletada(${tarea.id})">Marcar ${tarea.estado === "Pendiente" ? "Completada" : "Pendiente"}</button>
        <button class="boton" onclick="eliminarTarea(${tarea.id})">Eliminar</button>
      </div>
    `;

    listaTareas.appendChild(tareaDiv);
  });
}

// Cargar datos al iniciar
cargarDatos();
