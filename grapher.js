//Funcion para eliminar Problemas de numeros Decimales que varian muy poco 1.666666667 1.6666666665
function RedondearDecimal(number, decimalPlaces) {
  const factor = 10 ** decimalPlaces;
  return Math.round(number * factor) / factor;
}
function decimalAFraccion(numero) {
  if (!isNaN(numero) && numero % 1 !== 0) {
    let fraccion = math.fraction(numero);
    let signo = fraccion.s == -1 ? "-" : "";
    return signo + fraccion.n + "/" + fraccion.d;
  }
  return numero;
}

function validarPunto(linea, puntoAdicional, sentido) {
  const valorPuntoLinea1 = linea[0];
  const valorPuntoLinea2 = linea[1];
  // ecuacion de la pendiente donde se determina los cambio de cada punto de la linea.
  const pendiente =
    (valorPuntoLinea2.y - valorPuntoLinea1.y) /
    (valorPuntoLinea2.x - valorPuntoLinea1.x);

  const yEsperado = RedondearDecimal(
    valorPuntoLinea1.y + pendiente * (puntoAdicional.x - valorPuntoLinea1.x),
    10
  );
  // console.log("Y esperado : ",yEsperado, "Valor de la pendiente : ",pendiente);
  if (sentido == 2) {
    sentido = 0;
  }
  // console.log("Punto Validado : ",puntoAdicional.y > yEsperado ? sentido===0 : puntoAdicional.y < yEsperado ? sentido : true);
  return RedondearDecimal(puntoAdicional.y, 10) > yEsperado
    ? !sentido
    : RedondearDecimal(puntoAdicional.y, 10) < yEsperado
    ? sentido
    : true;
}

function InterseccionesMetodoCrammerDeterminante(restricciones) {
  //console.log("Encontrar reestricciones : ",restricciones);
  const listPointsInter = [];
  for (let i = 0; i < restricciones.length - 1; i++) {
    for (let j = i + 1; j < restricciones.length; j++) {
      // El calculo del determinante es el mismo tanto para X como para Y entonces deacuerdo a esto podermos generar si es !=0;
      const determinante =
        restricciones[i][1] * restricciones[j][0] -
        restricciones[j][1] * restricciones[i][0];
      // console.log("Position en Linea : ",i+1,"Position en Linea : ",j+1, "valor en determinante: ",determinante);
      if (determinante !== 0) {
        const y =
          (restricciones[i][3] * restricciones[j][0] -
            restricciones[j][3] * restricciones[i][0]) /
          determinante;
        const x =
          (restricciones[i][1] * restricciones[j][3] -
            restricciones[j][1] * restricciones[i][3]) /
          determinante;
        //Como tenemos que X y Y >=0 solo debemos recoger las intersecciones entre el cuadrante 1.
        if (x > 0 && y > 0) {
          listPointsInter.push({ x, y });
        }
      }
    }
  }
  //devolvemos la lista de intersecciones pero tambien esta el caso donde el cuadrante es 0 entonces por eso generamos un ingreso de interseccion en (0,0);
  listPointsInter.push({ x: 0, y: 0 });
  return listPointsInter;
}

// Función para encontrar los valores máximos de 'x' y 'y' en un array de objetos y en el array de elementos
function ValoresMaximosGrafica(elementosArray) {
  return elementosArray.reduce(
    (acc, elemento) => {
      const { maxX, maxY } = elemento.data.reduce(
        (innerAcc, obj) => ({
          maxX: Math.max(innerAcc.maxX, obj.x),
          maxY: Math.max(innerAcc.maxY, obj.y),
        }),
        { maxX: -Infinity, maxY: -Infinity }
      );

      return {
        maxGlobalX: Math.max(acc.maxGlobalX, maxX),
        maxGlobalY: Math.max(acc.maxGlobalY, maxY),
      };
    },
    { maxGlobalX: -Infinity, maxGlobalY: -Infinity }
  );
}

function ObtenerColorRectaAleatorio() {
  const minColorValue = 50; // Valor mínimo para cada componente de color

  const componenteColor = () =>
    Math.floor(Math.random() * (255 - minColorValue) + minColorValue).toString(
      16
    );

  const color = `#${componenteColor()}${componenteColor()}${componenteColor()}`;

  return color;
}

// Esta funcion se realiza para el caso especial donde se esta manejando rectas en el origen
function TraerCasoEspecialValorY(elementoX, valueX, elementoY, costante) {
  let varx = elementoX * valueX * -1;
  return (costante + varx) / elementoY;
}

function NumeroRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function crearTablaResultados(valoresFObjTotales) {
  const contenedor = document.getElementById("Container-Table");
  contenedor.innerHTML = "";
  contenedor.style.display = "";
  // Crear una tabla
  const tabla = document.createElement("table");
  const cabecera = tabla.createTHead();
  const filaCabecera = cabecera.insertRow();
  for (let clave in valoresFObjTotales[0]) {
    const th = document.createElement("th");
    th.textContent = clave;
    filaCabecera.appendChild(th);
  }

  // Crear el cuerpo de la tabla
  const cuerpo = tabla.createTBody();
  cuerpo.classList.add("primeraFila");
  valoresFObjTotales.forEach((valor) => {
    const fila = cuerpo.insertRow();
    for (let clave in valor) {
      const celda = fila.insertCell();
      celda.textContent = valor[clave];
    }
  });
  contenedor.appendChild(tabla);
}

function RemoverCanvas() {
  // remover el canvas si ya existe se le puede agragar otra condicion
  if (VarCanvas) {
    ContenedorCanvas.removeChild(VarCanvas);
    $("#graph-label").empty();
  }
}
function InicializarCanvas() {
  NuevoCanvas.id = "graphCanvas";
  NuevoCanvas.width = 800;
  NuevoCanvas.height = 500;
  console.log(Reestricciones);
  ContenedorCanvas.appendChild(NuevoCanvas);
  const CanvasCreation = NuevoCanvas.getContext("2d");
}

function GenerarInformacionRectas(NumeroRecta, data, Direccion) {
  //traemos el colores de cada una de las lineas.
  let color = ObtenerColorRectaAleatorio();
  // generamos los datos de las lineas que se van a mostrar en la grafica.
  DatosCoordenadas.push({
    type: "line",
    label: "Lineas " + (NumeroRecta+ 1),
    data, //datos de X,Y para la generacion de cada linea
    borderColor: color, //color de la linea
    borderWidth: 3, //Borde de la linea
    fill: Direccion ? "start" : "end", // Activar el relleno del área debajo de la línea
    backgroundColor: color + "20", // Color del área sombreada
  });
}

function ObtenerPuntosRectasGrafica() {
  // puntos de las rectas
  for (let i = 0; i < Reestricciones.length; i++) {
    let contx = 0;

    let conty = 0;
    let pointX = Math.abs(Reestricciones[i][3] / Reestricciones[i][0]);
    let pointY = Math.abs(Reestricciones[i][3] / Reestricciones[i][1]);
    maxVarX < pointX ? (maxVarX = pointX) : "";

    // caso especial donde la recta queda en el origen lo que hace que no se genere una recta.
    if ((pointX == 0) & (pointY == 0)) {
      // contx=NumeroRandom(5,maxVarX);
      contx = maxVarX;
      pointY = TraerCasoEspecialValorY(
        Reestricciones[i][0],
        contx,
        Reestricciones[i][1],
        Reestricciones[i][3]
      );
    }
    //se realiza un sort o ordenamiento de los datos deacuerdo a los elementos Y.
    let data = [
      { x: pointX, y: conty },
      { x: contx, y: pointY },
    ].sort((a, b) => b.y - a.y);
    GenerarInformacionRectas(i, data, Reestricciones[i][2]);
  }

  
}

// Variables Canvas
const VarCanvas = document.getElementById("graphCanvas");
const ContenedorCanvas = document.getElementById("canvas-row-container");
const NuevoCanvas = document.createElement("canvas");
// Variables de las Restricciones
let DatosCoordenadas = [];
let maxVarX = -Infinity;
// variables Intersecciones
let intersecciones = [];

