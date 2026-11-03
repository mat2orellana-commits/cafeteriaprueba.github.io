// Clasificación de notas:
// 9.0–10.0 Excelente | 7.0–8.9 Muy bueno | 6.0–6.9 Aprobado | 0.0–5.9 Reprobado
function clasificar(prom) {
  if (prom >= 9) return "Excelente";
  if (prom >= 7) return "Muy bueno";
  if (prom >= 6) return "Aprobado";
  return "Reprobado";
}

var ultimo = null; // guarda el último cálculo para el .txt

document.getElementById("f").addEventListener("submit", function (e) {
  e.preventDefault();
  var err = document.getElementById("err");
  var res = document.getElementById("resultado");
  var nombre = document.getElementById("nombre").value.trim();
  var nie = document.getElementById("nie").value.trim();
  var ids = ["n1", "n2", "n3", "ex"];
  var textos = [];
  var vals = [];

  err.textContent = "";
  res.classList.remove("on");
  ultimo = null;

  if (!nombre || !nie) {
    err.textContent = "Escribe el nombre y el NIE.";
    return;
  }
  for (var i = 0; i < ids.length; i++) {
    var raw = document.getElementById(ids[i]).value;
    var v = parseFloat(raw);
    if (raw === "" || isNaN(v) || v < 0 || v > 10) {
      err.textContent = "Cada nota debe ser un número entre 0 y 10.";
      document.getElementById(ids[i]).focus();
      return;
    }
    textos.push(raw);
    vals.push(v);
  }

  var prom = (vals[0] + vals[1] + vals[2] + vals[3]) / 4; // Promedio
  var clasif = clasificar(prom);

  document.getElementById("quien").textContent = nombre + " · NIE " + nie;
  document.getElementById("valor").textContent = prom.toFixed(2);
  var st = document.getElementById("estado");
  st.textContent = clasif;
  st.style.color = prom >= 6 ? "var(--good)" : "var(--bad)";
  res.classList.add("on");

  ultimo = { nombre: nombre, nie: nie, notas: textos, prom: prom, clasif: clasif };
});

// Guardar en archivo .txt con el formato pedido
document.getElementById("guardar").addEventListener("click", function () {
  if (!ultimo) return;
  var d = ultimo;
  var lineas = [
    "Entrada:",
    d.nombre,
    "",
    "Nota 1: " + d.notas[0],
    "Nota 2: " + d.notas[1],
    "Nota 3: " + d.notas[2],
    "Examen: " + d.notas[3],
    "Resultado:",
    "ESTUDIANTE: " + d.nombre,
    "",
    "NIE: " + d.nie,
    "",
    "Promedio: " + d.prom.toFixed(2),
    "Resultado: " + d.clasif.toUpperCase()
  ];
  var texto = lineas.join("\r\n");
  var blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "notas_" + d.nie.replace(/[^\w-]/g, "") + ".txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});