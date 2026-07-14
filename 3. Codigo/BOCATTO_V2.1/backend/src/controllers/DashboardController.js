import DashboardService from "../services/DashboardService.js";
import ApiResponse from "../utils/ApiResponse.js";

class DashboardController {

    async resumen(req, res, next) {

        try {

            const datos = await DashboardService.resumen();

            ApiResponse.success(

                res,

                "Resumen obtenido correctamente.",

                datos

            );

        }

        catch (error) {

            next(error);

        }

    }

}

export default new DashboardController();