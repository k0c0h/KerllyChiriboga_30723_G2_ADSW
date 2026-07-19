const API_PUBLIC = "http://localhost:3000/api/v1/public";

// DOM refs
const mesaInfo = document.getElementById("mesaInfo");
const menuGrid = document.getElementById("menuGrid");
const carritoItems = document.getElementById("carritoItems");
const carritoVacio = document.getElementById("carritoVacio");
const totalPedido = document.getElementById("totalPedido");
const btnEnviarPedido = document.getElementById("btnEnviarPedido");
const clienteNombre = document.getElementById("clienteNombre");
const codigoSeguimiento = document.getElementById("codigoSeguimiento");
const btnSeguir = document.getElementById("btnSeguir");
const seguimientoPanel = document.getElementById("seguimientoPanel");
const seguimientoVacio = document.getElementById("seguimientoVacio");
const estadoBadge = document.getElementById("estadoBadge");
const seguimientoDetalle = document.getElementById("seguimientoDetalle");

// Modal refs
const modalConfirmacion = new bootstrap.Modal(document.getElementById("modalPedidoConfirmado"));
const modalCodigoDisplay = document.getElementById("modalCodigoDisplay");
const btnCopiarCodigo = document.getElementById("btnCopiarCodigo");
const mensajeCopiar = document.getElementById("mensajeCopiar");
const modalError = new bootstrap.Modal(document.getElementById("modalError"));
const modalErrorMsg = document.getElementById("modalErrorMsg");

const url = new URL(window.location.href);
const mesaId = url.searchParams.get("mesa");

let menu = [];
let items = [];
let pollingId = null;
let ultimoEstado = null; // Para detectar cambios de estado

// ============================================================
// Utilidades
// ============================================================

function moneda(valor) {
    return `$${Number(valor || 0).toFixed(2)}`;
}

/** Reemplaza window.alert con un modal estético */
function mostrarError(msg) {
    modalErrorMsg.textContent = msg;
    modalError.show();
}

/** Toastify estético para notificaciones de estado */
function toastEstado(mensaje, tipo = "info") {
    const colores = {
        success: "linear-gradient(135deg, #1a8c3e, #15702e)",
        warning: "linear-gradient(135deg, #d97706, #b45309)",
        info:    "linear-gradient(135deg, #1a73e8, #0d47a1)",
        danger:  "linear-gradient(135deg, #dc2626, #991b1b)"
    };

    Toastify({
        text: mensaje,
        duration: 5000,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: colores[tipo] || colores.info,
            borderRadius: "10px",
            fontFamily: "Outfit, sans-serif",
            fontSize: "0.9rem",
            padding: "12px 20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)"
        }
    }).showToast();
}

function setEstadoBadge(estado) {
    estadoBadge.className = "badge";

    const clases = {
        PENDIENTE: "text-bg-secondary",
        COCINA:    "text-bg-warning",
        LISTO:     "text-bg-info",
        ENTREGADO: "text-bg-success",
        PAGADO:    "text-bg-dark"
    };

    estadoBadge.classList.add(clases[estado] || "text-bg-dark");
    estadoBadge.textContent = estado;
}

function totalItems() {
    return items.reduce((acc, item) => acc + item.cantidad * item.precio, 0);
}

// ============================================================
// Carrito
// ============================================================

function renderCarrito() {
    carritoItems.innerHTML = "";

    if (items.length === 0) {
        carritoVacio.classList.remove("d-none");
        totalPedido.textContent = moneda(0);
        return;
    }

    carritoVacio.classList.add("d-none");

    items.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "item-row";
        row.innerHTML = `
            <div class="d-flex justify-content-between align-items-start gap-2">
                <div>
                    <div class="item-name">${item.nombre}</div>
                    <small class="text-muted">${moneda(item.precio)} c/u</small>
                </div>
                <strong>${moneda(item.cantidad * item.precio)}</strong>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-2 gap-2">
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-secondary" data-action="menos" data-index="${index}">-</button>
                    <button class="btn btn-light" disabled>${item.cantidad}</button>
                    <button class="btn btn-outline-secondary" data-action="mas" data-index="${index}">+</button>
                </div>
                <button class="btn btn-outline-danger btn-sm" data-action="quitar" data-index="${index}">Quitar</button>
            </div>
        `;
        carritoItems.appendChild(row);
    });

    totalPedido.textContent = moneda(totalItems());
}

