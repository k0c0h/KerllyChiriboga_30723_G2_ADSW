import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import routes from "./routes/index.js";
import publicRoutes from "./routes/publicRoutes.js";

import dashboardRoutes from "./routes/dashboardRoutes.js";
import reporteRoutes from "./routes/reporteRoutes.js";

import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

/* ============================
   Middlewares
============================ */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({

    extended:true

}));

app.use(cookieParser());

app.use(morgan("dev"));

/* ============================
   Ruta prueba
============================ */

app.get("/",(req,res)=>{

    res.json({

        success:true,

        message:"API Bocatto funcionando correctamente."

    });

});

/* ============================
   API
============================ */

app.use("/api/v1",routes);

app.use("/api/v1/public", publicRoutes);

app.use("/api/v1/dashboard",dashboardRoutes);

app.use("/api/v1/reportes",reporteRoutes);

/* ============================
   404
============================ */

app.use((req,res)=>{

    res.status(404).json({

        success:false,

        message:"Ruta no encontrada.",

        data:null

    });

});

/* ============================
   Error
============================ */

app.use(errorMiddleware);

export default app;