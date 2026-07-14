import Form from "../utils/Form.js";
import Modal from "../utils/Modal.js";

class MenuView {

    constructor() {

        this.modalId = "modalProducto";
        this.formId = "formProducto";

    }

    obtenerFormulario() {

        return {

            id: Form.valor("productoId"),

            nombre: Form.valor("productoNombre"),

            descripcion: Form.valor("productoDescripcion"),

            categoria: Form.valor("productoCategoria"),

            precio: Number(Form.valor("productoPrecio")),

            imagen: Form.valor("productoImagen"),

            disponible: document.getElementById("productoDisponible").checked

        };

    }

    limpiarFormulario() {

        Form.limpiar(this.formId);

        Form.asignar("productoId", "");

        document.getElementById("productoDisponible").checked = true;

    }

    llenarFormulario(producto) {

        Form.asignar("productoId", producto._id);

        Form.asignar("productoNombre", producto.nombre);

        Form.asignar("productoDescripcion", producto.descripcion);

        Form.asignar("productoCategoria", producto.categoria);

        Form.asignar("productoPrecio", producto.precio);

        Form.asignar("productoImagen", producto.imagen);

        document.getElementById("productoDisponible").checked = producto.disponible;

    }

    abrirModal() {

        Modal.abrir(this.modalId);

    }

    cerrarModal() {

        Modal.cerrar(this.modalId);

    }

    renderCards(productos) {

        const contenedor = document.getElementById("contenedorProductos");

        contenedor.innerHTML = "";

        productos.forEach(producto => {

            const imagen = producto.imagen && producto.imagen !== ""
                ? producto.imagen
                : "assets/img/sin-imagen.png";

            const badge = producto.disponible
                ? `<span class="badge bg-success">Disponible</span>`
                : `<span class="badge bg-danger">No disponible</span>`;

            contenedor.innerHTML += `

            <div class="col-lg-3 col-md-4 col-sm-6">

                <div class="card shadow h-100">

                    <img
                        src="${imagen}"
                        class="card-img-top"
                        style="height:200px;object-fit:cover;">

                    <div class="card-body">

                        <h5 class="card-title">

                            ${producto.nombre}

                        </h5>

                        <p class="text-muted">

                            ${producto.categoria}

                        </p>

                        <p>

                            ${producto.descripcion}

                        </p>

                        <h4 class="text-warning">

                            $${producto.precio.toFixed(2)}

                        </h4>

                        ${badge}

                    </div>

                    <div class="card-footer d-grid gap-2">

                        <button

                            class="btn btn-warning btnEditar"

                            data-id="${producto._id}">

                            <i class="bi bi-pencil"></i>

                            Editar

                        </button>

                        <button

                            class="btn btn-danger btnEliminar"

                            data-id="${producto._id}">

                            <i class="bi bi-trash"></i>

                            Eliminar

                        </button>

                    </div>

                </div>

            </div>

            `;

        });

    }

}

export default new MenuView();