
const canvas = document.getElementById("planoCartesiano");
const ctx = canvas.getContext("2d");

// Dibujar ejes X e Y
ctx.beginPath();
ctx.moveTo(0, canvas.height / 2);
ctx.lineTo(canvas.width, canvas.height / 2);
ctx.moveTo(canvas.width / 2, 0);
ctx.lineTo(canvas.width / 2, canvas.height);
ctx.strokeStyle = "black";
ctx.stroke();

// Dibujar divisiones en los ejes X e Y
for (let i = 0; i < canvas.width; i += 10) {
  ctx.beginPath();
  ctx.moveTo(i, canvas.height / 2 - 5);
  ctx.lineTo(i, canvas.height / 2 + 5);
  ctx.stroke();
}

for (let i = 0; i < canvas.height; i += 10) {
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 5, i);
  ctx.lineTo(canvas.width / 2 + 5, i);
  ctx.stroke();
}


document.getElementById("Formulario").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que se recargue la página

    const restriccionInput = document.getElementById("Restricciones");
    const restriccionValue = restriccionInput.value;

    // Crear radio button
    const radio = document.createElement("input");
    radio.setAttribute("type", "radio");
    radio.setAttribute("id", "restriccionRadio");
    radio.setAttribute("name", "restriccion");
    radio.setAttribute("value", restriccionValue);

    // Crear label
    const label = document.createElement("label");
    label.setAttribute("for", "restriccionRadio");
    label.textContent = restriccionValue;

    // Agregar radio button y label a la sección de Datos Procesados
    const datosProcesados = document.getElementById("Datos-Procesados");
    datosProcesados.appendChild(radio);
    datosProcesados.appendChild(label);

    // Limpiar el input de restricciones
    restriccionInput.value = "";
  });
