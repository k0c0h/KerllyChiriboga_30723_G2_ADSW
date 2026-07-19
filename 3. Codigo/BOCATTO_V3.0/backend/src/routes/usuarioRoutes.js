import { Router } from "express";

import UsuarioController from "../controllers/UsuarioController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = Router();

router.use(

    authMiddleware,

    roleMiddleware("ADMIN")

);

router.get(
    "/",
    roleMiddleware("ADMIN"),
    UsuarioController.listar
);

router.get(
    "/:id",
    roleMiddleware("ADMIN"),
    UsuarioController.obtener
);

router.post(
    "/",
    roleMiddleware("ADMIN"),
    UsuarioController.crear
);

router.put(
    "/:id",
    roleMiddleware("ADMIN"),
    UsuarioController.actualizar
);

router.delete(
    "/:id",
    roleMiddleware("ADMIN"),
    UsuarioController.eliminar
);

export default router;