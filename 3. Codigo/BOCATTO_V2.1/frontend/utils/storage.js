class Storage {

    guardarToken(token) {

        localStorage.setItem(

            "token",

            token

        );

    }

    obtenerToken() {

        return localStorage.getItem(

            "token"

        );

    }

    eliminarToken() {

        localStorage.removeItem(

            "token"

        );

    }

    guardarUsuario(usuario) {

        localStorage.setItem(

            "usuario",

            JSON.stringify(usuario)

        );

    }

    obtenerUsuario() {

        const usuario =

            localStorage.getItem(

                "usuario"

            );

        return usuario

            ? JSON.parse(usuario)

            : null;

    }

    eliminarUsuario() {

        localStorage.removeItem(

            "usuario"

        );

    }

    limpiarSesion() {

        localStorage.removeItem(

            "token"

        );

        localStorage.removeItem(

            "usuario"

        );

    }

    estaAutenticado() {

        return !!this.obtenerToken();

    }

}

export default new Storage();