import Mesa from "../models/Mesa.js";

class MesaRepository {

    async obtenerTodas() {

        return await Mesa.find().sort({ numero: 1 });

    }

    async obtenerPorId(id) {

        return await Mesa.findById(id);

    }

    async obtenerPorNumero(numero) {

        return await Mesa.findOne({ numero });

    }

    async crear(mesa) {

        return await Mesa.create(mesa);

    }

    async actualizar(id, datos) {

        return await Mesa.findByIdAndUpdate(id, datos, {
            new: true
        });

    }

    async actualizarEstado(id, estado) {

        return await Mesa.findByIdAndUpdate(
            id,
            { estado },
            { new: true }
        );

    }

    async eliminar(id) {

        return await Mesa.findByIdAndDelete(id);

    }

}

export default new MesaRepository();