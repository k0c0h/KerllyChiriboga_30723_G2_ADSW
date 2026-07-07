import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import UsuarioRepository from "../repositories/UsuarioRepository.js";
import ApiError from "../utils/ApiError.js";

class AuthService {

    async login(username, password) {

        const usuario =

            await UsuarioRepository.obtenerPorUsername(username);

        if (!usuario) {

            throw new Error("Usuario no existe.");

        }

        if (usuario.bloqueado) {

            throw new ApiError(

                "Usuario bloqueado.",

                401

            );

        }

        const coincide =

            await bcrypt.compare(

                password,

                usuario.password

            );

        if (!coincide) {

            const intentos =

                usuario.intentosFallidos + 1;

            await UsuarioRepository.actualizarIntentos(

                usuario._id,

                intentos

            );

            if (intentos >= 3) {

                await UsuarioRepository.bloquearUsuario(

                    usuario._id

                );

            }

            throw new Error("Contraseña incorrecta.");

        }

        await UsuarioRepository.actualizarIntentos(

            usuario._id,

            0

        );

        const token =

            jwt.sign(

                {

                    id: usuario._id,

                    rol: usuario.rol,

                    username: usuario.username

                },

                process.env.JWT_SECRET,

                {

                    expiresIn: "8h"

                }

            );

        return {

            token,

            usuario

        };

    }

}

export default new AuthService();