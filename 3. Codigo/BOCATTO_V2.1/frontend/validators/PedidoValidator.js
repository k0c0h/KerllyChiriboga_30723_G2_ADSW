class PedidoValidator{

    validar(items, canal, telefonoEntrega){

        if(items.length===0){

            return{

                ok:false,

                mensaje:"Debe agregar productos."

            };

        }

        if (canal === "TELEFONO" && telefonoEntrega.trim() === "") {

            return {

                ok: false,

                mensaje: "Ingrese el teléfono para pedido telefónico."

            };

        }

        return{

            ok:true

        };

    }

}

export default new PedidoValidator();