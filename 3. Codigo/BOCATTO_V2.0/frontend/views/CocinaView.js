class CocinaView{

    render(pedidos){

        const contenedor=

        document.getElementById(

            "contenedorPedidos"

        );

        contenedor.innerHTML="";

        pedidos.forEach(pedido=>{

            let color="warning";

            if(pedido.estado==="COCINA")

                color="primary";

            if(pedido.estado==="LISTO")

                color="success";

            contenedor.innerHTML+=`

            <div class="col-lg-4">

                <div class="card border-${color} shadow">

                    <div class="card-header bg-${color} text-white">

                        Mesa

                        ${pedido.mesa ? pedido.mesa.numero : "Telefónico"}

                    </div>

                    <div class="card-body">

                        ${pedido.items.map(item=>`

                            <p>

                                ${item.cantidad}

                                x

                                ${item.nombre}

                            </p>

                        `).join("")}

                        <hr>

                        <button

                        class="btn btn-${color} btnEstado"

                        data-id="${pedido._id}"

                        data-estado="${pedido.estado}">

                        Cambiar Estado

                        </button>

                    </div>

                </div>

            </div>

            `;

        });

    }

}

export default new CocinaView();