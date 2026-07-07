import AuthService from "../../services/authService.js";

import Storage from "../../utils/storage.js";

const form = document.getElementById(

    "loginForm"

);

form.addEventListener(

    "submit",

    async (e) => {

        e.preventDefault();

        const username =

            document.getElementById(

                "username"

            ).value;

        const password =

            document.getElementById(

                "password"

            ).value;

        const respuesta =

            await AuthService.login(

                username,

                password

            );

        if (respuesta.success) {

            Storage.guardarToken(

                respuesta.data.token

            );

            Storage.guardarUsuario(

                respuesta.data.usuario

            );

            window.location.href =

                "index.html";

        }

        else {

            alert(

                respuesta.message

            );

        }

    }

);