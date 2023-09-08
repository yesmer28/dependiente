indexed = indexedDB.open("Database de cupones", 2);

indexed.addEventListener('upgradeneeded', ()=>{
    db = indexed.result
    db.createObjectStore("Cupones", {
        autoIncrement: true
    })
});
indexed.addEventListener('success', ()=>{
    leerObjetos()
});

indexed.addEventListener('error', ()=>{
    console.log("Ha ocurrido un error")
});
//almacen de objetos
function agregarObjetos(objeto){
    IDBData = getIDBData("readwrite", "Objeto agregado a la database");
    IDBData.add(objeto)
}

function leerObjetos(){
    //document.querySelector("table").innerHTML = ""
    IDBData = getIDBData("readonly");
    const cursor = IDBData.openCursor();
    cursor.addEventListener('success', ()=>{
        if (cursor.result){
            elemento = crearElemento(cursor.result.key, cursor.result.value, cursor.result.value);
            cursor.result.continue();
        } 
    });
}

function modificarObjetos(key, objeto){
    IDBData = getIDBData("readwrite");
    IDBData.put(objeto, key)
}

function eliminarObjetos(key){
    IDBData = getIDBData("readwrite", "Objeto eliminado de la database");
    IDBData.delete(key)
}

function getIDBData(modo, msg){
    const db = indexed.result
    const IDBtransaction = db.transaction("cupones", modo)
    const objectStor = IDBtransaction.objectStore("cupones")
    console.log(msg)
    return objectStor
}
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
        //agregarCuponModal(nuevoContendorCanje)
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
    agregarObjetos(cupon)
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
    return cupon.id = incrementarID
}

window.addEventListener("load", ()=>{
    let nuevoContendorCanje = ""
    //agregarCuponModal(nuevoContendorCanje)
})
function agregarCuponModal(nuevoContendorCanje){
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