import { Router } from "express";

import MesaController from "../controllers/MesaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", MesaController.listar);

router.get("/:id", MesaController.obtener);

router.post("/", MesaController.crear);

router.put("/:id", MesaController.actualizar);

router.patch("/:id/estado", MesaController.cambiarEstado);

router.delete("/:id", MesaController.eliminar);

export default router;