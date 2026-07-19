import Auth from "./Auth.js";

class Router {

    constructor() {

        this.routes = {

            dashboard: {

                html: "templates/dashboard.html",

                module: "../modules/DashboardModule.js",

                roles: [

                    "ADMIN"

                ]

            },

            usuarios: {

                html: "templates/usuarios.html",

                module: "../modules/UsuarioModule.js",

                roles: [

                    "ADMIN"

                ]

            },

            clientes: {

                html: "templates/clientes.html",

                module: "../modules/ClienteModule.js",

                roles: [

                    "ADMIN",

                    "MESERO",

                    "OPERADOR"

                ]

            },

            mesas: {

                html: "templates/mesas.html",

                module: "../modules/MesaModule.js",

                roles: [

                    "ADMIN",

                    "MESERO"

                ]

            },

            menu: {

                html: "templates/menu.html",

                module: "../modules/MenuModule.js",

                roles: [

                    "ADMIN",

                    "COCINA",

                    "MESERO",

                    "OPERADOR"

                ]

            },

            pedidos: {

                html: "templates/pedidos.html",

                module: "../modules/PedidoModule.js",

                roles: [

                    "ADMIN",

                    "MESERO",

                    "OPERADOR"

                ]

            },

            promociones: {

                html: "templates/promociones.html",

                module: "../modules/PromocionModule.js",

                roles: [

                    "ADMIN"

                ]

            },

            cocina: {

                html: "templates/cocina.html",

                module: "../modules/CocinaModule.js",

                roles: [

                    "ADMIN",

                    "COCINA"

                ]

            },

            caja: {

                html: "templates/caja.html",

                module: "../modules/CajaModule.js",

                roles: [

                    "ADMIN",

                    "CAJA"

                ]

            },

            reportes: {

                html: "templates/reportes.html",

                module: "../modules/ReporteModule.js",

                roles: [

                    "ADMIN",

                    "CAJA"

                ]

            }

        };

    }

    async navegar(nombre) {

        const ruta = this.routes[nombre];

        if (!ruta) return;

        if (!Auth.autenticado()) {

            window.location.href = "login.html";

            return;

        }

        if (!Auth.tieneRol(...ruta.roles)) {

            const html = await fetch(

                "templates/403.html"

            );

            document.getElementById(

                "contenido"

            ).innerHTML =

                await html.text();

            return;

        }

        const html = await fetch(

            ruta.html

        );

        document.getElementById(

            "contenido"

        ).innerHTML =

            await html.text();

        const modulo = await import(

            ruta.module

        );

        await modulo.init();

    }

    async init() {

        if (!Auth.verificarSesion()) {

            return;

        }

        const rol = Auth.rol();

        // Redirect non-ADMIN users to their default view
        if (rol === "ADMIN") {
            await this.navegar("dashboard");
        } else if (rol === "COCINA") {
            await this.navegar("cocina");
        } else if (rol === "CAJA") {
            await this.navegar("caja");
        } else if (rol === "MESERO" || rol === "OPERADOR") {
            await this.navegar("pedidos");
        } else {
            await this.navegar("clientes");
        }

        document.body.addEventListener("click", e => {

            const link = e.target.closest("[data-route]");

            if (!link) return;

            e.preventDefault();

            this.navegar(link.dataset.route);

        });

    }

}

export default new Router();