import CajaService from "../services/cajaService.js";
import CajaView from "../views/CajaView.js";
import Loader from "../utils/Loader.js";
import Toast from "../utils/Toast.js";
import Alert from "../utils/Alert.js";
import EventBus from "../utils/EventBus.js";
import socket from "../utils/socket.js";

class CajaController {

    pedidos = [];
    _abortController = null;

    async init() {
        if (this._abortController) {
            this._abortController.abort();
        }
        this._abortController = new AbortController();
        const signal = this._abortController.signal;

        this.registrarEventos(signal);
        await this.listar();

        socket.on("estadoPedido", () => {
            this.listar();
        });

        EventBus.escuchar("pedido-creado", async () => {
            await this.listar();
        });

        EventBus.escuchar("pedido-pagado", async () => {
            await this.listar();
        });
    }

    registrarEventos(signal) {
        // Contenedor principal de tarjetas para cobrar y entregar
        document.getElementById("contenedorCaja")
            .addEventListener("click", e => {
                if (e.target.closest(".btnCobrar")) {
                    this.cobrar(e);
                } else if (e.target.closest(".btnEntregar")) {
                    this.entregar(e);
                }
            }, { signal });

        // Buscador de mesas / canales
        const buscador = document.getElementById("txtBuscarMesaCaja");
        if (buscador) {
            buscador.addEventListener("input", e => this.buscar(e.target.value), { signal });
        }
    }

    async listar() {
        Loader.mostrar();
        try {
            const respuesta = await CajaService.listar();
            if (!respuesta.success) {
                Toast.error(respuesta.message);
                return;
            }

            // Habilitados para cobro (LISTO) y habilitados para entrega (PAGADO)
            this.pedidos = respuesta.data.filter(
                p => p.estado === "LISTO" || p.estado === "PAGADO"
            );

            // Reestablecer buscador si tiene valor
            const buscador = document.getElementById("txtBuscarMesaCaja");
            if (buscador && buscador.value.trim() !== "") {
                this.buscar(buscador.value);
            } else {
                CajaView.render(this.pedidos);
            }
        } catch (err) {
            Toast.error("Error al obtener los pedidos de la caja.");
        } finally {
            Loader.ocultar();
        }
    }

    buscar(texto) {
        texto = texto.trim().toLowerCase();
        if (texto === "") {
            CajaView.render(this.pedidos);
            return;
        }

        const resultado = this.pedidos.filter(pedido => {
            const numMesa = pedido.mesa ? String(pedido.mesa.numero).toLowerCase() : "";
            const canal = pedido.canal ? pedido.canal.toLowerCase() : "";
            const cliente = pedido.clienteNombre ? pedido.clienteNombre.toLowerCase() : "";
            return numMesa.includes(texto) || canal.includes(texto) || cliente.includes(texto);
        });

        CajaView.render(resultado);
    }

    async cobrar(e) {
        const boton = e.target.closest(".btnCobrar");
        if (!boton) return;

        const confirmar = await Alert.confirmar("¿Confirmar el cobro y registro del pago?");
        if (!confirmar) return;

        const tarjeta = boton.closest(".card");
        const metodoPago = tarjeta?.querySelector(".metodoPagoPedido")?.value || "EFECTIVO";

        Loader.mostrar();
        try {
            const respuesta = await CajaService.cobrar(boton.dataset.id, metodoPago);
            if (!respuesta.success) {
                Toast.error(respuesta.message || "Error al realizar el cobro.");
                return;
            }

            Toast.success("Cobro registrado. El pedido ya se puede entregar.");
            EventBus.emitir("pedido-pagado");
            await this.listar();
        } catch (err) {
            Toast.error("Error de conexión al cobrar.");
        } finally {
            Loader.ocultar();
        }
    }

    async entregar(e) {
        const boton = e.target.closest(".btnEntregar");
        if (!boton) return;

        const confirmar = await Alert.confirmar("¿Confirmar la entrega del pedido al cliente?");
        if (!confirmar) return;

        Loader.mostrar();
        try {
            const respuesta = await CajaService.entregar(boton.dataset.id);
            if (!respuesta.success) {
                Toast.error(respuesta.message || "Error al registrar la entrega.");
                return;
            }

            Toast.success("Pedido entregado correctamente.");
            await this.listar();
        } catch (err) {
            Toast.error("Error de conexión al registrar la entrega.");
        } finally {
            Loader.ocultar();
        }
    }

}

export default new CajaController();