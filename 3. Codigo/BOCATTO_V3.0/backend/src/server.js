import "dotenv/config";

import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import conectarDB from "./config/database.js";

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.set("io", io);

io.on("connection", socket => {

    console.log("Cliente conectado:", socket.id);

    socket.on("disconnect", () => {

        console.log("Cliente desconectado");

    });

});

const PORT = process.env.PORT || 3000;

server.on("error", error => {

    if (error.code === "EADDRINUSE") {
        console.error(`❌ El puerto ${PORT} ya está en uso. Cierre la otra instancia y vuelva a intentar.`);
        process.exit(1);
    }

    console.error("❌ Error del servidor:", error);
    process.exit(1);

});

const iniciarServidor = async () => {

    try {

        await conectarDB();

        server.listen(PORT, () => {

            console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);

        });

    } catch (error) {

        console.error(error);

        process.exit(1);

    }

};

iniciarServidor();