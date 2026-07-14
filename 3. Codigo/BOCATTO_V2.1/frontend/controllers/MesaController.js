import MesaService from "../services/mesaService.js";
import MesaView from "../views/MesaView.js";
import MesaValidator from "../validators/MesaValidator.js";

import Loader from "../utils/Loader.js";
import Toast from "../utils/Toast.js";
import Alert from "../utils/Alert.js";
import AppState from "../utils/AppState.js";
import Router from "../utils/router.js";
import EventBus from "../utils/EventBus.js";

class MesaController {

    mesas = [];

    async init() {

        this.registrarEventos();

        await this.listar();

        EventBus.escuchar(

            "pedido-creado",

            async () => {

                await this.listar();

            }

        );

        EventBus.escuchar(

            "pedido-eliminado",

            async () => {

                await this.listar();

            }

        );

    }

    registrarEventos() {

        document

            .getElementById("btnNuevaMesa")

            .addEventListener("click", () => {

                MesaView.limpiarFormulario();

                MesaView.abrirModal();

            });

        document

            .getElementById("btnGuardarMesa")

            .addEventListener("click", () => {

                this.guardar();

            });

        document

            .getElementById("contenedorMesas")

            .addEventListener("click", e => {

                this.eventosCards(e);

            });

    }

    async listar() {

        Loader.mostrar();

        const respuesta = await MesaService.listar();

        Loader.ocultar();

        if (!respuesta.success) {

            Toast.error(respuesta.message);

            return;

        }

        this.mesas = respuesta.data;

        MesaView.renderCards(this.mesas);

    }

    async guardar() {

        const mesa = MesaView.obtenerFormulario();

        const validar = MesaValidator.validar(mesa);

        if (!validar.ok) {

            Toast.warning(validar.mensaje);

            return;

        }

        Loader.mostrar();

        let respuesta;

        if (mesa.id === "") {

            respuesta = await MesaService.crear(mesa);

        } else {

            respuesta = await MesaService.actualizar(

                mesa.id,

                mesa

            );

        }

        Loader.ocultar();

        if (!respuesta.success) {

            Toast.error(respuesta.message);

            return;

        }

        MesaView.cerrarModal();

        Toast.success("Mesa guardada correctamente");

        await this.listar();

    }

    async eventosCards(e) {

        const boton = e.target.closest("button");

        if (!boton) return;

        const id = boton.dataset.id;

        if (boton.classList.contains("btnEditar")) {

            Loader.mostrar();

            const respuesta = await MesaService.obtener(id);

            Loader.ocultar();

            MesaView.llenarFormulario(respuesta.data);

            MesaView.abrirModal();

        }

        if (boton.classList.contains("btnEliminar")) {

            const ok = await Alert.confirmar(

                "¿Desea eliminar la mesa?"

            );

            if (!ok) return;

            Loader.mostrar();

            await MesaService.eliminar(id);

            Loader.ocultar();

            Toast.success("Mesa eliminada");

            await this.listar();

        }

        if (boton.classList.contains("btnPedido")) {

            AppState.guardarMesa({
                id,
                numero: Number(boton.dataset.numero)
            });

            await Router.navegar(

                "pedidos"

            );

            // Se conectará con el router en la Entrega 17
        }

        if (boton.classList.contains("btnQR")) {

            const basePath = window.location.pathname.replace(/index\.html$/i, "");
            const urlQR = `${window.location.origin}${basePath}qr.html?mesa=${id}`;
            const imagenQR = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(urlQR)}`;

            window.open(imagenQR, "_blank");

            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(urlQR);
                Toast.success("QR generado y enlace copiado al portapapeles.");
            }

        }

    }

}

export default new MesaController();