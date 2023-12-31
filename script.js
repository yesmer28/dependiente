var incrementoDeCuponNoEnc = 0
const main = document.querySelector("main");
const containerModalCanjes = document.querySelector("#main-container-modal-canjes-inactivo");

var cupones = [
    {
        id: 1,
        dui: "12345678-1", 
        categoria: "sin canjear"
    },
    {
        id: 2,
        dui: "12345678-2", 
        categoria: "sin canjear"
    },
    {
        id: 3,
        dui: "12345678-3", 
        categoria: "sin canjear"
    },
    {
        id: 4,
        dui: "12345678-4", 
        categoria: "sin categoria"
    },
    {
        id: 5,
        dui: "12345678-5", 
        categoria: "sin categoria"
    },
    {
        id: 6,
        dui: "12345678-6", 
        categoria: "sin categoria"
    }
]

//aca se inicia a implementar cada una de las funciones que controlaran la pagina, revise adentro de cada funcion para 
//que visualice cual es el rol de cada una de ellas
const gestionarEventoClick = () =>{
    /* esta funcion tiene como objetivo majear el evento click de todos los elementos hijos de main, aca se está evitando añadir
    un evento a cada elemento, en vez de eso, hay condicionales que validan la clase del elemento en el que se clickea, 
    para asi llamar a cada funcion que esta relacionada a cada uno de ellos*/
    main.addEventListener("click", (e)=>{
        var inputDUIValue = document.querySelector("#input-dui-usuario").value
        var inputIDValue = document.querySelector("#id-cupon").value
        const eTarget = e.target
        const eTargetClass = eTarget.className //aca se guarda el nombre de la clase del elemento que se clickea
        const eTargetId = eTarget.id //aca se guarda el nombre del id del elemento que se clickea
        if(eTargetClass.includes("abrir-modal-canje")) containerModalCanjes.id = "main-container-modal-canjes-activo"
        if(eTargetClass.includes("cerrar-modal-canjes")) containerModalCanjes.id = "main-container-modal-canjes-inactivo"
        if(eTargetClass.includes("btn-canjear")){
            validarForm(inputDUIValue, inputIDValue)
        } 
    })
}
//en esta funcion se validan los datos ingresados para darle el permiso de canjear un cupon o no
function validarForm(DUIDeUsuarioValue, cuponIDValue){
    const inputDUI = document.querySelector("#input-dui-usuario")
    const inputCuponID = document.querySelector("#id-cupon")
    let regex = /^\d{8}-\d$/
    let regexDUI = regex.test(DUIDeUsuarioValue)
    let mensajeID = document.querySelector("#alerta-id-cupon")
    let mensajeDUi = document.querySelector("#alerta-dui-usuario")
    //validamos si los dos campos cumple con los requiriemtos para un canje
    if(!regexDUI){
        mensajeDUi.innerText = "El DUI es invalido"
        inputDUI.style.border = "2.5px solid #da0909"
    } 
    if(cuponIDValue.length == 0){
        mensajeID.innerText = "La ID no puede estar vacia"
        inputCuponID.style.border = "2.5px solid #da0909"
    }
    if (cuponIDValue < 0){
        mensajeID.innerText = "La ID no puede contener valores negativos"
        inputCuponID.style.border = "2.5px solid #da0909"
    } 
    if (regexDUI == true &&  cuponIDValue >= 1 ){
        validarCanje( DUIDeUsuarioValue, cuponIDValue)
    } 

    //aca se cambian los estilos de los inputs y se quitan los mensajes cuando el usuario pierde el focus
    inputDUI.addEventListener("blur", ()=>{
        mensajeDUi.textContent = ""
        inputDUI.style = "border: 2.5px solid #d9d9d9;"
    })
    inputCuponID.addEventListener("blur", ()=>{
        mensajeID.textContent = ""
        inputCuponID.style = "border: 2.5px solid #d9d9d9;"
    })
        }
        
