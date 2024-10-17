const socket = io();

const productBox = document.getElementById("productBox");


    //escuchamos evento y cargamos nombre en la plantilla hbs
    socket.on("userData", data => {
        user = data;
        const myName = document.getElementById("myName");
        myName.innerHTML = `${user.first_name} ${user.last_name}`;
    });

// guardamos productos que ingresen los usuarios
productBox.addEventListener("submit", event => {
    event.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const code = document.getElementById('code').value.trim();
    const price = document.getElementById('price').value.trim();
    const stock = document.getElementById('stock').value.trim();
    const category = document.getElementById('category').value.trim();

            if(title.length > 0 && description.length > 0 && code.length > 0 && price.length > 0 && stock.length > 0 && category.length > 0){
                const productData = {
                    user: user,
                    title: title,
                    description: description,
                    code: code,
                    price: parseFloat(price),
                    stock: parseInt(stock),
                    category: category
                }

                socket.emit("products", productData);

                productBox.reset(); 
        }else{
            Swal.fire({
                icon:"warning",
                title:"Alerta",
                text:"Debes completar todos los campos"
            })
        }
})


//escuchamos a todos los usuarios que estan conectados
socket.on("productLogs", data => {
    const productsLog = document.getElementById("productsLog")
    let logs = "";
    //iteración de data
    data.forEach(log => {
        // verifica si log.user está definido antes de intentar acceder a sus propiedades
            logs += `<b>${log.user.first_name} ${log.user.last_name}</b> creó el siguiente producto: <br>
                Titulo: ${log.title}
                Descripción: ${log.description}  
                Código: ${log.code} 
                Precio: ${log.price} 
                Stock: ${log.stock} 
                Categoría: ${log.category}
                <br><button onclick="deleteProduct('${log._id}')">Eliminar</button><br>`;
                
    });
    productsLog.innerHTML = logs;
})

deleteProduct = (id) => {
    socket.emit("deleteProduct", id);
}


// aca escuchamos a los usuarios que se unen al chat 
socket.on("userConnect", data => {
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
        title: "Gracias ingresar a la página!! chau.",
        color: "blue",
    })
    socket.emit("closeProduct", {close: "closed"})
    productsLog.innerHTML = "";
})