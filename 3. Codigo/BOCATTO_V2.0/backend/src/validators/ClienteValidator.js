import ApiError from "../utils/ApiError.js";

class ClienteValidator {

    validar(datos) {

        if (!datos.nombre?.trim()) {
            throw new ApiError(
                "Ingrese el nombre del cliente.",
                400
            );
        }

        if (
            datos.correo &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)
        ) {
            throw new ApiError(
                "Correo electrónico inválido.",
                400
            );
        }

    }

}

export default new ClienteValidator();