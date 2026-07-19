import AppState from "../utils/AppState.js";
import PedidoController from "../controllers/PedidoController.js";

export async function init() {

    await PedidoController.init();

    const mesa =

        AppState.obtenerMesa();

    if (mesa) {

        await PedidoController.abrirMesa(

            mesa

        );

    }

}