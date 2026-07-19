import Auth from "./Auth.js";

class Layout {

    async cargarComponente(id, ruta) {

        const respuesta = await fetch(ruta);

        const html = await respuesta.text();

        document.getElementById(id).innerHTML = html;

    }

    async configurarSidebar() {

        if (!Auth.verificarSesion()) {

            return;

        }

        const usuario = Auth.usuario();

        /* Sidebar */

        const sidebarNombre =

            document.getElementById(

                "usuarioNombre"

            );

        if (sidebarNombre) {

            sidebarNombre.textContent =

                `${usuario.nombre} ${usuario.apellido}`;

        }

        const sidebarRol =

            document.getElementById(

                "usuarioRol"

            );

        if (sidebarRol) {

            sidebarRol.textContent =

                usuario.rol;

        }

        /* Navbar */

        const navbarNombre =

            document.getElementById(

                "navbarUsuario"

            );

        if (navbarNombre) {

            navbarNombre.textContent =

                `${usuario.nombre} ${usuario.apellido}`;

        }

        const navbarRol =

            document.getElementById(

                "navbarRol"

            );

        if (navbarRol) {

            navbarRol.textContent =

                usuario.rol;

        }

        document

            .querySelectorAll(

                "[data-roles]"

            )

            .forEach(item => {

                const roles =

                    item.dataset.roles

                        .split(",");

                item.style.display =

                    roles.includes(

                        usuario.rol

                    )

                        ? ""

                        : "none";

            });

        const salir1 =

            document.getElementById(

                "btnSalir"

            );

        if (salir1) {

            salir1.onclick = () =>

                Auth.cerrarSesion();

        }

        const salir2 =

            document.getElementById(

                "logout"

            );

        if (salir2) {

            salir2.onclick = () =>

                Auth.cerrarSesion();

        }

    }
    
    async init() {

        await this.cargarComponente(

            "sidebar",

            "components/sidebar.html"

        );

        await this.cargarComponente(

            "navbar",

            "components/navbar.html"

        );

        await this.configurarSidebar();

    }

}

export default new Layout();