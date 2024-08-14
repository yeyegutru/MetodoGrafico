// Variables Canvas
const contenedor_modelo = document.getElementById("modelo-container");
let VarCanvas;
const ContenedorCanvas = document.getElementById("canvas-row-container");
let NuevoCanvas;
// let MaxEjeX = 0;
// let MaxEjeY = 0;
let maxVarX = -Infinity;
let maxVarY = -Infinity;

//funcion para las tratar el problema del denominador en 0
function Divide_CasoCero(numerator, denominator) {
  if (denominator === 0) {
    return 0; // o cualquier otro valor o comportamiento deseado
  } else {
    return numerator / denominator;
  }
}
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
  NuevoCanvas = document.createElement("canvas");
  NuevoCanvas.id = "graphCanvas";
  NuevoCanvas.width = 800;
  NuevoCanvas.height = 500;
  ContenedorCanvas.appendChild(NuevoCanvas);
  const CanvasCreation = NuevoCanvas.getContext("2d");
}

// Metodo para obtener los puntos de las rectas  de la grafica
function ObtenerPuntosRectasGrafica(restriccion, nombre_recta = null) {
  // Variable para Info Rectas
  let contSecundario = "";
  let R = [];
  // puntos de las rectas
  contSecundario += `
  <ul>
  <li><h3 class="text-start">Obtencion de la recta${
    nombre_recta != null ? ` ` + nombre_recta : "s"
  } : </h3>
  <ol>`;
  for (let i = 0; i < restriccion.length; i++) {
    let contx = 0;
    let conty = 0;
    let pointX = Divide_CasoCero(restriccion[i][3], restriccion[i][0]);
    let pointY = Divide_CasoCero(restriccion[i][3], restriccion[i][1]);

    console.log(" point x : ", pointX, " point y : ", pointY);

    // caso especial donde la recta queda en el origen lo que hace que no se genere una recta.
    if (pointX == 0) {
      pointX = maxVarX;
      conty = Divide_CasoCero(
        restriccion[i][3] - restriccion[i][0] * maxVarX,
        restriccion[i][1]
      );
      contSecundario += `
      <h4>Recta ${
        nombre_recta != null ? nombre_recta : i + 1
      } Caso Especial X1:</h4>
      <li><strong>x1</strong>=${pointX} <strong>x2</strong>= ${
        restriccion[i][3]
      } - (${restriccion[i][0]}(${maxVarX}))/ ${
        restriccion[i][1]
      } = ${conty}    <strong>(${pointX},${conty})</strong></li>
      <li><strong>x1</strong>=0 <strong>x2</strong>= ${
        restriccion[i][3]
      } - (0)/ ${
        restriccion[i][1]
      } = ${pointY}    <strong>(0,${pointY})</strong></li>`;

      // pointY= Divide_CasoCero(restriccion[i,3]-((restriccion[i,0])*maxVarX)==Infinity?0:(restriccion[i,0])*maxVarX,restriccion[i,1]);
      // console.log("caso especial x :  ",contx, " y: ",pointY);
      // pointY = TraerCasoEspecialValorY(
      //   restriccion[i][0],
      //   maxVarX,
      //   restriccion[i][1],
      //   restriccion[i][3]
      // );
    } else if (pointY == 0) {
      pointY = maxVarY;
      contx = Divide_CasoCero(
        restriccion[i][3] - restriccion[i][1] * maxVarY,
        restriccion[i][0]
      );
      contSecundario += `
      <h4>Recta ${
        nombre_recta != null ? nombre_recta : i + 1
      } Caso Especial X2:</h4>
      <li><strong>x2</strong>=${pointY} <strong>x1</strong>= ${
        restriccion[i][3]
      } - (${restriccion[i][1]}(${maxVarY}))/ ${
        restriccion[i][0]
      } = ${contx}    <strong>(${contx},${pointY})</strong></li>
      <li><strong>x2</strong>=0 <strong>x1</strong>= ${restriccion[i][3]} - (${
        restriccion[i][1]
      })/ ${
        restriccion[i][0]
      } = ${pointX}    <strong>(${pointX},0)</strong></li>`;
    } else {
      contSecundario += `
      <h4>Recta ${nombre_recta != null ? nombre_recta : i + 1} :</h4>
      <li><strong>x2</strong>=0 <strong>x1</strong>= ${
        restriccion[i][3]
      } - (0)/ ${
        restriccion[i][0]
      } = ${pointX}    <strong>(${pointX},0)</strong></li>
      <li><strong>x1</strong>=0 <strong>x2</strong>= ${
        restriccion[i][3]
      } - (0)/ ${
        restriccion[i][1]
      } = ${pointY}    <strong>(0,${pointY})</strong></li>`;
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
  contSecundario += `</ol></li></ul>`;
  contenedor_modelo.innerHTML += contSecundario;
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
    label: nombre ? nombre : "Recta " + (NumeroRecta + 1),
    data, //datos de X,Y para la generacion de cada linea
    borderColor: color, //color de la linea
    borderWidth: 2, //Borde de la linea
    fill: Direccion ? "start" : "end", // Activar el relleno del área debajo de la línea
    backgroundColor: color + "20", // Color del área sombreada
  };
}

// Funcion que retorna los puntos basicos de Interseccion
function Intersecciones_Basicas(coordenadasRectas) {
  //Obtenemos los valores maximos para cada unos de los ejes para la generacion de la grafica correctamente.
  const { maxGlobalX: MaxEjeX, maxGlobalY: MaxEjeY } =
    ValoresMaximosGrafica(coordenadasRectas);
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
function Validar_Intersecciones_Validas(valuesInter, cantCoordenadas, res) {
  let ValuesIntersecciones = valuesInter;
  for (let i = 0; i < cantCoordenadas.length; i++) {
    ValuesIntersecciones = ValuesIntersecciones.filter((_, index) =>
      validarPunto(
        cantCoordenadas[i].data,
        ValuesIntersecciones[index],
        res[i][2]
      )
    );
  }
  return ValuesIntersecciones;
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
// funcion para validar los puntos
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
  contenedor.innerHTML += `<h3 class="text-center row-sm-auto text-soluciones">Posibles Soluciones</h3>`;
  contenedor.classList.add("display-flex");
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
      label: "Solución Optima",
      borderColor: "green",
      borderWidth: 2,
      pointBackgroundColor: "green",
      pointRadius: 8,
    });
  }
  puntos.push({
    data: PosibleSoluciones,
    label: "Intersecciones",
    borderColor: "red",
    borderWidth: 2,
    pointRadius: 8,
    pointBackgroundColor: "red",
    backgroundColor: "red",
  });
  return puntos;
}
//funcion que recorre rapidamente las reestricciones y saca los puntos maximos para X y Y
function ObtenerPuntosMaximos(Reestricciones) {
  let value_x,
    value_y = 0;
  Reestricciones.forEach((res) => {
    value_x = Divide_CasoCero(res[3], res[0]);
    value_y = Divide_CasoCero(res[3], res[1]);
    maxVarX <= value_x ? (maxVarX = value_x) : "";
    maxVarY <= value_y ? (maxVarY = value_y) : "";
  });
}

