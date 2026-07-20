class PrototypeRegistry {

    constructor() {

        this.prototypes = new Map();

    }

    registrar(nombre, objeto) {

        if (!nombre?.trim()) {
            throw new TypeError("El nombre del prototype es obligatorio.");
        }

        if (!objeto || typeof objeto.clone !== "function") {
            throw new TypeError("El objeto registrado debe implementar clone().");
        }

        this.prototypes.set(nombre.trim(), objeto);

        return this;

    }

    obtener(nombre, cambios = {}) {

        const prototype = this.prototypes.get(nombre?.trim());

        if (!prototype) {

            throw new Error("Prototype no encontrado.");

        }

        return prototype.clone(cambios);

    }

    eliminar(nombre) {

        return this.prototypes.delete(nombre?.trim());

    }

}

export default new PrototypeRegistry();
