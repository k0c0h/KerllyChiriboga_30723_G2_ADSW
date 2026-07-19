import Promocion from "../models/Promocion.js";

class PromocionRepository {

    async obtenerTodas() {

        return await Promocion.find();

    }

    async obtenerActivas() {

        return await Promocion.find({
            activa: true
        });

    }

    async obtenerPorId(id) {

        return await Promocion.findById(id);

    }

    async crear(promocion) {

        return await Promocion.create(promocion);

    }

    async actualizar(id, datos) {

        return await Promocion.findByIdAndUpdate(id, datos, {
            new: true
        });

    }

    async eliminar(id) {

        return await Promocion.findByIdAndDelete(id);

    }

}

export default new PromocionRepository();