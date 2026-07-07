import Cliente from "../models/Cliente.js";

class ClienteRepository {

    async obtenerTodos() {

        return await Cliente.find();

    }

    async obtenerPorId(id) {

        return await Cliente.findById(id);

    }

    async crear(cliente) {

        return await Cliente.create(cliente);

    }

    async actualizar(id, datos) {

        return await Cliente.findByIdAndUpdate(id, datos, {
            new: true
        });

    }

    async eliminar(id) {

        return await Cliente.findByIdAndDelete(id);

    }

}

export default new ClienteRepository();