function renderMenu() {
    menuGrid.innerHTML = "";

    menu.forEach(producto => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-6";
        col.innerHTML = `
            <article class="producto-card p-3 h-100">
                <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <h3 class="h6 mb-0">${producto.nombre}</h3>
                    <strong>${moneda(producto.precio)}</strong>
                </div>
                <p class="small text-muted mb-3">${producto.descripcion || "Producto del día"}</p>
                <button class="btn btn-sm btn-main w-100" data-producto="${producto._id}">
                    Agregar
                </button>
            </article>
        `;
        menuGrid.appendChild(col);
    });
}

function agregarProducto(productoId) {
    const producto = menu.find(p => p._id === productoId);
    if (!producto) return;

    const existente = items.find(i => i.producto === productoId);

    if (existente) {
        existente.cantidad += 1;
    } else {
        items.push({
            producto: producto._id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1,
            observacion: ""
        });
    }

    renderCarrito();
}

function cambiarCantidad(index, delta) {
    if (!items[index]) return;

    items[index].cantidad += delta;

    if (items[index].cantidad <= 0) {
        items.splice(index, 1);
    }

    renderCarrito();
}

// ============================================================
// API
// ============================================================

async function cargarMenuMesa() {
    if (!mesaId) {
        mesaInfo.textContent = "QR inválido. Falta la mesa.";
        btnEnviarPedido.disabled = true;
        return;
    }

    const response = await fetch(`${API_PUBLIC}/mesas/${mesaId}/menu`);
    const json = await response.json();

    if (!json.success) {
        mesaInfo.textContent = "No se pudo validar la mesa.";
        btnEnviarPedido.disabled = true;
        mostrarError(json.message || "No fue posible cargar el menú.");
        return;
    }

    mesaInfo.textContent = `Mesa ${json.data.mesa.numero}`;
    menu = json.data.menu;
    renderMenu();
}

