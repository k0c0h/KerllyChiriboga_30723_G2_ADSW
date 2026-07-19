class PedidoView {

    renderProductos(productos, deshabilitado = false) {
        const contenedor = document.getElementById("productosPedido");
        if (!contenedor) return;

        contenedor.innerHTML = "";

        productos.forEach(producto => {
            const imagen = producto.imagen && producto.imagen !== ""
                ? producto.imagen
                : "assets/img/sin-imagen.png";

            contenedor.innerHTML += `
            <div class="col-md-4 col-lg-3 col-sm-6">
                <div class="card h-100 shadow-sm producto-card border-0" data-id="${producto._id}">
                    <img src="${imagen}" class="card-img-top rounded-top" style="height:120px;object-fit:cover;">
                    <div class="card-body p-2 text-center">
                        <h6 class="mb-1 text-truncate" title="${producto.nombre}">${producto.nombre}</h6>
                        <span class="badge bg-light text-secondary mb-2">${producto.categoria}</span>
                        <h5 class="text-warning fw-bold mb-2">$${producto.precio.toFixed(2)}</h5>
                        <button class="btn btn-success btn-sm w-100 btnAgregar" 
                                data-id="${producto._id}" 
                                ${deshabilitado ? "disabled" : ""}>
                            <i class="bi bi-plus-lg"></i> Agregar
                        </button>
                    </div>
                </div>
            </div>`;
        });
    }

    renderDetalle(items, deshabilitado = false) {
        const tbody = document.getElementById("detallePedido");
        if (!tbody) return;

        tbody.innerHTML = "";

        items.forEach((item, index) => {
            tbody.innerHTML += `
            <tr>
                <td style="max-width:120px;">
                    <strong style="display:block;" class="text-truncate">${item.nombre}</strong>
                    ${item.observacion ? `<span class="badge bg-warning text-dark font-monospace" style="font-size: 0.65rem;">${item.observacion}</span>` : ""}
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary btnMenos" data-index="${index}" ${deshabilitado ? "disabled" : ""}>-</button>
                        <button class="btn btn-light disabled py-0 px-2" style="min-width:30px;">${item.cantidad}</button>
                        <button class="btn btn-outline-secondary btnMas" data-index="${index}" ${deshabilitado ? "disabled" : ""}>+</button>
                    </div>
                </td>
                <td class="fw-bold">$${item.subtotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-outline-primary btn-sm btnObservacion" data-index="${index}" ${deshabilitado ? "disabled" : ""}>
                        <i class="bi bi-chat-left-text"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-outline-danger btn-sm btnEliminarItem" data-index="${index}" ${deshabilitado ? "disabled" : ""}>
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>`;
        });
    }

    renderMesas(mesas, activeOrdersMap) {
        const contenedor = document.getElementById("gridMesasPedidos");
        if (!contenedor) return;

        contenedor.innerHTML = "";

        if (mesas.length === 0) {
            contenedor.innerHTML = `
                <div class="col-12 text-center text-muted py-4">
                    <i class="bi bi-info-circle fs-2"></i>
                    <p class="mt-2 mb-0">No hay mesas configuradas.</p>
                </div>`;
            return;
        }

        mesas.forEach(mesa => {
            const tienePedidoActivo = activeOrdersMap.has(String(mesa._id));
            const pedido = tienePedidoActivo ? activeOrdersMap.get(String(mesa._id)) : null;

            let color = "success";
            let btnClass = "btn-success";
            let btnText = "Crear Pedido";
            let btnIcon = "bi-plus-lg";

            if (tienePedidoActivo) {
                color = "danger";
                btnClass = "btn-danger";
                btnText = "Ver Pedido";
                btnIcon = "bi-eye";
            }

            contenedor.innerHTML += `
            <div class="col-sm-6 col-md-4 col-lg-3">
                <div class="card shadow-sm border-0 h-100 text-center p-3" style="border-top: 4px solid var(--bs-${color}) !important;">
                    <div class="fs-1 mb-2 text-${color}">
                        <i class="bi bi-tablet"></i>
                    </div>
                    <h5 class="fw-bold mb-1">Mesa ${mesa.numero}</h5>
                    <p class="text-muted small mb-2">Capacidad: ${mesa.capacidad} pers.</p>
                    <span class="badge bg-${color} mb-3" style="width:fit-content; margin:0 auto;">
                        ${tienePedidoActivo ? "OCUPADA" : "LIBRE"}
                    </span>
                    <button class="btn ${btnClass} w-100 fw-semibold btnAccionMesa" 
                            data-mesa-id="${mesa._id}" 
                            data-mesa-numero="${mesa.numero}"
                            data-tiene-pedido="${tienePedidoActivo}"
                            data-pedido-id="${pedido ? pedido._id : ""}">
                        <i class="bi ${btnIcon} me-1"></i> ${btnText}
                    </button>
                </div>
            </div>`;
        });
    }

    renderPedidosActivos(pedidos) {
        const tbody = document.getElementById("tablaPedidosActivos");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (pedidos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted py-4">
                        <i class="bi bi-receipt fs-2"></i>
                        <p class="mt-2 mb-0">No hay pedidos activos.</p>
                    </td>
                </tr>`;
            return;
        }

        pedidos.forEach(p => {
            const colorCanal = p.canal === "TELEFONO" ? "info" : (p.canal === "QR" ? "primary" : "secondary");
            const esTelefono = p.canal === "TELEFONO";
            const detalleUbicacion = esTelefono 
                ? `<i class="bi bi-telephone text-info me-1"></i> ${p.telefonoEntrega || "Llamada"}`
                : `Mesa ${p.mesa?.numero || "-"}`;

            let colorEstado = "secondary";
            if (p.estado === "PENDIENTE") colorEstado = "warning text-dark";
            if (p.estado === "COCINA") colorEstado = "primary";
            if (p.estado === "LISTO") colorEstado = "success";
            if (p.estado === "ENTREGADO") colorEstado = "info text-dark";

            tbody.innerHTML += `
            <tr>
                <td><strong>${p._id.slice(-6).toUpperCase()}</strong></td>
                <td><span class="badge bg-${colorCanal}">${p.canal}</span></td>
                <td>${detalleUbicacion}</td>
                <td>${p.clienteNombre || p.cliente?.nombre || "-"}</td>
                <td class="fw-bold">$${p.total.toFixed(2)}</td>
                <td><span class="badge bg-${colorEstado}">${p.estado}</span></td>
                <td class="text-end">
                    <button class="btn btn-outline-primary btn-sm btnVerDetallePedido" data-pedido-id="${p._id}">
                        <i class="bi bi-eye"></i> Ver Detalle
                    </button>
                </td>
            </tr>`;
        });
    }

    nuevoPedido(idMesa) {
        this.mostrarMesa(idMesa || "-");
    }

    cargarPedido(pedido) {
        const etiquetaMesa = pedido.mesa?.numero || (pedido.canal === "TELEFONO" ? "Telefónico" : "QR");
        this.mostrarMesa(etiquetaMesa);
    }

    mostrarCamposCanal(canal) {
        const bloque = document.getElementById("camposTelefono");
        if (!bloque) return;
        bloque.style.display = canal === "TELEFONO" ? "block" : "none";
    }

    actualizarTotal(total) {
        const lbl = document.getElementById("lblTotal");
        if (lbl) lbl.textContent = total.toFixed(2);
    }

    mostrarMesa(numero) {
        const titulo = document.getElementById("tituloMesa");
        if (titulo) {
            titulo.textContent = numero === "Telefónico" || numero === "QR" 
                ? `Pedido ${numero}` 
                : `Mesa ${numero}`;
        }
    }
}

export default new PedidoView();