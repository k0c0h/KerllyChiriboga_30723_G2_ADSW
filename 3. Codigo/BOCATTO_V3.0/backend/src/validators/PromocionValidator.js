import ApiError from "../utils/ApiError.js";

class PromocionValidator {

    validar(datos) {

        if (!datos.nombre?.trim()) {

            throw new ApiError(
                "Ingrese el nombre.",
                400
            );

        }

        if (
            datos.descuento < 0 ||
            datos.descuento > 100
        ) {

            throw new ApiError(
                "El descuento debe estar entre 0 y 100.",
                400
            );

        }

    }

}

export default new PromocionValidator();