async function enviarPedido() {
    if (!mesaId) return;

    if (clienteNombre.value.trim() === "") {
        mostrarError("Ingresa tu nombre para enviar el pedido.");
        return;
    }

    if (items.length === 0) {
        mostrarError("Debes agregar al menos un producto.");
        return;
    }

    const payload = {
        clienteNombre: clienteNombre.value.trim(),
        items: items.map(item => ({
            producto: item.producto,
            cantidad: item.cantidad,
            observacion: item.observacion || ""
        }))
    };

    btnEnviarPedido.disabled = true;

    const response = await fetch(`${API_PUBLIC}/mesas/${mesaId}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const json = await response.json();

    btnEnviarPedido.disabled = false;

    if (!json.success) {
        mostrarError(json.message || "No se pudo registrar el pedido.");
        return;
    }

    const codigo = json.data.codigoSeguimiento;
    codigoSeguimiento.value = codigo;
    localStorage.setItem("bocatto_qr_codigo", codigo);

    // Mostrar modal estético con el código
    modalCodigoDisplay.textContent = codigo;
    mensajeCopiar.classList.add("d-none");
    modalConfirmacion.show();

    items = [];
    renderCarrito();

    await consultarSeguimiento();
}

async function consultarSeguimiento() {
    const codigo = codigoSeguimiento.value.trim();

    if (codigo === "") {
        mostrarError("Ingresa un código de seguimiento.");
        return;
    }

    const response = await fetch(`${API_PUBLIC}/pedidos/seguimiento/${codigo}`);
    const json = await response.json();

    if (!json.success) {
        seguimientoPanel.classList.add("d-none");
        seguimientoVacio.classList.remove("d-none");
        seguimientoVacio.textContent = "No se encontró el pedido para ese código.";
        return;
    }

    const pedido = json.data;

    // Detectar cambio de estado para notificar con Toastify
    if (ultimoEstado !== null && ultimoEstado !== pedido.estado) {
        const mensajesEstado = {
            COCINA:    "🍳 ¡Tu pedido ya está en cocina!",
            LISTO:     "✅ ¡Tu pedido está listo! Pronto lo recibirás.",
            ENTREGADO: "🎉 ¡Tu pedido fue entregado! Buen provecho.",
            PAGADO:    "💳 Pedido pagado. ¡Gracias por tu visita!"
        };

        const tiposEstado = {
            COCINA:    "warning",
            LISTO:     "success",
            ENTREGADO: "success",
            PAGADO:    "info"
        };

        const msg = mensajesEstado[pedido.estado];
        if (msg) {
            toastEstado(msg, tiposEstado[pedido.estado] || "info");
        }
    }

    ultimoEstado = pedido.estado;

    seguimientoVacio.classList.add("d-none");
    seguimientoPanel.classList.remove("d-none");
    setEstadoBadge(pedido.estado);

    const fecha = new Date(pedido.updatedAt).toLocaleTimeString();
    seguimientoDetalle.textContent = `Cliente: ${pedido.clienteNombre || "-"} | Mesa: ${pedido.mesa?.numero || "-"} | Última actualización: ${fecha}`;
}

function iniciarPolling() {
    if (pollingId) clearInterval(pollingId);

    pollingId = setInterval(() => {
        if (codigoSeguimiento.value.trim() !== "") {
            consultarSeguimiento();
        }
    }, 5000);
}

// ============================================================
// Copiar código al portapapeles
// ============================================================

btnCopiarCodigo.addEventListener("click", async () => {
    const codigo = modalCodigoDisplay.textContent.trim();
    if (!codigo) return;

    try {
        await navigator.clipboard.writeText(codigo);
        mensajeCopiar.classList.remove("d-none");
        btnCopiarCodigo.innerHTML = '<i class="bi bi-clipboard-check"></i>';
        btnCopiarCodigo.classList.replace("btn-outline-success", "btn-success");

        setTimeout(() => {
            mensajeCopiar.classList.add("d-none");
            btnCopiarCodigo.innerHTML = '<i class="bi bi-clipboard"></i>';
            btnCopiarCodigo.classList.replace("btn-success", "btn-outline-success");
        }, 2500);
    } catch {
        mostrarError("No se pudo copiar. Selecciona el código manualmente.");
    }
});

// ============================================================
// Event listeners
// ============================================================

menuGrid.addEventListener("click", e => {
    const button = e.target.closest("button[data-producto]");
    if (!button) return;
    agregarProducto(button.dataset.producto);
});

carritoItems.addEventListener("click", e => {
    const button = e.target.closest("button[data-action]");
    if (!button) return;

    const index = Number(button.dataset.index);

    if (button.dataset.action === "mas")    cambiarCantidad(index, 1);
    if (button.dataset.action === "menos")  cambiarCantidad(index, -1);
    if (button.dataset.action === "quitar") { items.splice(index, 1); renderCarrito(); }
});

btnEnviarPedido.addEventListener("click", enviarPedido);
btnSeguir.addEventListener("click", consultarSeguimiento);

document.addEventListener("DOMContentLoaded", async () => {
    renderCarrito();
    await cargarMenuMesa();

    const codigoGuardado = localStorage.getItem("bocatto_qr_codigo");
    if (codigoGuardado) {
        codigoSeguimiento.value = codigoGuardado;
        await consultarSeguimiento();
    }

    iniciarPolling();
});
