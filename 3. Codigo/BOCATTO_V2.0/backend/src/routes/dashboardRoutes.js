import { Router } from "express";

import DashboardController from "../controllers/DashboardController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = Router();

router.get(

    "/resumen",authMiddleware,roleMiddleware("ADMIN"),

    DashboardController.resumen

);

export default router;