function GraficarPPL() {
  
  // Canvas
  RemoverCanvas();
  InicializarCanvas();
  ObtenerPuntosRectasGrafica();
  //revisar aqui esto :
  //Obtenemos los valores maximos para cada unos de los ejes para la generacion de la grafica correctamente.
  const { maxGlobalX: MaxEjeX, maxGlobalY: MaxEjeY } =ValoresMaximosGrafica(DatosCoordenadas);
  
  // Obtencion de intersecciones Basicas
  for (let i = 0; i < DatosCoordenadas.length; i++) {
    for (let j = 0; j < DatosCoordenadas[i].data.length; j++) {
      if (
        DatosCoordenadas[i].data[j].x == 0 ||
        DatosCoordenadas[i].data[j].y == 0
      ) {
        intersecciones.push(DatosCoordenadas[i].data[j]);
        // console.log("Primer If Interseccion :  x: ",DatosCoordenadas[i].data[j].x, " y: ",DatosCoordenadas[i].data[j].y);
      }
      // En alguno de los casos se puede dar un error y los valores de las coordenadas X Y pueden quedar como valores Infinitos o un valor mayor al eje Perteneciente por lo cual en este caso se modifica de manera que tenga los valores de las coordenadas del siguiente elemento y el maximoGlobal sumandole 10.
      if (DatosCoordenadas[i].data[j].x == Infinity) {
        // El valor X afecta la grafica por lo cual se necesita una grafica Enfocada en las lineas sin malgastar espacio.
        DatosCoordenadas[i].data[j].x = MaxEjeX;
        // Operador ternario para obtener la posicion de los datos.
        DatosCoordenadas[i].data[j].y =
          DatosCoordenadas[i].data[
            j == DatosCoordenadas[i].data.length - 1 ? j - 1 : j + 1
          ].y;
      }

      if (DatosCoordenadas[i].data[j].y == Infinity) {
        // como el eje Y es el eje dependiente del X entonces se le puede sumar 10 puntos a la coordenada maxima.
        DatosCoordenadas[i].data[j].y = MaxEjeY + 10;
        // Operador ternario para obtener la posicion de los datos.
        DatosCoordenadas[i].data[j].x =
          DatosCoordenadas[i].data[
            j == DatosCoordenadas[i].data.length - 1 ? j - 1 : j + 1
          ].x;
      }
    }
  }
  // console.log("Intersecciones : ",intersecciones)

  // Intersecciones de las rectas
  intersecciones.push(
    ...InterseccionesMetodoCrammerDeterminante(Reestricciones)
  );
  // intersecciones que se pueden considerar validas
  let interseccionesValidas = [...intersecciones];
  console.log("Intersecciones Validas", interseccionesValidas);
  // Llamada a la función para encontrar intersecciones
  for (let i = 0; i < DatosCoordenadas.length; i++) {
    interseccionesValidas = interseccionesValidas.filter((_, index) =>
      validarPunto(
        DatosCoordenadas[i].data,
        interseccionesValidas[index],
        Reestricciones[i][2]
      )
    );
  }

  console.log("intersecciones validas con FILTRO: ", interseccionesValidas);
  // Determinar las posibles soluciones con la ecuacion objetivo.
  let valoresFOTotales = [];
  for (let i = 0; i < interseccionesValidas.length; i++) {
    // Segun la Funcion objetivo me va guardar los valores obtenidos por cada interseccion ademas de las intersecciones para despues ser mostrados en una tabla.
    valoresFOTotales.push({
      result:
        ValuesObjetivo[0] * interseccionesValidas[i].x +
        ValuesObjetivo[1] * interseccionesValidas[i].y,
      x: interseccionesValidas[i].x,
      y: interseccionesValidas[i].y,
    });
  }
  console.log("Valores : ", valoresFOTotales);

  // Ordenar los valores totales para el objetivo del problema de programacion lineal
  valoresFOTotales = valoresFOTotales.sort((a, b) => {
    if (ObjetivoPPL == 0) {
      return a.result - b.result; // Orden ascendente
    } else {
      return b.result - a.result; // Orden descendente
    }
  });

  if (valoresFOTotales[0]) {
    DatosCoordenadas.push({
      data: [{ x: valoresFOTotales[0].x, y: valoresFOTotales[0].y }],
      label: "Solución",
      borderColor: "green",
      borderWidth: 4,
      pointBackgroundColor: "green",
      pointRadius: 4,
    });
  }

  // Se vuelven decimales todos valores para una mejor comprension
  for (let valor of valoresFOTotales) {
    valor.x = decimalAFraccion(valor.x);
    valor.y = decimalAFraccion(valor.y);
    valor.result = decimalAFraccion(valor.result);
  }

  DatosCoordenadas.push({
    data: interseccionesValidas,
    label: "Intersecciones",
    borderColor: "red",
    borderWidth: 1,
    pointBackgroundColor: "red",
    pointRadius: 5,
  });

  // let areaComun = {
  //   label: "Área Común",
  //   data: interseccionesValidas,
  //   type: "line",
  //   borderColor: "red",
  //   borderWidth: 3,
  //   fill: 1,
  //   backgroundColor: "yellow",
  // };

  // DatosCoordenadas.push(areaComun);

  console.log("Datos Coordenadas : ", DatosCoordenadas);

  const chartData = {
    type: "line",
    data: {
      datasets: DatosCoordenadas,
    },
    options: {
      plugins: {
        legend: {
          labels: {
            font: {
              size: 14,
            },
          },
        },
      },
      responsive: false,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "linear",
          position: "bottom",
        },
        y: {
          type: "linear",
          position: "left",
        },
      },
    },
  };

  let myChart = new Chart(NuevoCanvas, chartData);

  $("#graph-label").append(`
    <div class="col-auto py-0 px-2">
      <label
        for="funcion"
        class="col-sm-auto col-form-label text-end fw-bold variables-label"
        style="font-size: 16px"
        >${
          valoresFOTotales[0]
            ? `SOLUCION OPTIMA : X1 = ${valoresFOTotales[0].x}, X2 = ${valoresFOTotales[0].y}, Z = ${valoresFOTotales[0].result}`
            : "NO SE ENCUENTRA SOLUCIÓN"
        }</label
      >
    </div>
  </div>
  `);

  crearTablaResultados(valoresFOTotales);
}
