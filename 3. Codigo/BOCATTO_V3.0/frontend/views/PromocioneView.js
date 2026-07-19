import Modal from "../utils/Modal.js";

class PromocionView {

    constructor() {
        this.modalId = "modalPromocion";
    }

    obtenerFormulario() {
        return {
            id: document.getElementById("promocionId").value,
            nombre: document.getElementById("promocionNombre").value.trim(),
            descripcion: document.getElementById("promocionDescripcion").value.trim(),
            descuento: Number(document.getElementById("promocionDescuento").value) || 0,
            activa: document.getElementById("promocionActiva").checked
        };
    }

    limpiarFormulario() {
        document.getElementById("promocionId").value = "";
        document.getElementById("promocionNombre").value = "";
        document.getElementById("promocionDescripcion").value = "";
        document.getElementById("promocionDescuento").value = "0";
        document.getElementById("promocionActiva").checked = true;
    }

    llenarFormulario(p) {
        document.getElementById("promocionId").value = p._id;
        document.getElementById("promocionNombre").value = p.nombre;
        document.getElementById("promocionDescripcion").value = p.descripcion || "";
        document.getElementById("promocionDescuento").value = p.descuento || 0;
        document.getElementById("promocionActiva").checked = p.activa;
    }

    abrirModal() { Modal.abrir(this.modalId); }
    cerrarModal() { Modal.cerrar(this.modalId); }

    renderCards(promociones) {
        const contenedor = document.getElementById("contenedorPromociones");
        if (!contenedor) return;
        contenedor.innerHTML = "";

        if (promociones.length === 0) {
            contenedor.innerHTML = `
                <div class="col-12 text-center py-5 text-muted">
                    <i class="bi bi-percent fs-1"></i>
                    <p class="mt-2">No hay promociones registradas</p>
                </div>`;
            return;
        }

        promociones.forEach(p => {
            const estadoBadge = p.activa
                ? `<span class="badge bg-success">Activa</span>`
                : `<span class="badge bg-secondary">Inactiva</span>`;

            contenedor.innerHTML += `
            <div class="col-lg-4 col-md-6">
                <div class="card shadow h-100 border-0">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title mb-0">${p.nombre}</h5>
                            ${estadoBadge}
                        </div>
                        <p class="text-muted small mb-3">${p.descripcion || "Sin descripción"}</p>
                        <div class="d-flex align-items-center gap-2">
                            <span class="badge bg-warning text-dark fs-6">
                                <i class="bi bi-percent"></i> ${p.descuento}% descuento
                            </span>
                        </div>
                    </div>
                    <div class="card-footer d-flex gap-2">
                        <button class="btn btn-warning btn-sm flex-fill btnEditarPromocion" data-id="${p._id}">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm flex-fill btnEliminarPromocion" data-id="${p._id}">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>`;
        });
    }
}

export default new PromocionView();
