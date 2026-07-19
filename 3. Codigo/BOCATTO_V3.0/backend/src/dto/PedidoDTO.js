class PedidoDTO{

    constructor(pedido){

        this.id=pedido._id;

        this.mesa=pedido.mesa;

        this.cliente=pedido.cliente;

        this.mesero=pedido.mesero;

        this.metodoPago=pedido.metodoPago;

        this.items=pedido.items;

        this.total=pedido.total;

        this.estado=pedido.estado;

        this.fecha=pedido.createdAt;

    }

}

export default PedidoDTO;