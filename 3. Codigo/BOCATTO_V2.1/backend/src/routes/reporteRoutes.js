import { Router } from "express";

import ReporteController from "../controllers/ReporteController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = Router();

router.get(

    "/",authMiddleware,roleMiddleware("ADMIN", "CAJA"),

    ReporteController.listar

);

export default router;