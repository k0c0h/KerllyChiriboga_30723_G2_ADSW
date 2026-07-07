import MesaService from "../services/MesaService.js";
import ApiResponse from "../utils/ApiResponse.js";

class MesaController {

    async listar(req, res, next) {

        try {

            const mesas = await MesaService.listarMesas();

            ApiResponse.success(
                res,
                "Mesas obtenidas correctamente.",
                mesas
            );

        } catch (error) {

            next(error);

        }

    }

    async crear(req, res, next) {

        try {

            const mesa = await MesaService.crearMesa(req.body);

            ApiResponse.success(
                res,
                "Mesa creada correctamente.",
                mesa,
                201
            );

        } catch (error) {

            next(error);

        }

    }

    async obtener(req, res, next) {

        try {

            const mesa = await MesaService.obtenerMesaPorId(req.params.id);

            ApiResponse.success(
                res,
                "Mesa obtenida correctamente.",
                mesa
            );

        } catch (error) {

            next(error);

        }

    }

    async actualizar(req, res, next) {

        try {

            const mesa = await MesaService.actualizarMesa(
                req.params.id,
                req.body
            );

            ApiResponse.success(
                res,
                "Mesa actualizada correctamente.",
                mesa
            );

        } catch (error) {

            next(error);

        }

    }

    async cambiarEstado(req, res, next) {

        try {

            const mesa = await MesaService.cambiarEstado(
                req.params.id,
                req.body.estado
            );

            ApiResponse.success(
                res,
                "Estado de la mesa actualizado.",
                mesa
            );

        } catch (error) {

            next(error);

        }

    }

    async eliminar(req, res, next) {

        try {

            await MesaService.eliminarMesa(req.params.id);

            ApiResponse.success(
                res,
                "Mesa eliminada correctamente."
            );

        } catch (error) {

            next(error);

        }

    }

}

export default new MesaController();