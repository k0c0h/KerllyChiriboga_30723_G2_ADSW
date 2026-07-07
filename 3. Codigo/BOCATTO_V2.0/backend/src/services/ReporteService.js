import Pedido from "../models/Pedido.js";

class ReporteService {

    async obtenerVentas(inicio, fin) {

        const filtro = {

            estado: "PAGADO"

        };

        if (inicio && fin) {

            filtro.createdAt = {

                $gte: new Date(inicio),

                $lte: new Date(fin)

            };

        }

        return await Pedido.find(filtro)

            .populate("mesa")

            .populate("cliente")

            .sort({

                createdAt: -1

            });

    }

}

export default new ReporteService();