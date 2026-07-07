class ReporteView {

    render(pedidos) {

        const tbody = document.getElementById("tablaReportes");

        tbody.innerHTML = "";

        pedidos.forEach(pedido => {

            tbody.innerHTML += `

            <tr>

                <td>

                    ${new Date(pedido.createdAt).toLocaleDateString()}

                </td>

                <td>

                    ${pedido.mesa ? pedido.mesa.numero : "Telefónico"}

                </td>

                <td>

                    $${pedido.total.toFixed(2)}

                </td>

                <td>

                    ${pedido.estado}

                </td>

                <td>

                    <button

                        class="btn btn-secondary btnFactura"

                        data-id="${pedido._id}">

                        Imprimir

                    </button>

                </td>

            </tr>

            `;

        });

    }

}

export default new ReporteView();