
class Persona {
    name;
    apellido;
    edad;
    #esMayorDeEdad;

    getEsMayorDeEdad = () => {
        return this.#esMayorDeEdad
    };

    esAdulto = () => {
        return this.edad >= 18;
    }


    constructor(name, apellido, edad){
        this.name = name;
        this.apellido = apellido;
        this.edad = edad;
        this.#esMayorDeEdad = this.esAdulto();
    }



}

const persona1 = new Persona("Axel","Nuñez",17);
const persona2 = new Persona("Flor", "Malano", 21);


console.log(persona1, persona2);
console.log(persona1.name, " es mayor de edad? ", persona1.getEsMayorDeEdad(), "//",persona2.name," es mayor de edad ?",persona2.getEsMayorDeEdad());


const perro = {
    raza: "pitbull",
    color: "negro",
    orejas: "cortas"
}

const collar = {
    material: "oro",
    precio: 100
}

const perroDatos = {...perro, ...collar, esCaro: collar.precio >=50 }

console.log(perroDatos)