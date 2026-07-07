class PedidoView {

    renderProductos(productos) {

        const contenedor = document.getElementById("productosPedido");

        contenedor.innerHTML = "";

        productos.forEach(producto => {

            const imagen = producto.imagen && producto.imagen !== ""
                ? producto.imagen
                : "assets/img/sin-imagen.png";

            contenedor.innerHTML += `

            <div class="col-md-4">

                <div
                    class="card h-100 shadow producto-card"
                    data-id="${producto._id}">

                    <img
                        src="${imagen}"
                        class="card-img-top"
                        style="height:150px;object-fit:cover;">

                    <div class="card-body text-center">

                        <h6>

                            ${producto.nombre}

                        </h6>

                        <span class="badge bg-secondary">

                            ${producto.categoria}

                        </span>

                        <h5 class="mt-2 text-warning">

                            $${producto.precio.toFixed(2)}

                        </h5>

                        <button
                            class="btn btn-success w-100 btnAgregar"

                            data-id="${producto._id}">

                            Agregar

                        </button>

                    </div>

                </div>

            </div>

            `;

        });

    }

    renderDetalle(items) {

        const tbody = document.getElementById("detallePedido");

        tbody.innerHTML = "";

        items.forEach((item, index) => {

            tbody.innerHTML += `

        <tr>

            <td>

                <strong>${item.nombre}</strong>

                <br>

                <small class="text-muted">

                    ${item.observacion || ""}

                </small>

            </td>

            <td>

                <div class="btn-group">

                    <button

                        class="btn btn-outline-secondary btnMenos"

                        data-index="${index}">

                        -

                    </button>

                    <button

                        class="btn btn-light disabled">

                        ${item.cantidad}

                    </button>

                    <button

                        class="btn btn-outline-secondary btnMas"

                        data-index="${index}">

                        +

                    </button>

                </div>

            </td>

            <td>

                $${item.subtotal.toFixed(2)}

            </td>

            <td>

                <button

                    class="btn btn-primary btnObservacion"

                    data-index="${index}">

                    <i class="bi bi-chat-left-text"></i>

                </button>

            </td>

            <td>

                <button

                    class="btn btn-danger btnEliminarItem"

                    data-index="${index}">

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        </tr>

        `;

        });

    }

    nuevoPedido(idMesa) {

        this.mostrarMesa(idMesa || "-");

    }

    cargarPedido(pedido) {

        const etiquetaMesa = pedido.mesa?.numero || "Domicilio";

        this.mostrarMesa(etiquetaMesa);

    }

    mostrarCamposCanal(canal) {

        const bloque = document.getElementById("camposTelefono");

        if (!bloque) return;

        bloque.style.display = canal === "TELEFONO" ? "block" : "none";

    }

    actualizarTotal(total) {

        document.getElementById("lblTotal").textContent =

            total.toFixed(2);

    }

    mostrarMesa(numero) {

        document.getElementById("tituloMesa").textContent =

            `Mesa ${numero}`;

    }

}

export default new PedidoView();