//Definir una funcion suma

const suma = (n1,n2) => {
    return new Promise ((resolve,reject) =>{
        if (n1 === 0 || n2 === 0) {
            reject ("Esta operación es inecesaria (SUMA)");
        }
        if(n1 < 0 || n2 < 0){
            reject("La calculadora solo debe devolver valores positivos (SUMA)");
        }
        else{
            resolve(n1+n2);
        }
    })
}

const resta = (n1,n2) => {
    return new Promise ((resolve,reject) => {
        if (n1 === 0 || n2 === 0) {
            reject ("Esta operación es inecesaria (RESTA)");
        }
        if(n1 < 0 || n2 < 0){
            reject("La calculadora solo debe devolver valores positivos (RESTA)");
        }
        else{
            resolve(n1+n2);
        }
    })
}

const multiplicacion = (n1,n2) => {
    return new Promise((resolve,reject) => {
        if(n1 < 0 || n2 < 0){
            reject("La carculadora solo puede devolver valores positivos (MULTIPLICACION)");
        }
        else{
            resolve(n1*n2);
        }
    })
}


const calculos = async(elegirOper) => {
    try{
        if (elegirOper == "suma"){
        let resultSuma = await suma(2,5);
        console.log(resultSuma);
        }
        if (elegirOper == "resta") {
            let resultResta = await resta(4,2);
            console.log(resultResta);
        }

        if (elegirOper == "multiplicacion") {
            let resultMultiplicacion = await multiplicacion(5,-5);
            console.log(resultMultiplicacion);
        }
        else{
            console.log("Solo podes elegir suma, resta o multiplicacion");
        }
    }
    catch(error){
        console.log(error);
    }
}

calculos("suma");