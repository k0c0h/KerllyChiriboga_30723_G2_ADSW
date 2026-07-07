class PrototypeRegistry {

    constructor() {

        this.prototypes = new Map();

    }

    registrar(nombre, objeto) {

        this.prototypes.set(nombre, objeto);

    }

    obtener(nombre) {

        const prototype = this.prototypes.get(nombre);

        if (!prototype) {

            throw new Error("Prototype no encontrado.");

        }

        return prototype.clone();

    }

}

export default new PrototypeRegistry();