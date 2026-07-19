import ApiError from "../utils/ApiError.js";

class MesaValidator {

    validar(datos) {

        if (!datos.numero) {

            throw new ApiError(
                "Número de mesa obligatorio.",
                400
            );

        }

        if (datos.capacidad < 1) {

            throw new ApiError(
                "Capacidad inválida.",
                400
            );

        }

    }

}

export default new MesaValidator();