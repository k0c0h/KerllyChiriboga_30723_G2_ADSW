import ReporteService from "../services/ReporteService.js";
import ApiResponse from "../utils/ApiResponse.js";

class ReporteController {

    async listar(req, res, next) {

        try {

            const datos =

                await ReporteService.obtenerVentas(

                    req.query.inicio,

                    req.query.fin

                );

            ApiResponse.success(

                res,

                "Reporte generado.",

                datos

            );

        }

        catch (error) {

            next(error);

        }

    }

}

export default new ReporteController();