//Funcion que nos permite ver si hay multiples soluciones para el problema o es de unica solucion
function hayMultiplesSoluciones(puntos) {
  if (puntos.length === 0) return false;

  // Obtener el valor result del primer objeto
  const valorResult = puntos[0].result;

  // Contar cuántas veces aparece este valor en el arreglo
  const count = puntos.reduce((acc, punto) => {
    if (punto.result === valorResult) {
      return acc + 1;
    }
    return acc;
  }, 0);

  // Si aparece más de una vez, hay múltiples soluciones
  return count > 1;
}
// funcion que trae respuesta al tipo de problema
function esPuntoFactible(punto, restricciones) {
  return restricciones.every(([a, b, c, d]) => {
    if (c == 0) {
      return a * punto.x + b * punto.y >= d;
    } else if (c == 1) {
      return a * punto.x + b * punto.y <= d;
    } else {
      return a * punto.x + b * punto.y == d;
    }
  });
}
function esNoAcotado(intersecciones, restricciones) {
  for (let i = 0; i < intersecciones.length; i++) {
    const punto = intersecciones[i];
    console.log("Linea 396 : ", esPuntoFactible(punto, restricciones));
    if (esPuntoFactible(punto, restricciones)) continue;
    const direccion = { x: punto.x + 100, y: punto.y }; // Mover en la dirección positiva de x
    console.log("linea 408 : ", esPuntoFactible(direccion, restricciones));
    if (esPuntoFactible(direccion, restricciones)) return true;
  }
  return false;
}

