import Form from "../utils/Form.js";
import Modal from "../utils/Modal.js";

class ClienteView {

    constructor() {

        this.modalId = "modalCliente";
        this.formId = "formCliente";

    }

    obtenerFormulario() {

        return {

            id: Form.valor("clienteId"),

            nombre: Form.valor("clienteNombre"),

            telefono: Form.valor("clienteTelefono"),

            correo: Form.valor("clienteCorreo")

        };

    }

    limpiarFormulario() {

        Form.limpiar(this.formId);

        Form.asignar("clienteId", "");

    }

    llenarFormulario(cliente) {

        Form.asignar("clienteId", cliente._id);

        Form.asignar("clienteNombre", cliente.nombre);

        Form.asignar("clienteTelefono", cliente.telefono);

        Form.asignar("clienteCorreo", cliente.correo);

    }

    abrirModal() {

        Modal.abrir(this.modalId);

    }

    cerrarModal() {

        Modal.cerrar(this.modalId);

    }

    renderTabla(clientes) {

        const tbody = document.getElementById("tbodyClientes");

        tbody.innerHTML = "";

        clientes.forEach(cliente => {

            tbody.innerHTML += `

            <tr>

                <td>${cliente.nombre}</td>

                <td>${cliente.telefono}</td>

                <td>${cliente.correo}</td>

                <td>

                    <button
                        class="btn btn-warning btn-sm btnEditar"
                        data-id="${cliente._id}">

                        <i class="bi bi-pencil"></i>

                    </button>

                    <button
                        class="btn btn-danger btn-sm btnEliminar"
                        data-id="${cliente._id}">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            </tr>

            `;

        });

    }

}

export default new ClienteView();