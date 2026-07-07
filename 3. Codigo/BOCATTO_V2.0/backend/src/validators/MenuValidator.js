import ApiError from "../utils/ApiError.js";

class MenuValidator {

    validar(datos) {

        if (!datos.nombre?.trim()) {

            throw new ApiError(
                "Ingrese el nombre.",
                400
            );

        }

        if (datos.precio <= 0) {

            throw new ApiError(
                "El precio debe ser mayor a cero.",
                400
            );

        }

    }

}

export default new MenuValidator();