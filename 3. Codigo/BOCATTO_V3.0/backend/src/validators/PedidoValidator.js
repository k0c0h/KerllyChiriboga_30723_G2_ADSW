import ApiError from "../utils/ApiError.js";

class PedidoValidator {

    validar(datos) {

        const canal = (datos.canal || "MESA").toUpperCase();

        if (canal !== "TELEFONO" && canal !== "QR" && !datos.mesa) {

            throw new ApiError(
                "Debe seleccionar una mesa.",
                400
            );

        }

        if (
            !datos.items ||
            datos.items.length === 0
        ) {

            throw new ApiError(
                "Debe agregar al menos un producto.",
                400
            );

        }

        datos.items.forEach(item => {

            if (item.cantidad <= 0) {

                throw new ApiError(
                    "Cantidad inválida.",
                    400
                );

            }

        });

        if (canal === "TELEFONO") {
            if (!datos.clienteNombre) {
                throw new ApiError("El pedido telefónico requiere el nombre del cliente.", 400);
            }
            if (!datos.telefonoEntrega) {
                throw new ApiError("El pedido telefónico requiere teléfono de contacto.", 400);
            }
            if (!datos.direccionEntrega) {
                throw new ApiError("El pedido telefónico requiere dirección de entrega.", 400);
            }
        }

        if (canal === "QR" && !datos.clienteNombre) {

            throw new ApiError(
                "El pedido QR requiere el nombre del cliente.",
                400
            );

        }

    }

}

export default new PedidoValidator();