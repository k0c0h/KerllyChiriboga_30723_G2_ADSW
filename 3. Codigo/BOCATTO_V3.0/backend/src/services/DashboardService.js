import Pedido from "../models/Pedido.js";
import Mesa from "../models/Mesa.js";
import Cliente from "../models/Cliente.js";

class DashboardService {

    async resumen() {

        const pedidos = await Pedido.find();

        const mesas = await Mesa.find();

        const clientes = await Cliente.find();

        const ventas = pedidos
            .filter(p => p.estado === "PAGADO")
            .reduce((t, p) => t + p.total, 0);

        const pedidosActivos = pedidos.filter(
            p => p.estado !== "PAGADO"
        ).length;

        const mesasOcupadas = mesas.filter(
            m => m.estado === "OCUPADA"
        ).length;

        const grafico = this.obtenerGrafico(pedidos);

        const productos = this.productosMasVendidos(pedidos);

        const ultimosPedidos = await Pedido.find()
            .populate("mesa")
            .sort({
                createdAt: -1
            })
            .limit(10);

        return {

            ventas,

            pedidos: pedidosActivos,

            mesas: mesasOcupadas,

            clientes: clientes.length,

            grafico,

            productos,

            ultimosPedidos

        };

    }

    obtenerGrafico(pedidos) {

        const dias = [

            "Lun",

            "Mar",

            "Mié",

            "Jue",

            "Vie",

            "Sáb",

            "Dom"

        ];

        const valores = [

            0, 0, 0, 0, 0, 0, 0

        ];

        pedidos.forEach(pedido => {

            if (pedido.estado !== "PAGADO")

                return;

            const dia =

                new Date(

                    pedido.createdAt

                ).getDay();

            const indice =

                dia === 0 ? 6 : dia - 1;

            valores[indice] += pedido.total;

        });

        return {

            labels: dias,

            valores

        };

    }

    productosMasVendidos(pedidos) {

        const mapa = {};

        pedidos.forEach(pedido => {

            pedido.items.forEach(item => {

                if (!mapa[item.nombre]) {

                    mapa[item.nombre] = 0;

                }

                mapa[item.nombre] += item.cantidad;

            });

        });

        return Object.entries(mapa)

            .map(([nombre, cantidad]) => ({

                nombre,

                cantidad

            }))

            .sort(

                (a, b) =>

                    b.cantidad -

                    a.cantidad

            )

            .slice(0, 5);

    }

}

export default new DashboardService();