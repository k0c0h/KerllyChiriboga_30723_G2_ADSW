import { Router } from "express";

import PedidoController from "../controllers/PedidoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
const router = Router();

router.use(authMiddleware);

router.get("/", PedidoController.listar);

router.get(

    "/mesa/:id",

    authMiddleware,

    PedidoController.buscarPorMesa

);
router.get("/:id", PedidoController.obtener);

router.post(

    "/",

    authMiddleware,

    roleMiddleware(

        "ADMIN",

        "MESERO",

        "OPERADOR"

    ),

    PedidoController.crear

);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "COCINA"
    ),
    PedidoController.cambiarEstado
);
router.put(
    "/:id/estado",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "COCINA"
    ),
    PedidoController.cambiarEstado
);

router.put(
    "/:id/pagar",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "CAJA"
    ),
    PedidoController.pagar
);

router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), PedidoController.eliminar);

export default router;