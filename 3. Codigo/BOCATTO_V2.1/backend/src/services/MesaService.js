import MesaRepository from "../repositories/MesaRepository.js";
import ApiError from "../utils/ApiError.js";

class MesaService {

    async listarMesas() {
        return await MesaRepository.obtenerTodas();
    }

    async obtenerMesa(numero) {
        return await MesaRepository.obtenerPorNumero(numero);
    }

    async obtenerMesaPorId(id) {

        const mesa = await MesaRepository.obtenerPorId(id);

        if (!mesa) {
            throw new ApiError("Mesa no encontrada.", 404);
        }

        return mesa;

    }

    async cambiarEstado(id, estado) {

        const mesa = await MesaRepository.actualizarEstado(id, estado);

        if (!mesa) {
            throw new ApiError("Mesa no encontrada.", 404);
        }

        return mesa;

    }

    async crearMesa(datos) {

        const mesa = await MesaRepository.obtenerPorNumero(datos.numero);

        if (mesa) {
            throw new ApiError(

                "La mesa ya existe.",

                400

            );
        }

        return await MesaRepository.crear(datos);
    }

    async actualizarMesa(id, datos) {

        if (datos.numero) {

            const existente = await MesaRepository.obtenerPorNumero(datos.numero);

            if (existente && String(existente._id) !== String(id)) {
                throw new ApiError("La mesa ya existe.", 400);
            }

        }

        const mesa = await MesaRepository.actualizar(id, datos);

        if (!mesa) {
            throw new ApiError("Mesa no encontrada.", 404);
        }

        return mesa;

    }

    async eliminarMesa(id) {

        const mesa = await MesaRepository.eliminar(id);

        if (!mesa) {
            throw new ApiError("Mesa no encontrada.", 404);
        }

        return mesa;

    }

}

export default new MesaService();