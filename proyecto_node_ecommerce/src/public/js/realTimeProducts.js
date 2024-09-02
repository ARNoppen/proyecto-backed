const socket = io();

let user;
const productBox = document.getElementById("productBox");

//-------------sweet alert---------- 
Swal.fire({
    icon: "info",
    title: "Debemos indentificarte",
    input: "text",
    text:"Ingrese un nombre para poder identificar quien ingresó productos",
    color: "blue",
    inputValidator: (value) =>{
        if (!value) {
            return "Necesitas ingresar tu nombre para seguir"
        }else{
            //capturamos el user para hacer un broadcast del nuevo usuario que se conecto
            socket.emit("userConnect", {user: value})
        }
    },
    allowOutsideClick: false
  //lo que se resuelve arriba lo capturamos con el then (manejar promesas)
}).then( result =>{
    user = result.value;

    //cargamos nombre en la plantilla hbs
    const myName = document.getElementById("myName")
    myName.innerHTML = user; 
})


// guardamos mensajes de los usuarios
productBox.addEventListener("keyup", event => {
    if(event.key === "Enter"){
            if(productBox.value.trim().length > 0){
                socket.emit("message", {user: user, message: productBox.value})
                productBox.value = "";   
            
        }else{
            Swal.fire({
                icon:"warning",
                title:"Alerta",
                text:"Favor ingresar un mensaje"
            })
        }
    }
})


//escuchamos a todos los usuarios que estan conectados
socket.on("messageLogs", data => {
    const productsLog = document.getElementById("productsLog")
    let logs = ""

    //iteración de data
    data.forEach(log => {
        logs += `<b>${log.user}</b> dice: ${log.message} <br>`
        productsLog.innerHTML = logs;
    });
})



// aca escuchamos a los usuarios que se unen al chat 
socket.on("userConnect", data =>{
    let message = `Nuevo usuario conectado ${data}`;
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Nuevo usuario en el chat!!!",
        text: message,
        toast: true,
        color: "blue",
        showConfirmButton: false,
        timer: 8000
      });
})




// cerrar chat

const closeProductBox = document.getElementById("closeProductBox")
closeProductBox.addEventListener("click", event => {
    Swal.fire({
        icon: "succes",
        title: "Gracias por usar este chat!! chau.",
        color: "blue",
    })

    socket.emit("closeProduct", {close: "closed"})

    productsLog.innerHTML = "";


    
})