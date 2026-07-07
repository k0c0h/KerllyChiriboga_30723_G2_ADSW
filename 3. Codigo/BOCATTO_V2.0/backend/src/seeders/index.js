import dotenv from "dotenv";
import mongoose from "mongoose";

import usuariosSeeder from "./usuariosSeeder.js";
import mesasSeeder from "./mesasSeeder.js";
import menuSeeder from "./menuSeeder.js";
import promocionesSeeder from "./promocionesSeeder.js";
import clientesSeeder from "./clientesSeeder.js";
import pedidosSeeder from "./pedidosSeeder.js";

dotenv.config();

async function ejecutarSeeders() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("🚀 MongoDB conectado");

        await usuariosSeeder();

        await mesasSeeder();

        await menuSeeder();

        await promocionesSeeder();

        await clientesSeeder();

        await pedidosSeeder();

        console.log("✅ Base de datos inicializada");

    } catch (error) {

        console.error(error);

    } finally {

        await mongoose.disconnect();

        process.exit();

    }

}

ejecutarSeeders();