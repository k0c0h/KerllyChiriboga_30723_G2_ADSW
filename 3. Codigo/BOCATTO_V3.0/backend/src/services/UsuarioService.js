import bcrypt from "bcryptjs";
import UsuarioRepository from "../repositories/UsuarioRepository.js";
import ApiError from "../utils/ApiError.js";

class UsuarioService {

    async listarUsuarios() {
        return await UsuarioRepository.obtenerTodos();
    }

    async obtenerUsuario(id) {
        return await UsuarioRepository.obtenerPorId(id);
    }

    async crearUsuario(datos) {

        const existe = await UsuarioRepository.obtenerPorUsername(datos.username);

        if (existe) {

            throw new ApiError(

                "El usuario ya existe.",

                400

            );

        }
        const passwordHash = await bcrypt.hash(datos.password, 10);

        datos.password = passwordHash;

        return await UsuarioRepository.crear(datos);
    }

    async actualizarUsuario(id, datos) {

        if (datos.password) {
            datos.password = await bcrypt.hash(datos.password, 10);
        }

        return await UsuarioRepository.actualizar(id, datos);
    }

    async eliminarUsuario(id) {
        return await UsuarioRepository.eliminar(id);
    }

}

export default new UsuarioService();