import { Router } from "express";

import authRoutes from "./authRoutes.js";
import usuarioRoutes from "./usuarioRoutes.js";
import clienteRoutes from "./clienteRoutes.js";
import mesaRoutes from "./mesaRoutes.js";
import menuRoutes from "./menuRoutes.js";
import pedidoRoutes from "./pedidoRoutes.js";
import promocionRoutes from "./promocionRoutes.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/usuarios", usuarioRoutes);

router.use("/clientes", clienteRoutes);

router.use("/mesas", mesaRoutes);

router.use("/menu", menuRoutes);

router.use("/pedidos", pedidoRoutes);

router.use("/promociones", promocionRoutes);

export default router;