function validarCanje(DUIDeUsuario, cuponID){
    cupones.find(cupon =>{
       if (DUIDeUsuario == cupon.dui && cuponID == cupon.id){
        console.log(cupon.dui, cupon.id)
        validarCuponCanjeado(cupon)
       } else {
        incrementoDeCuponNoEnc+=1
       }
       if (incrementoDeCuponNoEnc == cupones.length){
           console.log(incrementoDeCuponNoEnc, cupones.length)
           incrementoDeCuponNoEnc = 0
           alertarCuponCanjeado("bi-exclamation-triangle-fill", "Cupón no registrado", "#cc2b0f")
       }
    })
}
/* para saber si un cupon no esta registrado se compara si la longiud del array de cupones 
es igual al numero de veces que no se encuentra el cupon 
*/
    
function validarCuponCanjeado(cupon){
    if(cupon.categoria == "sin canjear"){
        registrarCuponCanjeado(cupon)
        alertarCuponCanjeado("bi-check-circle-fill", "Canje Exitoso", "#0ad346")
        listaCanjeVacio(document.querySelectorAll(".canje"))
    }
    else{
        alertarCuponCanjeado("bi-exclamation-triangle", "El cupón ya ha sido canjeado", "#b17900")
    } 
}
//    <i class="icon-cupon fa-solid fa-ticket"></i>
let nuevoContendorCanje = ""
const registrarCuponCanjeado = (cupon) =>{
        cupon.categoria = "canjeado"
        containerListaDeCanje = document.querySelector("#lista-canjes")
        nuevoContendorCanje +=  `<span class="canje">
        <b>DUI:</b>
        <p class="dui-usuario">${cupon.dui}</p>
        <b class="b-id-cupon">ID del cupón</b>
        <p class="id-cupón">${cupon.id}</p>
        <b>Cod Empresa</b>
        <b>Cod Compra:</b>
    </span>`
    document.querySelector("#lista-canjes").innerHTML = nuevoContendorCanje
}

function alertarCuponCanjeado(icon, msg, bgContainer){ 
    const containerAlertaCanje = document.querySelector("#container-alert");
    const iconCanje = document.querySelector(".icon-alert")
    const msgCanje = document.querySelector(".msg-alert")
    containerAlertaCanje.style.display = "flex"
    containerAlertaCanje.style.backgroundColor = bgContainer
    iconCanje.classList.replace("bi-alert", icon)
    msgCanje.innerText = msg
    let n = 0
    let intrv = setInterval(() => {
        n++
        containerAlertaCanje.style.right = `${n}%`
        if(n == 10) clearInterval(intrv)
    }, 15);
ocultarAlertaCanje(iconCanje, icon)
}

function ocultarAlertaCanje(iconCanje, newIcon){
    const alertaCanje = document.querySelector("#container-alert");
    let n = 0
    setTimeout(() => {
        let intrv = setInterval(() => {
            n++
            alertaCanje.style.right = `-${n}%`
            if(n == 20){
                n = 0
                clearInterval(intrv)
                iconCanje.classList.replace(newIcon, "bi-alert");
                alertaCanje.style.display = "none"
            } 
        }, 15);
    }, 2600);
}
function listaCanjeVacio(cupon){
    let avisoVacio = document.querySelector("#aviso-registro-canje-vacio")
    if (cupon.length > 0){
        avisoVacio.style = "visibility: 0;"
    }
    else {
        avisoVacio.style = "visibility: 1;"
    }
}
//esta funcion crea un array con los cupones que se canjearon
function obtenerCanjes(cupon){
    for(let i = 0; i < cupon.length; i++){
        if (cupon.categoria == "canjeado"){
            cuponesCanjeados[i] = cupon
        }
    }
    console.log(cuponesCanjeados)
}
function alertarError(){
    try {
        gestionarEventoClick()
    } catch (error) {
        alertarCuponCanjeado("bi-exclamation-triangle-fill", "Error inesperado")
    }
}
alertarError()