function TipoProblema(interseccionesValidas, Reestricciones) {
  let c = "";
  esNoAcotado(interseccionesValidas, Reestricciones)
    ? (c = "EL PROBLEMA NO TIENE SOLUCION PORQUE NO ES ACOTADO")
    : (c = "");
  return c;
}
//Generacion del html para mostrar el modelo
function formulacion_modelo(funcion_obj, restricciones) {
  let ve = ["A", "B"];
  let vars = "";
  for (var i = 0; i < funcion_obj.length; i++) {
    vars += `<li> X${i + 1} : Unidades del Elemento ${ve[i]}</li>`;
  }

  let vares = "";
  for (var i = 0; i < funcion_obj.length; i++) {
    vares += `<li> ${restricciones[i][0]}<strong>x1</strong> ${
      restricciones[i][1] > 0 ? `+` : `-`
    } ${restricciones[i][1]}<strong>x2</strong> ${
      restricciones[i][2] == 0 ? `>=` : restricciones[i][2] == 1 ? `<=` : `=`
    } ${restricciones[i][3]}</li>`;
  }
  console.log(vares);

  contenedor_modelo.innerHTML += `
  <h2 class="text-center fw-bold">Formulación del Modelo:</h2>
  <ul>
  <li>
  <h3 class="text-start">Variables de decisión:</h3>
  <ol>${vars}</ol>
  </li>
  <li>
  <h3 class="text-start">Función objetivo:</h3>
  <p><strong>${(ObjetivoPPL = 0 ? "Minimizar " : "Maximizar ")}Z:</strong>  ${
    funcion_obj[0]
  }<strong>x1</strong> + ${funcion_obj[1]}<strong>x2</strong></p>
  </li>
  <li>
  <h3 class="text-start">Reestricciones del problema:</h3>
  <ol>${vares}</ol>
  </li>
  </ul>
  `;
}
// funcion para mostrar los vertices
function imprimirVertices(intersecciones, nom) {
  // Crear la variable para la lista
  let listaHTML = `<ul> <li><h3 class="text-start"> ${nom}: </h3><ol>`;

  // Recorrer el array de intersecciones y agregar cada punto como un elemento de lista
  intersecciones.forEach((punto, index) => {
    listaHTML += `<li><strong>Vértice ${index + 1}: </strong>(x: ${
      punto.x
    }, y: ${punto.y})</li>`;
  });

  // Cerrar la lista
  listaHTML += "</ol></li></ul>";

  // Retornar la estructura HTML
  return listaHTML;
}

function sortByY(arr) {
  return arr.sort((a, b) => b.y - a.y);
}

function obtenerInformacionZonaFactible(data) {
  return {
    type: "line",
    label: "Zona Factible",
    data: sortByY(data),
    borderColor: "green",
    borderWidth: 3,
    fill: 2, // Rellenar el área de intersección
    showLine: true,
    backgroundColor: "rgba(0, 128, 0, 0.8)",
  };
}

