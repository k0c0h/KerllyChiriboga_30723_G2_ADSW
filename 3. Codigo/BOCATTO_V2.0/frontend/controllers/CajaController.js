import CajaService from "../services/cajaService.js";
import MesaService from "../services/mesaService.js";

import CajaView from "../views/CajaView.js";

import Loader from "../utils/Loader.js";
import Toast from "../utils/Toast.js";
import Alert from "../utils/Alert.js";
import EventBus from "../utils/EventBus.js";
import socket from "../utils/socket.js";

class CajaController {

    pedidos = [];

    async init() {

        this.registrarEventos();

        await this.listar();

        socket.on(

            "estadoPedido",

            () => {

                this.listar();

            }

        );

        EventBus.escuchar(

            "pedido-creado",

            async () => {

                await this.listar();

            }

        );

        EventBus.escuchar(

            "pedido-pagado",

            async () => {

                await this.listar();

            }

        );
    }

    registrarEventos() {

        document

            .getElementById("contenedorCaja")

            .addEventListener(

                "click",

                e => this.cobrar(e)

            );

    }

    async listar() {

        Loader.mostrar();

        const respuesta = await CajaService.listar();

        Loader.ocultar();

        if (!respuesta.success) {

            Toast.error(respuesta.message);

            return;

        }

        this.pedidos = respuesta.data.filter(

            pedido => pedido.estado === "ENTREGADO"

        );

        CajaView.render(this.pedidos);

    }

    async cobrar(e) {

        const boton = e.target.closest(".btnCobrar");

        if (!boton) return;

        const confirmar = await Alert.confirmar(

            "¿Confirmar el pago del pedido?"

        );

        if (!confirmar) return;

        Loader.mostrar();

        await CajaService.cobrar(

            boton.dataset.id

        );

        Loader.ocultar();

        Toast.success(

            "Pago registrado correctamente"

        );

        await this.listar();

    }

}

export default new CajaController();