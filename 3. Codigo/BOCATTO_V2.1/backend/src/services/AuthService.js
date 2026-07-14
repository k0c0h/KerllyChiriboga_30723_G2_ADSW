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

            if (usuario.bloqueadoHasta && new Date() < new Date(usuario.bloqueadoHasta)) {

                const segundosRestantes = Math.ceil((new Date(usuario.bloqueadoHasta) - new Date()) / 1000);

                throw new ApiError("BLOQUEADO:" + segundosRestantes, 403);

            } else {

                // Time has passed, unblock

                await UsuarioRepository.desbloquearUsuario(usuario._id);

                usuario.bloqueado = false;

                usuario.intentosFallidos = 0;

            }

        }

        const coincide =

            await bcrypt.compare(

                password,

                usuario.password

            );

        if (!coincide) {

            const intentos =

                (usuario.intentosFallidos || 0) + 1;

            if (intentos >= 3) {

                await UsuarioRepository.bloquearUsuario(

                    usuario._id

                );

                throw new ApiError("BLOQUEADO:300", 403);

            } else {

                await UsuarioRepository.actualizarIntentos(

                    usuario._id,

                    intentos

                );

                throw new ApiError("INTENTOS:" + (3 - intentos), 401);

            }

        }

        // Login successful, reset attempts

        await UsuarioRepository.desbloquearUsuario(usuario._id);

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