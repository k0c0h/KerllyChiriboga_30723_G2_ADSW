import PedidoView from "../views/PedidoView.js";

import PedidoService from "../services/pedidoService.js";
import MenuService from "../services/menuService.js";
import MesaService from "../services/mesaService.js";

import Loader from "../utils/Loader.js";
import Toast from "../utils/Toast.js";
import EventBus from "../utils/EventBus.js";
import AppState from "../utils/AppState.js";
import Auth from "../utils/Auth.js";

import PedidoValidator from "../validators/PedidoValidator.js";

class PedidoController {

    productos = [];
    items = [];
    pedidoActual = null;
    _observacionIndex = null;
    _abortController = null;

    async init() {
        this.items = [];
        this.pedidoActual = null;

        // Limpiar event listeners previos al re-navegar
        if (this._abortController) {
            this._abortController.abort();
        }
        this._abortController = new AbortController();
        const signal = this._abortController.signal;

        this.registrarEventos(signal);
        await this.cargarProductos();
        await this.mostrarPantallaPrincipal();

        // Configurar vista inicial según rol
        const rol = Auth.rol();
        const seccionTel = document.getElementById("seccionTelefono");
        const seccionMesas = document.getElementById("seccionMesas");

        if (seccionTel) {
            seccionTel.style.display = (rol === "ADMIN" || rol === "OPERADOR") ? "block" : "none";
        }
        if (seccionMesas) {
            seccionMesas.style.display = (rol === "ADMIN" || rol === "MESERO") ? "block" : "none";
        }
    }

    async mostrarPantallaPrincipal() {
        // Mostrar pantalla principal (Mesas / Pedidos Activos)
        document.getElementById("pantallaPrincipalPedidos").style.display = "block";
        document.getElementById("pantallaCrearPedido").style.display = "none";

        Loader.mostrar();
        try {
            // Cargar pedidos y mesas en paralelo
            const [resPedidos, resMesas] = await Promise.all([
                PedidoService.listar(),
                MesaService.listar()
            ]);

            if (!resPedidos.success || !resMesas.success) {
                Toast.error("Error al sincronizar datos.");
                return;
            }

            // Filtrar pedidos activos (PENDIENTE, COCINA, LISTO, ENTREGADO)
            const pedidosActivos = resPedidos.data.filter(p => 
                p.estado === "PENDIENTE" || p.estado === "COCINA" || p.estado === "LISTO" || p.estado === "ENTREGADO"
            );

            // Mapear pedidos activos por mesa ID
            const activeOrdersMap = new Map();
            pedidosActivos.forEach(p => {
                if (p.mesa && p.estado !== "ENTREGADO") { // Mesas ocupadas hasta ser entregadas
                    activeOrdersMap.set(String(p.mesa._id || p.mesa), p);
                }
            });

            // Renderizar grids
            PedidoView.renderMesas(resMesas.data, activeOrdersMap);
            PedidoView.renderPedidosActivos(pedidosActivos);
        } catch (err) {
            Toast.error("Error al cargar la información principal.");
        } finally {
            Loader.ocultar();
        }
    }

