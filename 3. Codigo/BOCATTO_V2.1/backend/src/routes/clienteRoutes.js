import { Router } from "express";

import ClienteController from "../controllers/ClienteController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
const router = Router();

router.use(authMiddleware);

router.get(

    "/",

    authMiddleware,

    ClienteController.listar

);
router.get("/:id", ClienteController.obtener);

router.post(

    "/",

    authMiddleware,

    roleMiddleware(

        "ADMIN",

        "MESERO"

    ),

    ClienteController.crear

);
router.put("/:id", ClienteController.actualizar);

router.delete("/:id", ClienteController.eliminar);

export default router;