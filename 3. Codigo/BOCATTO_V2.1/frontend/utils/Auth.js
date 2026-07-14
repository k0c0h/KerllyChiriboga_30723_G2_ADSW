import Storage from "./storage.js";

class Auth {

    autenticado() {

        return Storage.estaAutenticado();

    }

    usuario() {

        return Storage.obtenerUsuario();

    }

    rol() {

        const usuario = this.usuario();

        return usuario

            ? usuario.rol

            : null;

    }

    tieneRol(...roles) {

        return roles.includes(

            this.rol()

        );

    }

    verificarSesion() {

        if (!this.autenticado()) {

            window.location.href =

                "login.html";

            return false;

        }

        return true;

    }

    cerrarSesion() {

        Storage.limpiarSesion();

        window.location.href =

            "login.html";

    }

}

export default new Auth();