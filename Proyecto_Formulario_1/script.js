// ===== Datos =====
// Cada elemento del arreglo es un REGISTRO; cada propiedad es un CAMPO.
var estudiantes = [];

var formulario = document.getElementById("formulario");
var mensaje = document.getElementById("mensaje");
var tabla = document.getElementById("tabla");
var vista = document.getElementById("vista");

// ===== Utilidades =====
function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = tipo; // "ok" o "error"
}

// Convierte un número en código de 3 dígitos: 1 -> "001"
function crearCodigo(numero) {
  return String(numero).padStart(3, "0");
}

// Convierte un estudiante en una línea de texto con el separador |
function registroALinea(e) {
  return [e.codigo, e.nombre, e.nie, e.edad, e.grado, e.seccion, e.correo, e.telefono].join("|");
}

// Convierte todos los estudiantes en el contenido completo del TXT
function generarTexto() {
  return estudiantes.map(registroALinea).join("\r\n");
}

// ===== Mostrar en pantalla =====
function mostrarEstudiantes() {
  tabla.innerHTML = "";

  if (estudiantes.length === 0) {
    tabla.innerHTML = '<tr><td colspan="8" class="vacio">Aún no hay estudiantes. Registra el primero con el formulario.</td></tr>';
    vista.textContent = "(vacío)";
    return;
  }

  estudiantes.forEach(function (e) {
    var fila = document.createElement("tr");
    var campos = [e.codigo, e.nombre, e.nie, e.edad, e.grado, e.seccion, e.correo, e.telefono];
    campos.forEach(function (valor) {
      var celda = document.createElement("td");
      celda.textContent = valor; // textContent evita insertar HTML por error
      fila.appendChild(celda);
    });
    tabla.appendChild(fila);
  });

  vista.textContent = generarTexto();
}

// ===== 1. Registrar estudiante =====
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault(); // evita que la página se recargue

  // 1. Capturar los datos
  var campos = {
    nombre: document.getElementById("nombre"),
    nie: document.getElementById("nie"),
    edad: document.getElementById("edad"),
    grado: document.getElementById("grado"),
    seccion: document.getElementById("seccion"),
    correo: document.getElementById("correo"),
    telefono: document.getElementById("telefono")
  };

  // 2. Validar que no estén vacíos
  var hayVacios = false;
  for (var nombre in campos) {
    var vacio = campos[nombre].value.trim() === "";
    campos[nombre].classList.toggle("invalido", vacio);
    if (vacio) hayVacios = true;
  }
  if (hayVacios) {
    mostrarMensaje("Completa todos los campos marcados en rojo.", "error");
    return;
  }

  // Validaciones extra
  var edad = Number(campos.edad.value);
  if (!Number.isInteger(edad) || edad < 5 || edad > 99) {
    campos.edad.classList.add("invalido");
    mostrarMensaje("La edad debe ser un número entero entre 5 y 99.", "error");
    return;
  }
  if (campos.correo.value.indexOf("@") === -1) {
    campos.correo.classList.add("invalido");
    mostrarMensaje("Escribe un correo válido, por ejemplo nombre@gmail.com.", "error");
    return;
  }
  // El carácter | es el separador, no puede usarse dentro de un dato
  for (var n in campos) {
    if (campos[n].value.indexOf("|") !== -1) {
      campos[n].classList.add("invalido");
      mostrarMensaje('No uses el carácter "|" en los datos.', "error");
      return;
    }
  }

  // 3. Crear un registro
  var siguiente = estudiantes.length + 1;
  var registro = {
    codigo: crearCodigo(siguiente),
    nombre: campos.nombre.value.trim(),
    nie: campos.nie.value.trim(),
    edad: String(edad),
    grado: campos.grado.value,
    seccion: campos.seccion.value,
    correo: campos.correo.value.trim(),
    telefono: campos.telefono.value.trim()
  };
  estudiantes.push(registro);

  // 4 y 5. Mostrar en pantalla y actualizar el contenido del TXT
  mostrarEstudiantes();
  mostrarMensaje("Estudiante " + registro.codigo + " registrado.", "ok");
  formulario.reset();
  campos.nombre.focus();
});

// ===== 2. Reto: descargar estudiantes.txt =====
document.getElementById("descargar").addEventListener("click", function () {
  if (estudiantes.length === 0) {
    mostrarMensaje("No hay estudiantes para descargar.", "error");
    return;
  }
  var blob = new Blob([generarTexto()], { type: "text/plain;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = "estudiantes.txt";
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
  mostrarMensaje("Archivo estudiantes.txt descargado.", "ok");
});

// ===== 3. Segundo reto: cargar archivo TXT =====
document.getElementById("archivo").addEventListener("change", function (evento) {
  var archivo = evento.target.files[0];
  if (!archivo) return;

  var lector = new FileReader();
  lector.onload = function () {
    var lineas = lector.result.split(/\r?\n/); // cada línea = un registro
    var cargados = [];
    var omitidas = 0;

    lineas.forEach(function (linea) {
      if (linea.trim() === "") return;
      var campos = linea.split("|"); // cada parte = un campo
      if (campos.length !== 8) { omitidas++; return; }
      cargados.push({
        codigo: campos[0], nombre: campos[1], nie: campos[2], edad: campos[3],
        grado: campos[4], seccion: campos[5], correo: campos[6], telefono: campos[7]
      });
    });

    if (cargados.length === 0) {
      mostrarMensaje("El archivo no tiene registros válidos (8 campos separados por |).", "error");
    } else {
      estudiantes = cargados;
      mostrarEstudiantes();
      var aviso = cargados.length + " registros cargados.";
      if (omitidas > 0) aviso += " Líneas omitidas: " + omitidas + ".";
      mostrarMensaje(aviso, "ok");
    }
    evento.target.value = ""; // permite volver a elegir el mismo archivo
  };
  lector.onerror = function () {
    mostrarMensaje("No se pudo leer el archivo.", "error");
  };
  lector.readAsText(archivo, "UTF-8");
});