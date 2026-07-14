import Pedido from "../models/Pedido.js";

class PedidoRepository {

    basePopulate(query) {

        return query
            .populate("mesa")
            .populate("cliente")
            .populate("mesero")
            .populate("items.producto");

    }

    async obtenerTodos() {

        return await this.basePopulate(Pedido.find());

    }

    async obtenerPorId(id) {

        return await this.basePopulate(Pedido.findById(id));

    }

    async obtenerPorMesaActiva(idMesa) {

        return await this.basePopulate(
            Pedido.findOne({
                mesa: idMesa,
                estado: { $ne: "PAGADO" }
            })
        );

    }

    async obtenerPorCodigoSeguimiento(codigoSeguimiento) {

        return await this.basePopulate(
            Pedido.findOne({ codigoSeguimiento })
        );

    }

    async crear(pedido) {

        const creado = await Pedido.create(pedido);

        return await this.obtenerPorId(creado._id);

    }

    async actualizar(id, datos) {

        return await Pedido.findByIdAndUpdate(
            id,
            datos,
            {
                new: true
            }
        );

    }

    async eliminar(id) {

        return await Pedido.findByIdAndDelete(id);

    }

}

export default new PedidoRepository();