const FormularioGeneracionVariables = () => {
  // Verificar si todos los campos del primer formulario están diligenciados
  if ($("#FormularioEntrada")[0].checkValidity()) {
    // Mostrar el segundo formulario
    CrearTarjetaDePPL();
  }
};

const GeneradorReestricciones = (row, column, end, method) => {
  let content = `
    <div class="col-auto ">
      <input
        type="number"
        class="form-control ancho"
        id="restriction_${row}_${column}"
        placeholder="0"
      />
    </div>
    <div class="col-auto px-0">
          <label for="x1" class="col-sm-auto col-form-label text-end"
            >X${column} ${end ? "" : "+"}</label
          >
    </div>
    `;

  if (end) {
    content += `
      <div class="col-auto">
        <select class="form-select" id="nature_${row}">
          <option value="0">≥</option>
          <option value="1">≤</option>
          <option value="2">=</option>
        </select>
      </div>
      <div class="col-auto p-0">
        <input type="number" class="form-control ancho" id="restriction_${row}_${
      column + 1
    }" placeholder="0"/>
      </div>
      `;
  }

  return content;
};

const CrearTarjetaDePPL = () => {
  // Mostrar Contenedor y listar variables por JQuery
  let contenedor = document.getElementById("parameters-container").classList.remove("ocultar");
  let Numero_Variables = $("#variables").val();
  let Tarjeta_Restricciones = $("#Contenedor_Reestricciones"); 
  let Numero_Restricciones = $("#restrictions").val();
  let Formulario_Plantilla = $("#FormularioEntrada").val();
  let ContHtmlDiv = `<div class="mb-1 row elastic-row flex-nowrap justify-content-center"></div>`
  // Variables que se Van a tener
  let VariablesBasicas = ["X1", "X2"];
  //vaciar Tarjeta de Restricciones
  Tarjeta_Restricciones.empty();
  
  //Bucle de Generacio de las Restricciones 1 no de 0 para poder generar el final
  for (let i = 1; i <= Numero_Restricciones; i++) {
    // generacion del Contedor de cada reestriccion 
    Tarjeta_Restricciones.append(ContHtmlDiv);
    // Generacion de Elementos Dinamicos para la Restriccion
    let row = $("#Contenedor_Reestricciones div");
    for (let j = 1; j <= Numero_Variables; j++) {
      row.last().append(GeneradorReestricciones(i, j, j == Numero_Variables, Formulario_Plantilla));
    }
  }
  // Generacion de las reestricciones Basicas
  $("#variable-label").html(`${VariablesBasicas.join(", ")} ≥ 0`);
};


let Reestricciones = []; 
let ObjetivoPPL=0;
let ValuesObjetivo=[];
// funcion para calcular y graficar
const Calcular_Graficar = async () => {
  //   valores la zona >= <= =  0 1 2
  ValoresSignos = []; // > 0 | < 1 | = 2
  // valores de variables y las reestricciones 
  let ValoresVariables = $("#variables").val();
  let ValoresReestricciones = $("#restrictions").val();

  // Objetivo del PPL Minimización 0 | Maximización 1
  ObjetivoPPL = Number($("#ObjetivoPPL").val()); // 

  //   valores de funcion objetivo
  ValuesObjetivo = [];
  //   traer los valores de la funcion objetivo
   ValuesObjetivo.push(Number($("#target_1").val()) || 0);
   ValuesObjetivo.push(Number($("#target_2").val()) || 0);

  // llenar los nature <>= que hay en las restricciones

  for (let i = 1; i <= ValoresReestricciones; i++) {
    let Restric = "#nature_" + i;
    ValoresSignos.push(Number($(Restric).val()) || 0);
  }

  //console.log("Valores ValoresSignos : ",ValoresSignos)

  // Traer Valores de cada Reestriccion 
  let VariablesCol = Number(ValoresVariables) + 1;

  for (let i = 1; i <= ValoresReestricciones; i++) {
    let FilaCopia = [];
    for (let j = 1; j <= VariablesCol; j++) {
      let NombreFilaRestriccion = $("#restriction_" + i + "_" + j).val() || 0;
      if (j == 3) {
        let ValoresX3 = "#nature_" + i;
        FilaCopia.push(Number($(ValoresX3).val()) || 0);
      }
      FilaCopia.push(Number(NombreFilaRestriccion));
    }
    Reestricciones.push(FilaCopia);
  }
  
  console.log("restricciones value: ", Reestricciones,
"Objetivo PPL", ObjetivoPPL,
"ValuesObjetivo",ValuesObjetivo);
 GraficarPPL();
 // graphCanvas();
  console.log("canvas");
  $("#canvas-container").show();
};

Reestricciones=[[8, 4, 0, 16],[1, 1, 1, 5],[2, 2, 1, 20],[1, -2, 0, 0]]
ObjetivoPPL=0;
ValuesObjetivo=[2000,10000];
GraficarPPL();
$("#canvas-container").show();