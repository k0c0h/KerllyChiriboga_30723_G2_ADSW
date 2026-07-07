import PedidoView from "../views/PedidoView.js";

import PedidoService from "../services/pedidoService.js";
import MenuService from "../services/menuService.js";
import MesaService from "../services/mesaService.js";

import Loader from "../utils/Loader.js";
import Toast from "../utils/Toast.js";
import EventBus from "../utils/EventBus.js";
import AppState from "../utils/AppState.js";

import PedidoValidator from "../validators/PedidoValidator.js";

class PedidoController {

    productos = [];

    items = [];

    pedidoActual = null;

    async init() {

        this.items = [];

        this.registrarEventos();

        await this.cargarProductos();

        this.onCanalChange();

    }

    registrarEventos() {

        document

            .getElementById("txtBuscarProductoPedido")

            .addEventListener(

                "input",

                e => this.buscar(e.target.value)

            );

        document

            .getElementById("canalPedido")

            .addEventListener(

                "change",

                () => this.onCanalChange()

            );

        document

            .getElementById("productosPedido")

            .addEventListener(

                "click",

                e => this.agregarProducto(e)

            );

        document

            .getElementById("btnGuardarPedido")

            .addEventListener(

                "click",

                () => this.guardar()

            );

        document

            .getElementById("detallePedido")

            .addEventListener(

                "click",

                e => this.eventosDetalle(e)

            );

    }

    onCanalChange() {

        const canal = document.getElementById("canalPedido").value;

        PedidoView.mostrarCamposCanal(canal);

    }

    async cargarProductos() {

        Loader.mostrar();

        const respuesta = await MenuService.listar();

        Loader.ocultar();

        if (!respuesta.success) {

            Toast.error(respuesta.message);

            return;

        }

        this.productos = respuesta.data.filter(

            p => p.disponible

        );

        PedidoView.renderProductos(this.productos);

    }

    buscar(texto) {

        texto = texto.toLowerCase();

        const resultado = this.productos.filter(producto =>

            producto.nombre.toLowerCase().includes(texto) ||

            producto.categoria.toLowerCase().includes(texto)

        );

        PedidoView.renderProductos(resultado);

    }

    agregarProducto(e) {

        const boton = e.target.closest(".btnAgregar");

        if (!boton) return;

        const id = boton.dataset.id;

        const producto = this.productos.find(

            p => p._id === id

        );

        const existente = this.items.find(

            i => i.producto === id

        );

        if (existente) {

            existente.cantidad++;

            existente.subtotal =

                existente.cantidad *

                existente.precio;

        } else {

            this.items.push({

                producto: producto._id,

                nombre: producto.nombre,

                cantidad: 1,

                precio: producto.precio,

                subtotal: producto.precio,

                observacion: ""

            });

        }

        this.actualizarVista();

    }

    actualizarVista() {

        PedidoView.renderDetalle(this.items);

        PedidoView.actualizarTotal(

            this.calcularTotal()

        );

    }

    calcularTotal() {

        return this.items.reduce(

            (total, item) =>

                total + item.subtotal,

            0

        );

    }

    async guardar() {

        const canal = document.getElementById("canalPedido").value;
        const telefonoEntrega = document.getElementById("telefonoEntrega").value.trim();
        const direccionEntrega = document.getElementById("direccionEntrega").value.trim();

        const validar =

            PedidoValidator.validar(

                this.items,

                canal,

                telefonoEntrega

            );

        if (!validar.ok) {

            Toast.warning(

                validar.mensaje

            );

            return;

        }

        const mesa =

            AppState.obtenerMesa();

        if (canal !== "TELEFONO" && !mesa) {

            Toast.warning(

                "Seleccione una mesa."

            );

            return;

        }

        const pedido = {

            canal,

            mesa: canal === "TELEFONO" ? null : mesa,

            items: this.items,

            telefonoEntrega,

            direccionEntrega,

            total: this.calcularTotal(),

            estado: "PENDIENTE"

        };

        Loader.mostrar();

        const respuesta =

            await PedidoService.crear(

                pedido

            );

        Loader.ocultar();

        if (!respuesta.success) {

            Toast.error(

                respuesta.message

            );

            return;

        }

        if (canal !== "TELEFONO") {

            await MesaService.cambiarEstado(

                mesa,

                "OCUPADA"

            );

        }

        Toast.success(

            "Pedido registrado correctamente."

        );

        EventBus.emitir(

            "pedido-creado"

        );

        this.items = [];

        this.pedidoActual = null;

        AppState.limpiarMesa();

        this.actualizarVista();

        document.getElementById("telefonoEntrega").value = "";
        document.getElementById("direccionEntrega").value = "";

    }

    async abrirMesa(idMesa) {

        Loader.mostrar();

        const respuesta =

            await PedidoService.buscarPorMesa(

                idMesa

            );

        Loader.ocultar();

        if (

            respuesta.success &&

            respuesta.data

        ) {

            this.pedidoActual =

                respuesta.data;

            this.items =

                respuesta.data.items;

            if (respuesta.data.canal) {
                document.getElementById("canalPedido").value = respuesta.data.canal;
            }

            document.getElementById("telefonoEntrega").value = respuesta.data.telefonoEntrega || "";
            document.getElementById("direccionEntrega").value = respuesta.data.direccionEntrega || "";

            this.onCanalChange();

            PedidoView.cargarPedido(

                respuesta.data

            );

            this.actualizarVista();

        }

        else {

            this.pedidoActual = null;

            this.items = [];

            PedidoView.nuevoPedido(

                idMesa

            );

            document.getElementById("canalPedido").value = "MESA";
            this.onCanalChange();

            this.actualizarVista();

        }

    }

    limpiar() {

        this.items = [];

        this.pedidoActual = null;

        AppState.limpiarMesa();

        this.actualizarVista();

        document.getElementById("telefonoEntrega").value = "";
        document.getElementById("direccionEntrega").value = "";

    }

    eventosDetalle(e) {

        const boton = e.target.closest("button");

        if (!boton) return;

        const index = Number(boton.dataset.index);

        if (Number.isNaN(index) || !this.items[index]) return;

        if (boton.classList.contains("btnMas")) {

            this.items[index].cantidad++;

            this.items[index].subtotal =
                this.items[index].cantidad * this.items[index].precio;

        }

        if (boton.classList.contains("btnMenos")) {

            this.items[index].cantidad--;

            if (this.items[index].cantidad <= 0) {
                this.items.splice(index, 1);
            } else {
                this.items[index].subtotal =
                    this.items[index].cantidad * this.items[index].precio;
            }

        }

        if (boton.classList.contains("btnEliminarItem")) {

            this.items.splice(index, 1);

        }

        if (boton.classList.contains("btnObservacion")) {

            const texto = prompt(
                "Observación",
                this.items[index]?.observacion || ""
            );

            if (texto !== null && this.items[index]) {
                this.items[index].observacion = texto;
            }

        }

        this.actualizarVista();

    }
}

export default new PedidoController();