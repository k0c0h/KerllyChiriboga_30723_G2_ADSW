class CajaView {

    render(pedidos) {

        const contenedor = document.getElementById("contenedorCaja");

        if (!contenedor) return;

        contenedor.innerHTML = "";

        pedidos.forEach(pedido => {

            contenedor.innerHTML += `

            <div class="col-lg-4">

                <div class="card shadow border-success">

                    <div class="card-header bg-success text-white">

                        ${pedido.mesa ? `Mesa ${pedido.mesa.numero}` : "Pedido telefónico"}

                    </div>

                    <div class="card-body">

                        <div class="mb-3">

                            <label class="form-label fw-semibold">

                                Método de pago

                            </label>

                            <select class="form-select metodoPagoPedido">

                                <option value="EFECTIVO">Efectivo</option>

                                <option value="TARJETA">Tarjeta</option>

                            </select>

                        </div>

                        <table class="table table-sm">

                            ${pedido.items.map(item => `

                                <tr>

                                    <td>

                                        ${item.cantidad} x ${item.nombre}

                                    </td>

                                    <td>

                                        $${item.subtotal.toFixed(2)}

                                    </td>

                                </tr>

                            `).join("")}

                        </table>

                        <hr>

                        <h4 class="text-end">

                            Total

                            $${pedido.total.toFixed(2)}

                        </h4>

                        <button

                            class="btn btn-success w-100 btnCobrar"

                            data-id="${pedido._id}"

                            data-mesa="${pedido.mesa ? pedido.mesa._id : ""}">

                            Cobrar

                        </button>

                    </div>

                </div>

            </div>

            `;

        });

    }

}

export default new CajaView();