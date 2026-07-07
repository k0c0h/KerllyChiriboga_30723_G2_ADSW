import DashboardService from "../services/dashboardService.js";
import DashboardView from "../views/DashboardView.js";

import Loader from "../utils/Loader.js";
import Toast from "../utils/Toast.js";
import socket from "../utils/socket.js";
import EventBus from "../utils/EventBus.js";

class DashboardController {

    ultimoTotalPedidos = 0;

    intervalo = null;

    async init() {

        await this.cargarDashboard();

        socket.on(

            "pedidoNuevo",

            () => {

                this.cargarDashboard(false);

            }

        );

        socket.on(

            "estadoPedido",

            () => {

                this.cargarDashboard(false);

            }

        );

        EventBus.escuchar(

            "pedido-creado",

            async () => {

                await this.cargarDashboard(false);

            }

        );

        EventBus.escuchar(

            "pedido-eliminado",

            async () => {

                await this.cargarDashboard(false);

            }

        );

        EventBus.escuchar(

            "pedido-estado",

            async () => {

                await this.cargarDashboard(false);

            }

        );

    }

    async cargarDashboard(mostrarLoader = true) {

        if (mostrarLoader) {

            Loader.mostrar();

        }

        const respuesta =

            await DashboardService.obtenerResumen();

        if (mostrarLoader) {

            Loader.ocultar();

        }

        if (!respuesta.success) {

            Toast.error(respuesta.message);

            return;

        }

        DashboardView.mostrarResumen(

            respuesta.data

        );

        DashboardView.crearGrafico(

            respuesta.data.grafico

        );

        DashboardView.mostrarProductos(

            respuesta.data.productos

        );

        DashboardView.mostrarUltimosPedidos(

            respuesta.data.ultimosPedidos

        );

        if (

            this.ultimoTotalPedidos !== 0 &&

            respuesta.data.pedidos >

            this.ultimoTotalPedidos

        ) {

            Toast.info(

                "Nuevo pedido recibido."

            );

        }

        this.ultimoTotalPedidos =

            respuesta.data.pedidos;

    }

}

export default new DashboardController();