import PromocionService from "../services/PromocionService.js";
import ApiResponse from "../utils/ApiResponse.js";

class PromocionController {

    async listar(req, res, next) {

        try {

            const promociones = await PromocionService.listarPromociones();

            ApiResponse.success(
                res,
                "Promociones obtenidas correctamente.",
                promociones
            );

        } catch (error) {

            next(error);

        }

    }

    async crear(req, res, next) {

        try {

            const promocion = await PromocionService.crearPromocion(req.body);

            ApiResponse.success(
                res,
                "Promoción creada correctamente.",
                promocion,
                201
            );

        } catch (error) {

            next(error);

        }

    }

}

export default new PromocionController();