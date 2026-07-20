import { Router } from "express";

import PromocionController from "../controllers/PromocionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", PromocionController.listar);
router.get("/:id", PromocionController.obtener);
router.post("/", roleMiddleware("ADMIN"), PromocionController.crear);
router.post("/:id/clonar", roleMiddleware("ADMIN"), PromocionController.clonar);
router.put("/:id", roleMiddleware("ADMIN"), PromocionController.actualizar);
router.delete("/:id", roleMiddleware("ADMIN"), PromocionController.eliminar);

export default router;