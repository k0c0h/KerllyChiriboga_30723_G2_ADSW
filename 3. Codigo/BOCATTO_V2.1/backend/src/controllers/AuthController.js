import AuthService from "../services/AuthService.js";
import ApiResponse from "../utils/ApiResponse.js";

class AuthController {

    async login(req, res, next) {

        try {

            const { username, password } = req.body;

            const resultado = await AuthService.login(
                username,
                password
            );

            ApiResponse.success(
                res,
                "Inicio de sesión exitoso.",
                resultado
            );

        } catch (error) {

            next(error);

        }

    }

    async logout(req, res) {

        ApiResponse.success(
            res,
            "Sesión cerrada correctamente."
        );

    }

}

export default new AuthController();