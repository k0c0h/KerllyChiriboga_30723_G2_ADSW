class Prototype {

    clone() {
        throw new Error("Debe implementar clone()");
    }

        prepararDatos(origen) {

        if (origen === null || origen === undefined) {
            throw new TypeError("No se puede clonar un objeto vacío.");
        }

        const datos = typeof origen.toObject === "function"
            ? origen.toObject()
            : origen;

        const copia = structuredClone(datos);

        delete copia._id;
        delete copia.id;
        delete copia.__v;
        delete copia.createdAt;
        delete copia.updatedAt;

        return copia;
    }

    aplicarCambios(datos, cambios = {}) {

        if (cambios === null || typeof cambios !== "object" || Array.isArray(cambios)) {
            throw new TypeError("Los cambios de la clonación deben ser un objeto.");
        }

        const copia = structuredClone(datos);
        const cambiosSeguros = structuredClone(cambios);

        delete cambiosSeguros._id;
        delete cambiosSeguros.id;
        delete cambiosSeguros.__v;
        delete cambiosSeguros.createdAt;
        delete cambiosSeguros.updatedAt;

        return { ...copia, ...cambiosSeguros };
    }
}

export default Prototype;