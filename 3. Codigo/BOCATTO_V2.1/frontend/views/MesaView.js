import Form from "../utils/Form.js";
import Modal from "../utils/Modal.js";

class MesaView {

    constructor() {

        this.modalId = "modalMesa";
        this.formId = "formMesa";

    }

    obtenerFormulario() {

        return {

            id: Form.valor("mesaId"),

            numero: Number(Form.valor("mesaNumero")),

            capacidad: Number(Form.valor("mesaCapacidad")),

            estado: Form.valor("mesaEstado")

        };

    }

    limpiarFormulario() {

        Form.limpiar(this.formId);

        Form.asignar("mesaId", "");

        Form.asignar("mesaEstado", "LIBRE");

    }

    llenarFormulario(mesa) {

        Form.asignar("mesaId", mesa._id);

        Form.asignar("mesaNumero", mesa.numero);

        Form.asignar("mesaCapacidad", mesa.capacidad);

        Form.asignar("mesaEstado", mesa.estado);

    }

    abrirModal() {

        Modal.abrir(this.modalId);

    }

    cerrarModal() {

        Modal.cerrar(this.modalId);

    }

    renderCards(mesas) {

        const contenedor = document.getElementById("contenedorMesas");

        if (!contenedor) return;

        contenedor.innerHTML = "";

        mesas.forEach(mesa => {

            let color = "success";
            let icono = "bi-check-circle-fill";

            if (mesa.estado === "OCUPADA") {

                color = "danger";
                icono = "bi-cup-hot-fill";

            }

            if (mesa.estado === "RESERVADA") {

                color = "warning";
                icono = "bi-bookmark-check-fill";

            }

            contenedor.innerHTML += `

            <div class="col-xl-3 col-lg-4 col-md-6">

                <div class="card shadow h-100 border-${color}">

                    <div class="card-body text-center">

                        <i class="bi ${icono} fs-1 text-${color}"></i>

                        <h4 class="mt-3">

                            Mesa ${mesa.numero}

                        </h4>

                        <span class="badge bg-${color}">

                            ${mesa.estado}

                        </span>

                        <p class="mt-3">

                            Capacidad

                            <strong>${mesa.capacidad}</strong>

                        </p>

                        <div class="d-grid gap-2">

                            <button

                                class="btn btn-outline-dark btnQR"

                                data-id="${mesa._id}">

                                <i class="bi bi-qr-code"></i>

                                Abrir QR Cliente

                            </button>

                            <button

                                class="btn btn-primary btnPedido"

                                data-id="${mesa._id}"

                                data-numero="${mesa.numero}">

                                <i class="bi bi-receipt"></i>

                                Abrir Pedido

                            </button>

                            <button

                                class="btn btn-warning btnEditar"

                                data-id="${mesa._id}">

                                <i class="bi bi-pencil"></i>

                                Editar

                            </button>

                            <button

                                class="btn btn-danger btnEliminar"

                                data-id="${mesa._id}">

                                <i class="bi bi-trash"></i>

                                Eliminar

                            </button>

                        </div>

                    </div>

                </div>

            </div>

            `;

        });

    }

}

export default new MesaView();