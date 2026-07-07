import PromocionRepository from "../repositories/PromocionRepository.js";

class PromocionService {

    async listarPromociones() {
        return await PromocionRepository.obtenerTodas();
    }

    async listarActivas() {
        return await PromocionRepository.obtenerActivas();
    }

    async crearPromocion(datos) {
        return await PromocionRepository.crear(datos);
    }

    async actualizarPromocion(id, datos) {
        return await PromocionRepository.actualizar(id, datos);
    }

    async eliminarPromocion(id) {
        return await PromocionRepository.eliminar(id);
    }

}

export default new PromocionService();