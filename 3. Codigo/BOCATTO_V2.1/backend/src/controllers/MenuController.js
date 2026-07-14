import MenuService from "../services/MenuService.js";
import ApiResponse from "../utils/ApiResponse.js";

class MenuController {

    async listar(req, res, next) {

        try {

            const menu = await MenuService.listarMenu();

            ApiResponse.success(
                res,
                "Menú obtenido correctamente.",
                menu
            );

        } catch (error) {

            next(error);

        }

    }

    async disponibles(req, res, next) {

        try {

            const menu = await MenuService.listarDisponibles();

            ApiResponse.success(
                res,
                "Productos disponibles.",
                menu
            );

        } catch (error) {

            next(error);

        }

    }

    async crear(req, res, next) {

        try {

            const producto = await MenuService.crearProducto(req.body);

            ApiResponse.success(
                res,
                "Producto creado correctamente.",
                producto,
                201
            );

        } catch (error) {

            next(error);

        }

    }

}

export default new MenuController();