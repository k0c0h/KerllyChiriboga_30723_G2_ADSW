import ApiResponse from "../utils/ApiResponse.js";
import MenuRepository from "../repositories/MenuRepository.js";
import MesaRepository from "../repositories/MesaRepository.js";
import PedidoService from "../services/PedidoService.js";

class PublicPedidoController {

    async obtenerMenuPorMesa(req, res, next) {

        try {

            const mesa = await MesaRepository.obtenerPorId(req.params.mesaId);

            if (!mesa) {
                return res.status(404).json({
                    success: false,
                    message: "Mesa no encontrada.",
                    data: null
                });
            }

            const menu = await MenuRepository.obtenerDisponibles();

            ApiResponse.success(
                res,
                "Menú disponible obtenido correctamente.",
                {
                    mesa,
                    menu
                }
            );

        } catch (error) {

            next(error);

        }

    }

    async crearPedidoQR(req, res, next) {

        try {

            const pedido = await PedidoService.crearPedidoQR(
                req.params.mesaId,
                req.body
            );

            const io = req.app.get("io");
            io.emit("pedidoNuevo", pedido);

            ApiResponse.success(
                res,
                "Pedido QR registrado correctamente.",
                {
                    pedido,
                    codigoSeguimiento: pedido.codigoSeguimiento
                },
                201
            );

        } catch (error) {

            next(error);

        }

    }

    async seguirPedido(req, res, next) {

        try {

            const data = await PedidoService.obtenerSeguimientoPorCodigo(
                req.params.codigoSeguimiento
            );

            ApiResponse.success(
                res,
                "Seguimiento obtenido correctamente.",
                data
            );

        } catch (error) {

            next(error);

        }

    }

}

export default new PublicPedidoController();
