import CocinaService from "../services/cocinaService.js";

import CocinaView from "../views/CocinaView.js";

import Loader from "../utils/Loader.js";

import Toast from "../utils/Toast.js";

import socket from "../utils/socket.js";
class CocinaController {

    pedidos = [];
    contextoAudio = null;
    _intervaloRefresco = null;

    async init() {
        if (this._intervaloRefresco) {
            clearInterval(this._intervaloRefresco);
        }

        this.registrarEventos();
        await this.listar();

        // Refrescar cada 15 segundos para quitar pedidos entregados antiguos de la pantalla
        this._intervaloRefresco = setInterval(() => {
            CocinaView.render(this.pedidos);
        }, 15000);

        socket.on(
            "pedidoNuevo",
            async () => {
                await this.reproducirNotificacion();
                Toast.success("Nuevo pedido");
                this.listar();
            }
        );

        socket.on(
            "estadoPedido",
            () => {
                this.listar();
            }
        );
    }

    async reproducirNotificacion() {

        const AudioContextClass = window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) return;

        if (!this.contextoAudio) {

            this.contextoAudio = new AudioContextClass();

        }

        if (this.contextoAudio.state === "suspended") {

            await this.contextoAudio.resume();

        }

        const oscilador = this.contextoAudio.createOscillator();
        const ganancia = this.contextoAudio.createGain();

        oscilador.type = "sine";
        oscilador.frequency.value = 880;
        ganancia.gain.value = 0.04;

        oscilador.connect(ganancia);
        ganancia.connect(this.contextoAudio.destination);

        oscilador.start();
        oscilador.stop(this.contextoAudio.currentTime + 0.18);

    }

    registrarEventos() {

        document

            .getElementById("contenedorPedidos")

            .addEventListener(

                "click",

                e => this.cambiarEstado(e)

            );

    }

    async listar() {

        Loader.mostrar();

        const respuesta =

            await CocinaService.listar();

        Loader.ocultar();

        if (!respuesta.success) {

            Toast.error(respuesta.message);

            return;

        }

        this.pedidos =

            respuesta.data.filter(

                pedido =>

                    pedido.estado !== "PAGADO"

            );

        CocinaView.render(this.pedidos);

    }

    async cambiarEstado(e) {

        const boton =

            e.target.closest(".btnEstado");

        if (!boton) return;

        const id =

            boton.dataset.id;

        let estado =

            boton.dataset.estado;

        switch (estado) {

            case "PENDIENTE":

                estado = "COCINA";

                break;

            case "COCINA":

                estado = "LISTO";

                break;

            case "LISTO":

                estado = "ENTREGADO";

                break;

        }

        Loader.mostrar();

        await CocinaService.actualizarEstado(

            id,

            estado

        );

        Loader.ocultar();

        Toast.success(

            "Estado actualizado"

        );

        await this.listar();

    }

}

export default new CocinaController();