function InformacionGrafica(data) {
  return {
    type: "scatter",
    data: {
      datasets: data,
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
      // maintainAspectRatio: false,
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
}


function imprimirRespuestaProblema(var_acotado,valoresFOTotales,solution){
  $("#graph-label").append(`
    <div class="col-auto py-0 px-2">

      ${
        var_acotado != ""
          ? `<h2 class="col-sm-auto text-center">
        ${var_acotado}
    </h2>`
          :
          `<h2 class="col-sm-auto text-center fw-bolder">
        ${solution}
    </h2>
           <label for="funcion" class="col-sm-auto col-form-label text-center fw-bold variables-label"
        style="font-size: 16px">
        ${
          valoresFOTotales[0]
            ? `SOLUCION OPTIMA : X1 = ${valoresFOTotales[0].x}, X2 = ${valoresFOTotales[0].y}, Z = ${valoresFOTotales[0].result}`
            : "NO SE ENCUENTRA SOLUCIÓN"
        }</label>`
      }
      
    </div>
  </div>
  `);
}

function GraficarPPL() {
  maxVarX = -Infinity;
  maxVarY = -Infinity;
  let var_acotado = "";

  // Remover E Inicializar Canvas
  RemoverCanvas();
  InicializarCanvas();

  //Formulacion del modelo es para colocar en el html el modelo del PPL HTML
  formulacion_modelo(ValuesObjetivo, Reestricciones, ObjetivoPPL);

  // obtener puntos maximos para el plano cartesiano  X y Y, para las rectas con condiciones especiales.
  ObtenerPuntosMaximos(Reestricciones);

  // obtener las coordenadas de las rectas de las intersecciones
  let rectas_problema = ObtenerPuntosRectasGrafica(Reestricciones);

  // Obtencion de intersecciones Basicas
  let intersecciones = Intersecciones_Basicas(rectas_problema);

  // Obtener Intersecciones de las rectas
  intersecciones.push(
    ...InterseccionesMetodoCrammerDeterminante(Reestricciones)
  );


  // Imprimir los vertices basicos del problema HTML
  contenedor_modelo.innerHTML += imprimirVertices(
    intersecciones,
    "Vertices Basicos"
  );

  // Validar  las intersecciones validas para las reestricciones
  let interseccionesValidas = Validar_Intersecciones_Validas(
    [...intersecciones],
    rectas_problema,
    Reestricciones
  );
  
  // imprimir los vertices validos del problema HTML
  contenedor_modelo.innerHTML += imprimirVertices(
    interseccionesValidas,
    "Vertices Validos"
  );
  // creacion de la zona factible
  const interseccionDataset = obtenerInformacionZonaFactible(
    interseccionesValidas
  );
  
  // cerrar la zona factible
  interseccionDataset.data.push(interseccionesValidas[0]);
  

  //Funcion para obtener los valores para la funcion objetivo * intersecciones validas
  let valoresFOTotales = Determinar_Posibles_Soluciones(
    interseccionesValidas,
    ValuesObjetivo,
    ObjetivoPPL
  );

  //Grafica de la Funcion Objetivo :
  const fila = [
    ValuesObjetivo[0],
    ValuesObjetivo[1],
    ObjetivoPPL,
    valoresFOTotales[0].result,
  ];
  // Graficar informacion de la funcion objetivo
  let dataFO = [];
  dataFO.push(fila);

  // // Se vuelven decimales todos valores para una mejor comprension
  for (let valor of valoresFOTotales) {
    valor.x = decimalAFraccion(valor.x);
    valor.y = decimalAFraccion(valor.y);
    valor.result = decimalAFraccion(valor.result);
  }


  // Arreglo que contiene la informacion a graficar
  const DatosCoordenadas = [];
  DatosCoordenadas.push(interseccionDataset);
  DatosCoordenadas.push(interseccionDataset);
  DatosCoordenadas.push(
    ...DatosIntersecciones(valoresFOTotales[0], interseccionesValidas)
  );
  DatosCoordenadas.push(
    ...ObtenerPuntosRectasGrafica(dataFO, "Funcion Objetivo")
  );
  rectas_problema.forEach((item) => DatosCoordenadas.push(item));

  // grafica
  const chartData = InformacionGrafica(DatosCoordenadas);
  let myChart = new Chart(NuevoCanvas, chartData);

  // DETERMINAR SI ES UN PROBLEMA ACOTADO
  var_acotado = TipoProblema(interseccionesValidas, Reestricciones);
  const valueSolutions = !hayMultiplesSoluciones(valoresFOTotales)
    ? "Unica Solucion"
    : "Multiple solucion";

  imprimirRespuestaProblema(var_acotado,valoresFOTotales,valueSolutions);
  

  crearTablaResultados(valoresFOTotales);
}
