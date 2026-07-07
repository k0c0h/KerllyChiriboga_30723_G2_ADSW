class DashboardView {

    grafico = null;

    mostrarResumen(datos) {

        this.animarNumero(

            "lblVentas",

            datos.ventas

        );

        this.animarNumero(

            "lblPedidos",

            datos.pedidos

        );

        this.animarNumero(

            "lblMesas",

            datos.mesas

        );

        this.animarNumero(

            "lblClientes",

            datos.clientes

        );

    }

    crearGrafico(datos) {

        if (this.grafico)

            this.grafico.destroy();

        this.grafico = new Chart(

            document.getElementById("graficoVentas"),

            {

                type: "line",

                data: {

                    labels: datos.labels,

                    datasets: [

                        {

                            label: "Ventas",

                            data: datos.valores

                        }

                    ]

                }

            }

        );

    }

    mostrarProductos(productos) {

        const div = document.getElementById(

            "productosTop"

        );

        div.innerHTML = "";

        productos.forEach(p => {

            div.innerHTML += `

                <div class="d-flex justify-content-between mb-2">

                    <span>

                        ${p.nombre}

                    </span>

                    <strong>

                        ${p.cantidad}

                    </strong>

                </div>

            `;

        });

    }

    mostrarUltimosPedidos(pedidos) {

        const tbody = document.getElementById(

            "tablaUltimosPedidos"

        );

        tbody.innerHTML = "";

        pedidos.forEach(pedido => {

            tbody.innerHTML += `

        <tr>

            <td>

                ${pedido.mesa ? pedido.mesa.numero : "Telefónico"}

            </td>

            <td>

                ${pedido.total.toFixed(2)}

            </td>

            <td>

                <span class="badge bg-primary">

                    ${pedido.estado}

                </span>

            </td>

            <td>

                ${new Date(

                pedido.createdAt

            ).toLocaleTimeString()}

            </td>

        </tr>

        `;

        });

    }

    animarNumero(id, valor) {

        const elemento = document.getElementById(id);

        const inicio = Number(

            elemento.textContent

                .replace("$", "")

        ) || 0;

        const pasos = 30;

        const incremento =

            (valor - inicio) / pasos;

        let actual = inicio;

        const intervalo = setInterval(() => {

            actual += incremento;

            if (

                (incremento > 0 && actual >= valor) ||

                (incremento < 0 && actual <= valor)

            ) {

                actual = valor;

                clearInterval(intervalo);

            }

            elemento.textContent =

                id === "lblVentas"

                    ? `$${actual.toFixed(2)}`

                    : Math.round(actual);

        }, 15);

    }
}


export default new DashboardView();