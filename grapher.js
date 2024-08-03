// Variables Canvas
let VarCanvas;
const ContenedorCanvas = document.getElementById("canvas-row-container");
const NuevoCanvas = document.createElement("canvas");
let MaxEjeX = 0;
let maxVarX = -Infinity;

// Metodo para eliminar el canva cuando ya se ha realizado una Grafica
function RemoverCanvas() {
  // actualizamos el canvas
  VarCanvas = document.getElementById("graphCanvas");
  // remover el canvas si ya existe se le puede agragar otra condicion
  if (VarCanvas) {
    ContenedorCanvas.removeChild(VarCanvas);
    $("#graph-label").empty();
  }
}
// metodo para inicializar el nuevo canvas
function InicializarCanvas() {
  NuevoCanvas.id = "graphCanvas";
  NuevoCanvas.width = 800;
  NuevoCanvas.height = 500;
  ContenedorCanvas.appendChild(NuevoCanvas);
  const CanvasCreation = NuevoCanvas.getContext("2d");
}

// Metodo para obtener los puntos de las rectas  de la grafica
function ObtenerPuntosRectasGrafica(restriccion, nombre_recta = null) {
  // Variable para Info Rectas
  let R = [];
  // puntos de las rectas
  for (let i = 0; i < restriccion.length; i++) {
    let contx = 0;

    let conty = 0;
    let pointX = Math.abs(restriccion[i][3] / restriccion[i][0]);
    let pointY = Math.abs(restriccion[i][3] / restriccion[i][1]);
    maxVarX < pointX ? (maxVarX = pointX) : "";

    // caso especial donde la recta queda en el origen lo que hace que no se genere una recta.
    if ((pointX == 0) & (pointY == 0)) {
      // contx=NumeroRandom(5,maxVarX);
      contx = maxVarX;
      pointY = TraerCasoEspecialValorY(
        restriccion[i][0],
        contx,
        restriccion[i][1],
        restriccion[i][3]
      );
    }
    // Se crea un arrego para los puntos una recta x1 x2 y1 y2
    let data = [
      { x: pointX, y: conty },
      { x: contx, y: pointY },
      //se realiza un sort o ordenamiento de los datos deacuerdo a los elementos Y.
    ].sort((a, b) => b.y - a.y);

    // Generamos la Informacion respectiva para la Recta
    R.push(GenerarInformacionRectas(i, data, restriccion[i][2], nombre_recta));
  }
  // retornando Informacion De Rectas
  return R;
}

// Generarcion de los detalles para las rectas
function GenerarInformacionRectas(NumeroRecta, data, Direccion, nombre = null) {
  //traemos el colores de cada una de las lineas.
  let color = ObtenerColorRectaAleatorio();
  // generamos los datos de las lineas que se van a mostrar en la grafica.
  return {
    type: "line",
    label: nombre ? nombre : "Lineas " + (NumeroRecta + 1),
    data, //datos de X,Y para la generacion de cada linea
    borderColor: color, //color de la linea
    borderWidth: 3, //Borde de la linea
    fill: Direccion ? "start" : "end", // Activar el relleno del área debajo de la línea
    backgroundColor: color + "20", // Color del área sombreada
  };
}

// Funcion que retorna los puntos basicos de Interseccion
function Intersecciones_Basicas(coordenadasRectas) {
  // variables inicializada para la obtencion de las intersecciones
  let puntos_interccion = [];
  // bucle para pasar por todas las posiciones del arreglo
  for (let i = 0; i < coordenadasRectas.length; i++) {
    for (let j = 0; j < coordenadasRectas[i].data.length; j++) {
      if (
        coordenadasRectas[i].data[j].x == 0 ||
        coordenadasRectas[i].data[j].y == 0
      ) {
        puntos_interccion.push(coordenadasRectas[i].data[j]);
        // console.log("Primer If Interseccion :  x: ",coordenadasRectas[i].data[j].x, " y: ",coordenadasRectas[i].data[j].y);
      }
      // En alguno de los casos se puede dar un error y los valores de las coordenadas X Y pueden quedar como valores Infinitos o un valor mayor al eje Perteneciente por lo cual en este caso se modifica de manera que tenga los valores de las coordenadas del siguiente elemento y el maximoGlobal sumandole 10.
      if (coordenadasRectas[i].data[j].x == Infinity) {
        // El valor X afecta la grafica por lo cual se necesita una grafica Enfocada en las lineas sin malgastar espacio.
        coordenadasRectas[i].data[j].x = MaxEjeX;
        // Operador ternario para obtener la posicion de los datos.
        coordenadasRectas[i].data[j].y =
          coordenadasRectas[i].data[
            j == coordenadasRectas[i].data.length - 1 ? j - 1 : j + 1
          ].y;
      }

      if (coordenadasRectas[i].data[j].y == Infinity) {
        // como el eje Y es el eje dependiente del X entonces se le puede sumar 10 puntos a la coordenada maxima.
        coordenadasRectas[i].data[j].y = MaxEjeY + 10;
        // Operador ternario para obtener la posicion de los datos.
        coordenadasRectas[i].data[j].x =
          coordenadasRectas[i].data[
            j == coordenadasRectas[i].data.length - 1 ? j - 1 : j + 1
          ].x;
      }
    }
  }
  return puntos_interccion;
}

