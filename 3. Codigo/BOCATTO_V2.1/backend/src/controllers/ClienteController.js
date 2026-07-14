import ClienteService from "../services/ClienteService.js";
import ApiResponse from "../utils/ApiResponse.js";

class ClienteController {

    async listar(req, res, next) {

        try {

            const clientes = await ClienteService.listarClientes();

            ApiResponse.success(
                res,
                "Clientes obtenidos correctamente.",
                clientes
            );

        } catch (error) {

            next(error);

        }

    }

    async obtener(req, res, next) {

        try {

            const cliente = await ClienteService.obtenerCliente(req.params.id);

            ApiResponse.success(
                res,
                "Cliente obtenido correctamente.",
                cliente
            );

        } catch (error) {

            next(error);

        }

    }

    async crear(req, res, next) {

        try {

            const cliente = await ClienteService.crearCliente(req.body);

            ApiResponse.success(
                res,
                "Cliente creado correctamente.",
                cliente,
                201
            );

        } catch (error) {

            next(error);

        }

    }

    async actualizar(req, res, next) {

        try {

            const cliente = await ClienteService.actualizarCliente(
                req.params.id,
                req.body
            );

            ApiResponse.success(
                res,
                "Cliente actualizado correctamente.",
                cliente
            );

        } catch (error) {

            next(error);

        }

    }

    async eliminar(req, res, next) {

        try {

            await ClienteService.eliminarCliente(req.params.id);

            ApiResponse.success(
                res,
                "Cliente eliminado correctamente."
            );

        } catch (error) {

            next(error);

        }

    }

}

export default new ClienteController();