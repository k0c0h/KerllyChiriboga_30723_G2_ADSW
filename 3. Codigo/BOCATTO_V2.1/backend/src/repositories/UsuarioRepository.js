import Usuario from "../models/Usuario.js";

class UsuarioRepository {

    async obtenerTodos() {

        return await Usuario.find();

    }

    async obtenerPorId(id) {

        return await Usuario.findById(id);

    }

    async obtenerPorUsername(username) {

        return await Usuario.findOne({ username });

    }

    async crear(usuario) {

        return await Usuario.create(usuario);

    }

    async actualizar(id, datos) {

        return await Usuario.findByIdAndUpdate(
            id,
            datos,
            {
                new: true
            }
        );

    }

    async eliminar(id) {

        return await Usuario.findByIdAndDelete(id);

    }

    async actualizarIntentos(id, intentos) {

        return await Usuario.findByIdAndUpdate(

            id,

            {

                intentosFallidos: intentos

            },

            {

                new: true

            }

        );

    }
    async bloquearUsuario(id) {

        const bloqueadoHasta = new Date(Date.now() + 5 * 60 * 1000);

        return await Usuario.findByIdAndUpdate(

            id,

            {

                bloqueado: true,

                bloqueadoHasta: bloqueadoHasta

            },

            {

                new: true

            }

        );

    }

    async desbloquearUsuario(id) {

        return await Usuario.findByIdAndUpdate(

            id,

            {

                bloqueado: false,

                intentosFallidos: 0,

                bloqueadoHasta: null

            },

            {

                new: true

            }

        );

    }
}

export default new UsuarioRepository();