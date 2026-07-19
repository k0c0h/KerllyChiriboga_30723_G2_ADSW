class PedidoValidator {

    validar(items, canal, clienteNombre, telefonoEntrega, direccionEntrega) {
        if (!items || items.length === 0) {
            return {
                ok: false,
                mensaje: "Debe agregar al menos un producto al pedido."
            };
        }

        if (canal === "TELEFONO") {
            if (!clienteNombre || clienteNombre.trim() === "") {
                return {
                    ok: false,
                    mensaje: "Ingrese el nombre del cliente para el pedido telefónico."
                };
            }
            if (!telefonoEntrega || telefonoEntrega.trim() === "") {
                return {
                    ok: false,
                    target: "telefonoEntrega",
                    mensaje: "Ingrese el teléfono de contacto para el pedido telefónico."
                };
            }
            if (!direccionEntrega || direccionEntrega.trim() === "") {
                return {
                    ok: false,
                    mensaje: "Ingrese la dirección de entrega para el pedido telefónico."
                };
            }
        }

        return {
            ok: true
        };
    }
}

export default new PedidoValidator();