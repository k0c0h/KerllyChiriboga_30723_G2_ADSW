import UsuarioService from "../services/UsuarioService.js";
import ApiResponse from "../utils/ApiResponse.js";

class UsuarioController {

    async listar(req, res, next) {

        try {

            const usuarios = await UsuarioService.listarUsuarios();

            ApiResponse.success(
                res,
                "Usuarios obtenidos correctamente.",
                usuarios
            );

        } catch (error) {

            next(error);

        }

    }

    async obtener(req, res, next) {

        try {

            const usuario = await UsuarioService.obtenerUsuario(req.params.id);

            ApiResponse.success(
                res,
                "Usuario obtenido correctamente.",
                usuario
            );

        } catch (error) {

            next(error);

        }

    }

    async crear(req, res, next) {

        try {

            const usuario = await UsuarioService.crearUsuario(req.body);

            ApiResponse.success(
                res,
                "Usuario creado correctamente.",
                usuario,
                201
            );

        } catch (error) {

            next(error);

        }

    }

    async actualizar(req, res, next) {

        try {

            const usuario = await UsuarioService.actualizarUsuario(
                req.params.id,
                req.body
            );

            ApiResponse.success(
                res,
                "Usuario actualizado correctamente.",
                usuario
            );

        } catch (error) {

            next(error);

        }

    }

    async eliminar(req, res, next) {

        try {

            await UsuarioService.eliminarUsuario(req.params.id);

            ApiResponse.success(
                res,
                "Usuario eliminado correctamente."
            );

        } catch (error) {

            next(error);

        }

    }

}

export default new UsuarioController();