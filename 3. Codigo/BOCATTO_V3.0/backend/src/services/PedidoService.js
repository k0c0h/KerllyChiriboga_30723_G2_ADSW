import PedidoRepository from "../repositories/PedidoRepository.js";
import DirectorPedido from "../patterns/builder/DirectorPedido.js";
import MenuRepository from "../repositories/MenuRepository.js";
import PromocionRepository from "../repositories/PromocionRepository.js";
import Mesa from "../models/Mesa.js";
import ApiError from "../utils/ApiError.js";
import PedidoValidator from "../validators/PedidoValidator.js";

class PedidoService {

    generarCodigoSeguimiento() {

        const random = Math.random().toString(36).slice(2, 8).toUpperCase();
        const timestamp = Date.now().toString(36).toUpperCase();

        return `BC-${timestamp}-${random}`;

    }

    async listarPedidos() {

        return await PedidoRepository.obtenerTodos();

    }


    async buscarPorMesa(idMesa) {

        return await PedidoRepository.obtenerPorMesaActiva(idMesa);

    }

    async obtenerPedido(id) {

        const pedido = await PedidoRepository.obtenerPorId(id);

        if (!pedido) {
            throw new ApiError("Pedido no encontrado.", 404);
        }

        return pedido;

    }

    async crearPedido(datos) {

        PedidoValidator.validar(datos);

        if (datos.mesa) {
            const mesa = await Mesa.findById(datos.mesa);

            if (!mesa) {
                throw new ApiError("Mesa no encontrada.", 404);
            }
        }

        const productosUnicos = [
            ...new Set(datos.items.map(item => String(item.producto)))
        ];

        const productos = await Promise.all(
            productosUnicos.map(id => MenuRepository.obtenerPorId(id))
        );

        const productosMap = new Map(
            productos
                .filter(Boolean)
                .map(producto => [String(producto._id), producto])
        );

        const itemsNormalizados = datos.items.map(item => {
            const producto = productosMap.get(String(item.producto));

            if (!producto) {
                throw new ApiError("Uno de los productos no existe.", 400);
            }

            return {
                producto,
                cantidad: Number(item.cantidad),
                observacion: item.observacion || ""
            };
        });

        let promocion = null;

        if (datos.promocion) {
            promocion = await PromocionRepository.obtenerPorId(datos.promocion);
        }

        const pedidoConstruido = DirectorPedido.construirPedido({
            ...datos,
            canal: datos.canal || "MESA",
            items: itemsNormalizados,
            promocion
        });

        pedidoConstruido.clienteNombre = datos.clienteNombre || "";

        if (pedidoConstruido.canal === "QR") {
            pedidoConstruido.codigoSeguimiento = this.generarCodigoSeguimiento();
        }

        const pedidoCreado = await PedidoRepository.crear(pedidoConstruido);

        if (pedidoCreado.mesa) {

            await Mesa.findByIdAndUpdate(
                pedidoCreado.mesa,
                { estado: "OCUPADA" }
            );

        }

        return pedidoCreado;

    }

    async crearPedidoQR(mesaId, datos) {

        return await this.crearPedido({
            ...datos,
            canal: "QR",
            mesa: mesaId
        });

    }

    async obtenerSeguimientoPorCodigo(codigoSeguimiento) {

        const pedido = await PedidoRepository.obtenerPorCodigoSeguimiento(codigoSeguimiento);

        if (!pedido) {
            throw new ApiError("Pedido no encontrado.", 404);
        }

        return {
            id: pedido._id,
            codigoSeguimiento: pedido.codigoSeguimiento,
            canal: pedido.canal,
            estado: pedido.estado,
            total: pedido.total,
            clienteNombre: pedido.clienteNombre,
            mesa: pedido.mesa,
            items: pedido.items,
            createdAt: pedido.createdAt,
            updatedAt: pedido.updatedAt
        };

    }

    async cambiarEstado(id, estado, datosExtra = {}) {

        const pedido = await PedidoRepository.actualizar(id, {
            estado,
            ...datosExtra
        });

        if (!pedido) {
            throw new ApiError("Pedido no encontrado.", 404);
        }

        if (estado === "PAGADO" && pedido.mesa) {

            await Mesa.findByIdAndUpdate(

                pedido.mesa,

                {

                    estado: "LIBRE"

                }

            );

        }

        return await PedidoRepository.obtenerPorId(id);

    }

    async pagarPedido(id, metodoPago = "EFECTIVO") {

        const pedido = await PedidoRepository.obtenerPorId(id);

        if (!pedido) {
            throw new ApiError("Pedido no encontrado.", 404);
        }

        if (pedido.estado === "PAGADO") {
            throw new ApiError("El pedido ya fue pagado.", 400);
        }

        return await this.cambiarEstado(id, "PAGADO", {
            metodoPago
        });

    }

    async eliminarPedido(id) {

        return await PedidoRepository.eliminar(id);

    }

}

export default new PedidoService();