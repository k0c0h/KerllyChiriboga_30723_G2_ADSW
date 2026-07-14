import PedidoDTO from "../dto/PedidoDTO.js";

class PedidoMapper{

    toDTO(pedido){

        return new PedidoDTO(pedido);

    }

    toDTOList(lista){

        return lista.map(

            pedido=>new PedidoDTO(pedido)

        );

    }

}

export default new PedidoMapper();