// funcion para validar las intersecciones por medio del metodo filtro que realizamos
function Validar_Intersecciones_Validas(valuesInter, cantCoordenadas) {
  for (let i = 0; i < cantCoordenadas.Length; i++) {
    valuesInter = valuesInter.filter((_, index) =>
      validarPunto(
        DatosCoordenadas[i].data,
        valuesInter[index],
        Reestricciones[i][2]
      )
    );
  }
  return valuesInter;
}

// Funcion para obtener posibles valores solucion
function Determinar_Posibles_Soluciones(
  array_Intersecciones,
  valuesObj,
  objetivo
) {
  let values = [];
  // Determinar las posibles soluciones con la ecuacion objetivo.
  for (let i = 0; i < array_Intersecciones.length; i++) {
    // Segun la Funcion objetivo me va guardar los valores obtenidos por cada interseccion ademas de las intersecciones para despues ser mostrados en una tabla.
    values.push({
      result:
        valuesObj[0] * array_Intersecciones[i].x +
        valuesObj[1] * array_Intersecciones[i].y,
      x: array_Intersecciones[i].x,
      y: array_Intersecciones[i].y,
    });
  }
  // Ordenar los valores totales para el objetivo del problema de programacion lineal
  values = values.sort((a, b) => {
    if (objetivo == 0) {
      return a.result - b.result; // Orden ascendente
    } else {
      return b.result - a.result; // Orden descendente
    }
  });
  if (values[0].x == 0 && values[0].y == 0) {
    values.shift();
  }
  return values;
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

//Funcion para eliminar Problemas de numeros Decimales que varian muy poco 1.666666667 1.6666666665
function RedondearDecimal(number, decimalPlaces) {
  const factor = 10 ** decimalPlaces;
  return Math.round(number * factor) / factor;
}
// Funcion para cambiar de decimal a fraccion
function decimalAFraccion(numero) {
  if (!isNaN(numero) && numero % 1 !== 0) {
    let fraccion = math.fraction(numero);
    let signo = fraccion.s == -1 ? "-" : "";
    return signo + fraccion.n + "/" + fraccion.d;
  }
  return numero;
}

function validarPunto(linea, puntoAdicional, sentido) {
  console.log(linea,puntoAdicional,sentido);
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

// funcion que me crea el json para la grafica de los puntos y las soluciones
function DatosIntersecciones(PuntoSolucion, PosibleSoluciones) {
  let puntos = [];
  if (PuntoSolucion) {
    puntos.push({
      data: [{ x: PuntoSolucion.x, y: PuntoSolucion.y }],
      label: "Solución",
      borderColor: "green",
      borderWidth: 4,
      pointBackgroundColor: "green",
      pointRadius: 8,
    });
  }
  puntos.push({
    data: PosibleSoluciones,
    label: "Intersecciones",
    borderColor: "red",
    borderWidth: 1,
    pointBackgroundColor: "red",
    pointRadius: 7,
  });
  return puntos;
}

function GraficarPPL() {


  // Canvas
  RemoverCanvas();
  InicializarCanvas();


  // obtener las coordenadas de las rectas de las intersecciones
  let DatosCoordenadas = ObtenerPuntosRectasGrafica(Reestricciones);

  console.log("Datos Coordenadas : ");
  DatosCoordenadas.forEach(obj=> console.log(obj));

  //Obtenemos los valores maximos para cada unos de los ejes para la generacion de la grafica correctamente.
  const { maxGlobalX: MaxEjeX, maxGlobalY: MaxEjeY } =ValoresMaximosGrafica(DatosCoordenadas);

  
  // Obtencion de intersecciones Basicas
  let intersecciones = Intersecciones_Basicas(DatosCoordenadas);

  // Obtener Intersecciones de las rectas
  intersecciones.push(
    ...InterseccionesMetodoCrammerDeterminante(Reestricciones)
  );
  console.log("Intersecciones Rectas  : "+ JSON.stringify(intersecciones));

  // Validar  las intersecciones validas para las reestricciones
  let interseccionesValidas = Validar_Intersecciones_Validas(intersecciones,DatosCoordenadas);
  console.log("Intersecciones Validas : "+ JSON.stringify(interseccionesValidas));

  //Funcion para obtener los valores para la funcion objetivo * intersecciones validas
  let valoresFOTotales = Determinar_Posibles_Soluciones(
    interseccionesValidas,
    ValuesObjetivo,
    ObjetivoPPL
  );
  //console.log("Valores FOTotales : " + JSON.stringify(valoresFOTotales));

  //Grafica de la Funcion Objetivo :

  // const fila =[ValuesObjetivo[0],ValuesObjetivo[1],ObjetivoPPL,valoresFOTotales[0].result];
  // console.log("Esto es la fila : " +fila )
  // let dataFO=[];
  // dataFO.push(fila);
  // DatosCoordenadas.push(...ObtenerPuntosRectasGrafica(dataFO,"Funcion Objetivo"))

  DatosCoordenadas.push(
    ...DatosIntersecciones(valoresFOTotales[0], interseccionesValidas)
  );

  // Se vuelven decimales todos valores para una mejor comprension
  for (let valor of valoresFOTotales) {
    valor.x = decimalAFraccion(valor.x);
    valor.y = decimalAFraccion(valor.y);
    valor.result = decimalAFraccion(valor.result);
  }

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
