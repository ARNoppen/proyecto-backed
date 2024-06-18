
class TicketManager {

    // Propiedades privadas
    #precioBaseDeGanancia;
    #eventos;

    // Constructor de instancia
    constructor() {
        this.#precioBaseDeGanancia = 0.15;
        this.#eventos = [];
    }

    // Método privado: Genera univocamente y de forma segura un nuevo ID.
    #generarId = () => {
        let idMayor = 0;

        this.#eventos.forEach((evento) => {
            if (evento.id > idMayor) {
                idMayor = evento.id;
            }
        });

        return idMayor + 1;
    };

    // Método público que crea un "evento" y lo agrega al array de "eventos"
    agregarEvento = (nombre, lugar, precio, capacidad = 50, fecha = new Date().toLocaleDateString()) => {
        // Define la estructura del "evento"
        const evento = {
            id: this.#generarId(),
            nombre,
            lugar,
            precio: precio + (precio * this.#precioBaseDeGanancia),
            capacidad,
            fecha,
            participantes: []
        };

        // Agrega el "evento" creado al array de "eventos"
        this.#eventos.push(evento);
    };

    // Método público que agrega un "usuario" al array de "participantes"
    agregarUsuario = (idEvento, idUsuario) => {
        const indiceDelEvento = this.#eventos.findIndex((e) => e.id === idEvento);

        // Verifica que exista el "evento", caso contrario, termina la ejecución del método.
        if (indiceDelEvento < 0) {
            console.log("Evento no encontrado");
            return;
        }

        const usuarioRegistrado = this.#eventos[indiceDelEvento].participantes.includes(idUsuario);

        // Verifica que el "usuario" no esté registrado, caso contrario, termina la ejecución del método.
        if (usuarioRegistrado) {
            console.log("Usuario ya registrado");
            return;
        }

        // Agrega el "usuario" creado al array de "participantes"
        this.#eventos[indiceDelEvento].participantes.push(idUsuario);
    };

    // Método público que clona un "evento" y lo agrega al array de "eventos"
    ponerEventoEnGira = (idEvento, nuevaLocalidad, nuevaFecha) => {
        const indiceDelEvento = this.#eventos.findIndex((e) => e.id === idEvento);

        // Verifica que exista el "evento", caso contrario, termina la ejecución del método.
        if (indiceDelEvento < 0) {
            console.log("Evento no encontrado");
            return;
        }

        const evento = this.#eventos[indiceDelEvento];

        // Define la estructura del nuevo "evento" a partir de un "evento" ya creado.
        const nuevoEvento = {
            ...evento,
            id: this.#generarId(),
            lugar: nuevaLocalidad,
            fecha: nuevaFecha,
            participantes: []
        };

        // Agrega el "evento" creado al array de "eventos"
        this.#eventos.push(nuevoEvento);
    };

    // Método público (getter) retorna los "eventos"
    getEventos = () => {
        return this.#eventos;
    };
}

const manejadorEventos = new TicketManager();

manejadorEventos.agregarEvento('Evento Coder A', 'Buenos Aires', 1500.0);
manejadorEventos.agregarUsuario(1, 10);
manejadorEventos.agregarUsuario(1, 12);

manejadorEventos.agregarEvento('Mega Evento Coder B', 'Santa Fe', 1800.0, 100);
manejadorEventos.agregarUsuario(2, 10);
manejadorEventos.agregarUsuario(2, 15);

manejadorEventos.ponerEventoEnGira(1, 'Córdoba', '30/11/2024');

console.log(manejadorEventos.getEventos());