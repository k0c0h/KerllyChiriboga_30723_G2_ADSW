import { Router } from "express";

import MenuController from "../controllers/MenuController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", authMiddleware, roleMiddleware("ADMIN", "MESERO", "CAJA", "COCINA", "OPERADOR"), MenuController.listar);

router.get("/disponibles", MenuController.disponibles);
router.get("/:id", MenuController.obtener);

router.post("/",authMiddleware, roleMiddleware("ADMIN"), MenuController.crear);
router.post("/:id/clonar", roleMiddleware("ADMIN"), MenuController.clonar);

export default router;