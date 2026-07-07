import { Router } from "express";

import PromocionController from "../controllers/PromocionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", PromocionController.listar);

router.post("/",authMiddleware, roleMiddleware("ADMIN"), PromocionController.crear);

export default router;