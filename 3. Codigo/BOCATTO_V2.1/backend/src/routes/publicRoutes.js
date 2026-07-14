import { Router } from "express";
import PublicPedidoController from "../controllers/PublicPedidoController.js";

const router = Router();

router.get(
    "/mesas/:mesaId/menu",
    PublicPedidoController.obtenerMenuPorMesa
);

router.post(
    "/mesas/:mesaId/pedidos",
    PublicPedidoController.crearPedidoQR
);

router.get(
    "/pedidos/seguimiento/:codigoSeguimiento",
    PublicPedidoController.seguirPedido
);

export default router;
