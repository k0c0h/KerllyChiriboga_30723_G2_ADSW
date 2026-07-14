import ApiError from "../utils/ApiError.js";

class UsuarioValidator {

    validar(datos) {

        if (!datos.nombre?.trim()) {
            throw new ApiError("El nombre es obligatorio.", 400);
        }

        if (!datos.apellido?.trim()) {
            throw new ApiError("El apellido es obligatorio.", 400);
        }

        if (!datos.username?.trim()) {
            throw new ApiError("El nombre de usuario es obligatorio.", 400);
        }

        if (!datos.password || datos.password.length < 6) {
            throw new ApiError(
                "La contraseña debe tener mínimo 6 caracteres.",
                400
            );
        }

        const roles = [
            "ADMIN",
            "MESERO",
            "COCINA",
            "CAJA"
        ];

        if (!roles.includes(datos.rol)) {
            throw new ApiError(
                "Rol inválido.",
                400
            );
        }

    }

}

export default new UsuarioValidator();