    registrarEventos(signal) {
        // Buscador de productos
        document.getElementById("txtBuscarProductoPedido")
            .addEventListener("input", e => this.buscar(e.target.value), { signal });

        // Botones de agregar producto
        document.getElementById("productosPedido")
            .addEventListener("click", e => this.agregarProducto(e), { signal });

        // Botón de guardar pedido
        document.getElementById("btnGuardarPedido")
            .addEventListener("click", () => this.guardar(), { signal });

        // Detalle del pedido (carro)
        document.getElementById("detallePedido")
            .addEventListener("click", e => this.eventosDetalle(e), { signal });

        // Botón de volver a pantalla principal
        document.getElementById("btnVolverPedidos")
            .addEventListener("click", () => this.mostrarPantallaPrincipal(), { signal });

        // Botón iniciar pedido telefónico
        const btnTel = document.getElementById("btnIniciarPedidoTelefono");
        if (btnTel) {
            btnTel.addEventListener("click", () => this.iniciarPedidoTelefono(), { signal });
        }

        // Delegar clics en tarjetas de mesa (Acción crear/ver)
        const gridMesas = document.getElementById("gridMesasPedidos");
        if (gridMesas) {
            gridMesas.addEventListener("click", e => {
                const btn = e.target.closest(".btnAccionMesa");
                if (!btn) return;
                this.seleccionarMesa(
                    btn.dataset.mesaId, 
                    btn.dataset.mesaNumero, 
                    btn.dataset.tienePedido === "true",
                    btn.dataset.pedidoId
                );
            }, { signal });
        }

        // Delegar clics en tabla de pedidos activos (Ver Detalle)
        const tablaActivos = document.getElementById("tablaPedidosActivos");
        if (tablaActivos) {
            tablaActivos.addEventListener("click", e => {
                const btn = e.target.closest(".btnVerDetallePedido");
                if (!btn) return;
                this.cargarYVerPedido(btn.dataset.pedidoId);
            }, { signal });
        }

        // Modal observaciones
        const txtObs = document.getElementById("txtObservacion");
        if (txtObs) {
            txtObs.addEventListener("input", () => {
                const contador = document.getElementById("contadorObservacion");
                if (contador) contador.textContent = `${txtObs.value.length} / 200`;
            }, { signal });
        }

        const btnGuardarObs = document.getElementById("btnGuardarObservacion");
        if (btnGuardarObs) {
            btnGuardarObs.addEventListener("click", () => {
                this._guardarObservacion();
            }, { signal });
        }
    }

    async cargarProductos() {
        Loader.mostrar();
        try {
            const respuesta = await MenuService.listar();
            if (!respuesta.success) {
                Toast.error(respuesta.message);
                return;
            }
            this.productos = respuesta.data.filter(p => p.disponible);
        } catch (err) {
            Toast.error("Error al cargar productos.");
        } finally {
            Loader.ocultar();
        }
    }

    buscar(texto) {
        texto = texto.toLowerCase();
        const resultado = this.productos.filter(producto =>
            producto.nombre.toLowerCase().includes(texto) ||
            producto.categoria.toLowerCase().includes(texto)
        );
        PedidoView.renderProductos(resultado, !!this.pedidoActual);
    }

    // Inicia pantalla de creación para una Mesa
    seleccionarMesa(mesaId, mesaNumero, tienePedido, pedidoId) {
        this.items = [];
        this.pedidoActual = null;
        
        // Reset campos cliente/teléfono
        document.getElementById("clienteNombre").value = "";
        document.getElementById("telefonoEntrega").value = "";
        document.getElementById("direccionEntrega").value = "";
        document.getElementById("observacionesGenerales").value = "";

        // Fijar Canal
        const selectCanal = document.getElementById("canalPedido");
        selectCanal.value = "MESA";
        PedidoView.mostrarCamposCanal("MESA");

        AppState.guardarMesa({ id: mesaId, numero: Number(mesaNumero) });

        if (tienePedido) {
            this.cargarYVerPedido(pedidoId);
        } else {
            // Nuevo Pedido para la mesa
            document.getElementById("tituloPaginaPedido").textContent = `Crear Pedido — Mesa ${mesaNumero}`;
            this.configurarEdicionHabilitada(true);
            this.actualizarVista();
            this.mostrarPantallaEdicion();
        }
    }

    // Inicia pantalla de creación para Pedido Telefónico
    iniciarPedidoTelefono() {
        this.items = [];
        this.pedidoActual = null;
        AppState.limpiarMesa();

        // Limpiar campos cliente
        document.getElementById("clienteNombre").value = "";
        document.getElementById("telefonoEntrega").value = "";
        document.getElementById("direccionEntrega").value = "";
        document.getElementById("observacionesGenerales").value = "";

        const selectCanal = document.getElementById("canalPedido");
        selectCanal.value = "TELEFONO";
        PedidoView.mostrarCamposCanal("TELEFONO");

        document.getElementById("tituloPaginaPedido").textContent = "Nuevo Pedido Telefónico";
        this.configurarEdicionHabilitada(true);
        this.actualizarVista();
        this.mostrarPantallaEdicion();
    }

