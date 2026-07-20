import PromocionRepository from "../repositories/PromocionRepository.js";

class PromocionService {

    async listarPromociones() {
        return await PromocionRepository.obtenerTodas();
    }

    async obtenerPromocion(id) {
        return await PromocionRepository.obtenerPorId(id);
    }

    async listarActivas() {
        return await PromocionRepository.obtenerActivas();
    }

    async crearPromocion(datos) {
        return await PromocionRepository.crear(datos);
    }

        async clonarPromocion(id, cambios = {}) {

        const promocionOriginal = await PromocionRepository.obtenerPorId(id);

        if (!promocionOriginal) {
            throw new ApiError("Promoci\u00f3n no encontrada.", 404);
        }

        const promocionClonada = new PromocionPrototype(promocionOriginal).clone(cambios);

        PromocionValidator.validar(promocionClonada);

        return await PromocionRepository.crear(promocionClonada);
    }


    async actualizarPromocion(id, datos) {
        return await PromocionRepository.actualizar(id, datos);
    }

    async eliminarPromocion(id) {
        return await PromocionRepository.eliminar(id);
    }

}

export default new PromocionService();