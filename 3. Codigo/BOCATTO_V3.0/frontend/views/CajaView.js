class CajaView {

    render(pedidos) {
        const contenedor = document.getElementById("contenedorCaja");
        if (!contenedor) return;

        contenedor.innerHTML = "";

        if (pedidos.length === 0) {
            contenedor.innerHTML = `
                <div class="col-12 text-center py-5 text-muted">
                    <i class="bi bi-cash-stack fs-1"></i>
                    <p class="mt-2 mb-0">No hay pedidos listos para cobrar ni listos para entrega.</p>
                </div>`;
            return;
        }

        pedidos.forEach(pedido => {
            const esListo = pedido.estado === "LISTO";
            const esPagado = pedido.estado === "PAGADO";

            let headerBg = "bg-warning text-dark";
            let stateBadge = `<span class="badge bg-light text-warning fw-bold">Listo para Cobrar</span>`;
            let actionBtn = "";

            if (esPagado) {
                headerBg = "bg-success text-white";
                stateBadge = `<span class="badge bg-light text-success fw-bold">PAGADO (Listo para Entregar)</span>`;
                actionBtn = `
                    <button class="btn btn-primary w-100 btnEntregar py-2 fw-bold" data-id="${pedido._id}">
                        <i class="bi bi-box-seam me-1"></i> Entregar Pedido
                    </button>`;
            } else {
                actionBtn = `
                    <div class="mb-3">
                        <label class="form-label fw-semibold text-muted small">Método de Pago</label>
                        <select class="form-select metodoPagoPedido">
                            <option value="EFECTIVO">Efectivo</option>
                            <option value="TRANSFERENCIA">Digital / Transferencia</option>
                            <option value="TARJETA">Tarjeta de Crédito</option>
                        </select>
                    </div>
                    <button class="btn btn-success w-100 btnCobrar py-2 fw-bold" 
                            data-id="${pedido._id}"
                            data-mesa="${pedido.mesa ? pedido.mesa._id : ""}">
                        <i class="bi bi-cash me-1"></i> Confirmar Cobro
                    </button>`;
            }

            contenedor.innerHTML += `
            <div class="col-md-6 col-lg-4">
                <div class="card shadow-sm border-0 h-100">
                    <div class="card-header ${headerBg} py-3 d-flex justify-content-between align-items-center" style="border-radius: var(--radius) var(--radius) 0 0;">
                        <strong class="fs-6">${pedido.mesa ? `Mesa ${pedido.mesa.numero}` : "Pedido Telefónico"}</strong>
                        ${stateBadge}
                    </div>
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <div class="text-muted small mb-2">Pedido: <strong>#${pedido._id.slice(-6).toUpperCase()}</strong></div>
                            ${pedido.clienteNombre ? `<div class="text-muted small mb-2">Cliente: <strong>${pedido.clienteNombre}</strong></div>` : ""}
                            
                            <table class="table table-sm align-middle mt-2 mb-3">
                                <tbody>
                                    ${pedido.items.map(item => `
                                        <tr>
                                            <td class="text-muted">${item.cantidad} x ${item.nombre}</td>
                                            <td class="text-end fw-bold">$${item.subtotal.toFixed(2)}</td>
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <hr class="my-3">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="fw-semibold text-muted">Total a Pagar:</span>
                                <h4 class="fw-bold text-dark mb-0">$${pedido.total.toFixed(2)}</h4>
                            </div>
                            ${esPagado ? `
                                <div class="alert alert-success py-2 px-3 mb-3 d-flex justify-content-between align-items-center" style="font-size:0.85rem;">
                                    <span><i class="bi bi-check-circle-fill me-1"></i> Cobrado con:</span>
                                    <strong>${pedido.metodoPago === "TRANSFERENCIA" ? "Digital/Transf." : pedido.metodoPago}</strong>
                                </div>
                            ` : ""}
                            ${actionBtn}
                        </div>
                    </div>
                </div>
            </div>`;
        });
    }

}

export default new CajaView();