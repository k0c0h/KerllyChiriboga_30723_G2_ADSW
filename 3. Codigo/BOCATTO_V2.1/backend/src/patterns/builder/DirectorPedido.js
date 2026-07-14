import PedidoBuilder from "./PedidoBuilder.js";

class DirectorPedido {

    constructor() {

        this.builder = new PedidoBuilder();

    }

    construirPedido(datos) {

        this.builder
            .reset()
            .setCanal(datos.canal)
            .setMesa(datos.mesa)
            .setCliente(datos.cliente)
            .setMesero(datos.mesero)
            .setDatosEntrega(
                datos.telefonoEntrega,
                datos.direccionEntrega
            );

        datos.items.forEach(item => {

            this.builder.agregarProducto(
                item.producto,
                item.cantidad,
                item.observacion
            );

        });

        if (datos.promocion) {

            this.builder.aplicarPromocion(
                datos.promocion
            );

        }

        return this.builder
            .calcularTotal()
            .build();

    }

}

export default new DirectorPedido();