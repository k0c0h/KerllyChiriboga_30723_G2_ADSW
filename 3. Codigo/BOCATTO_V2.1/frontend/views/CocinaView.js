class CocinaView{

    render(pedidos){

        const contenedor = document.getElementById("contenedorPedidos");

        if (!contenedor) return;

        const estados = [
            { key: "PENDIENTE", titulo: "Pendientes", clase: "warning" },
            { key: "COCINA", titulo: "En cocina", clase: "primary" },
            { key: "LISTO", titulo: "Listos", clase: "success" },
            { key: "ENTREGADO", titulo: "Entregados", clase: "secondary" }
        ];

        contenedor.innerHTML = estados.map(estado => {
            const pedidosEstado = pedidos.filter(pedido => pedido.estado === estado.key);

            return `
            <div class="col-12 col-lg-3">
                <div class="card shadow h-100 border-${estado.clase}">
                    <div class="card-header bg-${estado.clase} text-white d-flex justify-content-between align-items-center">
                        <strong>${estado.titulo}</strong>
                        <span class="badge bg-light text-dark">${pedidosEstado.length}</span>
                    </div>
                    <div class="card-body d-grid gap-3">
                        ${pedidosEstado.length === 0 ? `
                            <div class="text-center text-muted py-4">Sin pedidos</div>
                        ` : pedidosEstado.map(pedido => `
                            <div class="card border-${estado.clase} shadow-sm">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <h6 class="mb-1">Mesa ${pedido.mesa ? pedido.mesa.numero : "Telefónico"}</h6>
                                            <small class="text-muted">Pedido ${pedido._id.slice(-6)}</small>
                                        </div>
                                        <span class="badge bg-${estado.clase}">${pedido.estado}</span>
                                    </div>
                                    <div class="small">
                                        ${pedido.items.map(item => `
                                            <div class="d-flex justify-content-between mb-1">
                                                <span>${item.cantidad} x ${item.nombre}</span>
                                            </div>
                                        `).join("")}
                                    </div>
                                    <hr>
                                    <button
                                        class="btn btn-${estado.clase} w-100 btnEstado"
                                        data-id="${pedido._id}"
                                        data-estado="${pedido.estado}"
                                        ${estado.key === "ENTREGADO" ? "disabled" : ""}>
                                        ${estado.key === "ENTREGADO" ? "Entregado" : "Cambiar estado"}
                                    </button>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>
            `;
        }).join("");

    }

}

export default new CocinaView();