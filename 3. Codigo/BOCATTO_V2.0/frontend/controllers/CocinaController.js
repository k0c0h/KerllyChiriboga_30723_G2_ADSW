import CocinaService from "../services/cocinaService.js";

import CocinaView from "../views/CocinaView.js";

import Loader from "../utils/Loader.js";

import Toast from "../utils/Toast.js";

import socket from "../utils/socket.js";
class CocinaController {

    pedidos = [];

    async init() {

        this.registrarEventos();

        await this.listar();

        const audio = new Audio(

            "assets/audio/notificacion.mp3"

        );

        socket.on(

            "pedidoNuevo",

            () => {

                audio.play();

                Toast.success(

                    "Nuevo pedido"

                );

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