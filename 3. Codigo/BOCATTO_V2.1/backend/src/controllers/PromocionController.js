import PromocionService from "../services/PromocionService.js";
import ApiResponse from "../utils/ApiResponse.js";

class PromocionController {

    async listar(req, res, next) {
        try {
            const promociones = await PromocionService.listarPromociones();
            ApiResponse.success(res, "Promociones obtenidas correctamente.", promociones);
        } catch (error) {
            next(error);
        }
    }

    async obtener(req, res, next) {
        try {
            const promocion = await PromocionService.obtenerPromocion(req.params.id);
            if (!promocion) {
                return res.status(404).json({ success: false, message: "Promoción no encontrada.", data: null });
            }
            ApiResponse.success(res, "Promoción obtenida correctamente.", promocion);
        } catch (error) {
            next(error);
        }
    }

    async crear(req, res, next) {
        try {
            const promocion = await PromocionService.crearPromocion(req.body);
            ApiResponse.success(res, "Promoción creada correctamente.", promocion, 201);
        } catch (error) {
            next(error);
        }
    }

    async actualizar(req, res, next) {
        try {
            const promocion = await PromocionService.actualizarPromocion(req.params.id, req.body);
            ApiResponse.success(res, "Promoción actualizada correctamente.", promocion);
        } catch (error) {
            next(error);
        }
    }

    async eliminar(req, res, next) {
        try {
            await PromocionService.eliminarPromocion(req.params.id);
            ApiResponse.success(res, "Promoción eliminada correctamente.", null);
        } catch (error) {
            next(error);
        }
    }

}

export default new PromocionController();