    // Carga un pedido existente de la base de datos (Lectura únicamente)
    async cargarYVerPedido(pedidoId) {
        Loader.mostrar();
        try {
            const res = await PedidoService.listar();
            const pedido = res.data.find(p => p._id === pedidoId);

            if (!pedido) {
                Toast.error("No se pudo cargar el detalle del pedido.");
                return;
            }

            this.pedidoActual = pedido;
            this.items = pedido.items.map(item => ({
                producto: item.producto?._id || item.producto,
                nombre: item.nombre,
                cantidad: item.cantidad,
                precio: item.precio,
                subtotal: item.subtotal,
                observacion: item.observacion || ""
            }));

            // Cargar datos en los inputs del formulario
            document.getElementById("canalPedido").value = pedido.canal;
            PedidoView.mostrarCamposCanal(pedido.canal);

            document.getElementById("clienteNombre").value = pedido.clienteNombre || "";
            document.getElementById("telefonoEntrega").value = pedido.telefonoEntrega || "";
            document.getElementById("direccionEntrega").value = pedido.direccionEntrega || "";
            document.getElementById("observacionesGenerales").value = pedido.observaciones || "";

            const nombreDisplay = pedido.canal === "TELEFONO" ? "Telefónico" : (pedido.mesa?.numero || "-");
            document.getElementById("tituloPaginaPedido").textContent = `Detalle Pedido — ${pedido.canal} #${pedido._id.slice(-6).toUpperCase()}`;

            this.configurarEdicionHabilitada(false); // Inhabilitar edición/guardado
            this.actualizarVista();
            this.mostrarPantallaEdicion();
        } catch (err) {
            Toast.error("Error al abrir el pedido.");
        } finally {
            Loader.ocultar();
        }
    }

    configurarEdicionHabilitada(habilitar) {
        const deshabilitado = !habilitar;

        // Deshabilitar campos de cliente
        document.getElementById("clienteNombre").readOnly = deshabilitado;
        document.getElementById("telefonoEntrega").readOnly = deshabilitado;
        document.getElementById("direccionEntrega").readOnly = deshabilitado;
        document.getElementById("observacionesGenerales").readOnly = deshabilitado;

        // Deshabilitar botón de guardar
        const btnGuardar = document.getElementById("btnGuardarPedido");
        if (btnGuardar) {
            btnGuardar.disabled = deshabilitado;
            btnGuardar.innerHTML = deshabilitado 
                ? '<i class="bi bi-lock-fill me-1"></i>Pedido Guardado (Lectura)' 
                : '<i class="bi bi-check-circle me-1"></i>Guardar Pedido';
        }

        // Ajustar color de la cabecera
        const header = document.getElementById("headerDetallePedido");
        if (header) {
            header.style.background = deshabilitado ? "#6c757d" : "var(--naranja-500)";
        }
    }

    mostrarPantallaEdicion() {
        document.getElementById("pantallaPrincipalPedidos").style.display = "none";
        document.getElementById("pantallaCrearPedido").style.display = "block";
    }

