// hacer una funcion identifique cual es mayor


const suma = (a, b) => {
        return a + b;
};
const resta = (a, b) => {
        return a - b;
};

const elegirOperación = (a, b, elegir) => {
        const elegido = elegir(a, b)
        console.log(elegido);
};

elegirOperación(5, 2, resta);

const productos = [
    {nombre: "remera", color:"azul"},
    {nombre: "buzo", color:"rojo"}
];

const mostrarNombres = productos.map((element) => element.nombre);
console.log(mostrarNombres);



