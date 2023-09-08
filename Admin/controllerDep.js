var listaDeCupones = []
var incrementarID = 0

verificarExistCupones(incrementarID)
//export {cupones}
//localStorage.setItem("cupones", "")
//localStorage.setItem("Id de cupones", incrementarID)
const gestionarEventoClick = () =>{
    /* esta funcion tiene como objetivo majear el evento click de todos los elementos hijos de main, aca se está evitando añadir
    un evento a cada elemento, en vez de eso, hay condicionales que validan la clase del elemento en el que se clickea, 
    para asi llamar a cada funcion que esta relacionada a cada uno de ellos*/
    const containerModalCanjes = document.querySelector("#main-container-modal-canjes-inactivo")
    main.addEventListener("click", (e)=>{
        var inputDUIValue = document.querySelector("#input-dui-usuario").value
        const eTarget = e.target
        const eTargetClass = eTarget.className //aca se guarda el nombre de la clase del elemento que se clickea
        const eTargetId = eTarget.id //aca se guarda el nombre del id del elemento que se clickea
        if(eTargetClass.includes("abrir-modal-canje")) containerModalCanjes.id = "main-container-modal-canjes-activo"
        if(eTargetClass.includes("cerrar-modal-canjes")) containerModalCanjes.id = "main-container-modal-canjes-inactivo"
        if(eTargetClass.includes("btn-canjear")){
            validarForm(inputDUIValue)
        } 
    })
}



function validarForm(DUIDeUsuarioValue){
    const inputDUI = document.querySelector("#input-dui-usuario")
    let regex = /^\d{8}-\d$/
    let regexDUI = regex.test(DUIDeUsuarioValue)
    let mensajeID = document.querySelector("#alerta-id-cupon")
    let mensajeDUi = document.querySelector("#alerta-dui-usuario")
    //validamos si los dos campos cumple con los requiriemtos para un canje
    if(!regexDUI){
        mensajeDUi.innerText = "El DUI es invalido"
        inputDUI.style.border = "2.5px solid #da0909"
    } else {
        crearCupon(DUIDeUsuarioValue)
        let nuevoContendorCanje = ""
        agregarCuponModal(nuevoContendorCanje)
    } 
    
    //aca se cambian los estilos de los inputs y se quitan los mensajes cuando el usuario pierde el focus
    inputDUI.addEventListener("blur", ()=>{
        mensajeDUi.textContent = ""
        inputDUI.style = "border: 2.5px solid #d9d9d9;"
    })
}
        
function crearCupon(DUI){
    let cupon = {
        id: 1,
        dui: `${DUI}`,
        categoria: "sin canjear",
        comision: (5*100)/10,
        codiEmpresa: "",
        codCompra: ""
    }
    generarCodigoDeCompra(cupon)
    generarCuponID(cupon)
    let storageCupones = localStorage.getItem("cupones")
    listaDeCupones.push(cupon)
    localStorage.setItem("cupones", JSON.stringify(listaDeCupones))
}
function generarCodigoDeCompra(cupon){
    const date = new Date();
    const dia = date.getUTCDate()
    const mes = date.getMonth()+1
    const año = date.getFullYear()
    const hora = date.getHours()
    const minuto = date.getMinutes()
    const segundo = date.getSeconds()
    return cupon.codCompra = `${dia}${mes}${año}${hora}${minuto}${segundo}`
}

function generarCuponID(cupon){
    incrementarID++
    localStorage.setItem("Id de cupon", incrementarID)
    return cupon.id = incrementarID
}
function verificarExistCupones( id){
    let cuponesStorage = localStorage.getItem("cupones")
    let idCupones = localStorage.getItem("Id de cupones")
    if (cuponesStorage === null || cuponesStorage === undefined && idCupones === null || idCupones === undefined){
        localStorage.setItem("cupones", "")
        localStorage.setItem("Id de cupon", id)
    }
}
window.addEventListener("load", ()=>{
    let nuevoContendorCanje = ""
    agregarCuponModal(nuevoContendorCanje)
})
function agregarCuponModal(nuevoContendorCanje){
    const cupones = localStorage.getItem("cupones");
    let cuponesDeserialisados = JSON.parse(cupones)
    cuponesDeserialisados.forEach(cupon => {
        containerListaDeCanje = document.querySelector("#lista-canjes")
        nuevoContendorCanje +=  `<span class="canje">
        <b>DUI:</b>
        <p class="dui-usuario">${cupon.dui}</p>
        <b class="b-id-cupon">ID del cupón</b>
        <p class="id-cupón">${cupon.id}</p>
        <b>Cod Empresa</b>
        <b>Cod Compra:</b>
        <p class="cupon-cod-compra">${cupon.codCompra}</p>
        <b>Categoria:</b>
        <p class="categoria-sin-canjear">${cupon.categoria}</p>
    </span>`
    document.querySelector("#lista-canjes").innerHTML = nuevoContendorCanje
    console.log(cuponesDeserialisados)
});
}
gestionarEventoClick()

import {mostrarCantidadTotalAGastar} from './mostrarGastoTotal'
import {crearProducto} from './crearRegistroEnUI'
import { searchRegister } from './search/searchRegister'
const indexeddb = indexedDB.open('lista de productos', 1)

indexeddb.addEventListener('error', ()=> console.log('Error al crear la base de datos'))
indexeddb.addEventListener('success', ()=>{
    leer()
})

indexeddb.addEventListener('upgradeneeded', ()=>{
    let db = indexeddb.result;
    db.createObjectStore("Producto", { //la tabla se llamará productos
        autoIncrement: true
    })
})

function agregar(objeto){
    let el = idbdata('readwrite', 'Objeto agregado')
    el.add(objeto)
}

function modificar(key, objeto){
    let el = idbdata('readwrite', `${objeto.nombre} modificado`);
    el.put(objeto, key)
}

function leer(){
    //document.querySelectorAll("span").innerHTML = ""
    let el = idbdata("readonly", "leyendo")
    const cursor = el.openCursor()
    cursor.addEventListener('success', ()=>{
        if(cursor.result){
            crearProducto(cursor.result.key, cursor.result.value, cursor.result.value, cursor.result.value)
            cursor.result.continue()
            mostrarCantidadTotalAGastar()
        }
    })
}

function eliminarRegistro(key){
    let el = idbdata('readwrite', 'eliminado')
    el.delete(key)
}

function idbdata(modo, msg){
    let db = indexeddb.result
    const idbTransaction = db.transaction("Producto", modo);
    const objectstore = idbTransaction.objectStore("Producto")
    console.log(msg)
    return objectstore
}