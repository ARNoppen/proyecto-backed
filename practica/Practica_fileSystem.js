const fs = require("fs").promises// llamamos a FileSystem (fs)

async function operacionesAsincronas() {

    await fs.appendFile("./prueba.txt", "    probandooo bieeenn  🎉✨😁🥵✔  ");

    let mostrarTxt = await fs.readFile("./prueba.txt", "utf-8");
    console.log(mostrarTxt);

    await setTimeout(()=>{
        fs.unlink("./prueba.txt");
    },5000)
}

operacionesAsincronas();
