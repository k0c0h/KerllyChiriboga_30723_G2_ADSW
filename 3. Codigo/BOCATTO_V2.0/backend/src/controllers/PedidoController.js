import PedidoService from "../services/PedidoService.js";
import ApiResponse from "../utils/ApiResponse.js";

class PedidoController {

    async listar(req, res, next) {

        try {

            const pedidos = await PedidoService.listarPedidos();

            ApiResponse.success(
                res,
                "Pedidos obtenidos correctamente.",
                pedidos
            );

        } catch (error) {

            next(error);

        }

    }


    async buscarPorMesa(req, res, next) {

        try {

            const pedido =

                await PedidoService.buscarPorMesa(

                    req.params.id

                );

            ApiResponse.success(

                res,

                "Pedido encontrado.",

                pedido

            );

        }

        catch (error) {

            next(error);

        }

    }

    async obtener(req, res, next) {

        try {

            const pedido = await PedidoService.obtenerPedido(req.params.id);

            ApiResponse.success(
                res,
                "Pedido obtenido correctamente.",
                pedido
            );

        } catch (error) {

            next(error);

        }

    }

    async crear(req, res, next) {

        try {

            const pedido = await PedidoService.crearPedido(req.body);
            const io = req.app.get("io");

            io.emit(

                "pedidoNuevo",

                pedido

            );

            ApiResponse.success(
                res,
                "Pedido registrado correctamente.",
                pedido,
                201
            );

        } catch (error) {

            next(error);

        }

    }

    async cambiarEstado(req, res, next) {

        try {

            const io = req.app.get("io");

            const pedido = await PedidoService.cambiarEstado(
                req.params.id,
                req.body.estado
            );

            io.emit(

                "estadoPedido",

                pedido

            );

            ApiResponse.success(
                res,
                "Estado del pedido actualizado.",
                pedido
            );

        } catch (error) {

            next(error);

        }

    }

    async pagar(req, res, next) {

        try {

            const pedido = await PedidoService.pagarPedido(
                req.params.id
            );

            ApiResponse.success(
                res,
                "Pago registrado correctamente.",
                pedido
            );

        } catch (error) {

            next(error);

        }

    }

    async eliminar(req, res, next) {

        try {

            await PedidoService.eliminarPedido(req.params.id);

            ApiResponse.success(
                res,
                "Pedido eliminado correctamente."
            );

        } catch (error) {

            next(error);

        }

    }

}

export default new PedidoController();