    agregarProducto(e) {
        if (this.pedidoActual) {
            Toast.warning("No se puede modificar un pedido ya guardado.");
            return;
        }

        const boton = e.target.closest(".btnAgregar");
        if (!boton) return;

        const id = boton.dataset.id;
        const producto = this.productos.find(p => p._id === id);
        const existente = this.items.find(i => i.producto === id);

        if (existente) {
            existente.cantidad++;
            existente.subtotal = existente.cantidad * existente.precio;
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
        const deshabilitado = !!this.pedidoActual;
        PedidoView.renderProductos(this.productos, deshabilitado);
        PedidoView.renderDetalle(this.items, deshabilitado);
        PedidoView.actualizarTotal(this.calcularTotal());

        // Mostrar mesa
        const canal = document.getElementById("canalPedido").value;
        if (canal === "TELEFONO") {
            PedidoView.mostrarMesa("Telefónico");
        } else {
            const mesa = AppState.obtenerMesa();
            PedidoView.mostrarMesa(mesa?.numero || "-");
        }
    }

    calcularTotal() {
        return this.items.reduce((total, item) => total + item.subtotal, 0);
    }

    async guardar() {
        if (this.pedidoActual) {
            Toast.warning("Este pedido ya está guardado.");
            return;
        }

        const canal = document.getElementById("canalPedido").value;
        const clienteNombre = document.getElementById("clienteNombre").value.trim();
        const telefonoEntrega = document.getElementById("telefonoEntrega").value.trim();
        const direccionEntrega = document.getElementById("direccionEntrega").value.trim();
        const observaciones = document.getElementById("observacionesGenerales").value.trim();

        const validar = PedidoValidator.validar(this.items, canal, telefonoEntrega);

        if (!validar.ok) {
            Toast.warning(validar.mensaje);
            return;
        }

        const mesa = AppState.obtenerMesa();
        const mesaId = mesa?.id || mesa;

        if (canal !== "TELEFONO" && !mesaId) {
            Toast.warning("Seleccione una mesa.");
            return;
        }

        const pedido = {
            canal,
            mesa: canal === "TELEFONO" ? null : mesaId,
            items: this.items,
            clienteNombre,
            telefonoEntrega,
            direccionEntrega,
            observaciones,
            total: this.calcularTotal(),
            estado: "PENDIENTE"
        };

        Loader.mostrar();
        try {
            const respuesta = await PedidoService.crear(pedido);

            if (!respuesta.success) {
                Toast.error(respuesta.message || "Error al registrar el pedido.");
                return;
            }

            if (canal !== "TELEFONO") {
                await MesaService.cambiarEstado(mesaId, "OCUPADA");
            }

            Toast.success("Pedido registrado correctamente.");
            EventBus.emitir("pedido-creado");

            this.items = [];
            this.pedidoActual = null;
            AppState.limpiarMesa();

            await this.mostrarPantallaPrincipal();
        } catch (err) {
            Toast.error("Error de conexión al guardar el pedido.");
        } finally {
            Loader.ocultar();
        }
    }

    _abrirModalObservacion(index) {
        if (this.pedidoActual) return;
        this._observacionIndex = index;
        const item = this.items[index];
        if (!item) return;

        const txtObs = document.getElementById("txtObservacion");
        const contador = document.getElementById("contadorObservacion");
        const modalEl = document.getElementById("modalObservacion");

        if (txtObs) {
            txtObs.value = item.observacion || "";
            if (contador) contador.textContent = `${txtObs.value.length} / 200`;
        }

        if (modalEl) {
            bootstrap.Modal.getOrCreateInstance(modalEl).show();
        }
    }

    _guardarObservacion() {
        const index = this._observacionIndex;
        const txtObs = document.getElementById("txtObservacion");
        const modalEl = document.getElementById("modalObservacion");

        if (index !== null && this.items[index] && txtObs) {
            this.items[index].observacion = txtObs.value.trim();
            this.actualizarVista();
        }

        if (modalEl) {
            bootstrap.Modal.getInstance(modalEl)?.hide();
        }

        this._observacionIndex = null;
    }

    eventosDetalle(e) {
        if (this.pedidoActual) {
            return;
        }

        const boton = e.target.closest("button");
        if (!boton) return;

        const index = Number(boton.dataset.index);
        if (Number.isNaN(index) || !this.items[index]) return;

        if (boton.classList.contains("btnMas")) {
            this.items[index].cantidad++;
            this.items[index].subtotal = this.items[index].cantidad * this.items[index].precio;
        }

        if (boton.classList.contains("btnMenos")) {
            this.items[index].cantidad--;
            if (this.items[index].cantidad <= 0) {
                this.items.splice(index, 1);
            } else {
                this.items[index].subtotal = this.items[index].cantidad * this.items[index].precio;
            }
        }

        if (boton.classList.contains("btnEliminarItem")) {
            this.items.splice(index, 1);
        }

        if (boton.classList.contains("btnObservacion")) {
            this._abrirModalObservacion(index);
            return;
        }

        this.actualizarVista();
    }
}

export default new PedidoController();