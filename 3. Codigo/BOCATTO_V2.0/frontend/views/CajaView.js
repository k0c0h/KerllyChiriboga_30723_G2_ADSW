class CajaView {

    render(pedidos) {

        const contenedor = document.getElementById("contenedorCaja");

        contenedor.innerHTML = "";

        pedidos.forEach(pedido => {

            contenedor.innerHTML += `

            <div class="col-lg-4">

                <div class="card shadow border-success">

                    <div class="card-header bg-success text-white">

                        ${pedido.mesa ? `Mesa ${pedido.mesa.numero}` : "Pedido telefónico"}

                    </div>

                    <div class="card-body">

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

                            data-mesa="${pedido.mesa._id}">

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