import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.set("bufferCommands", false);

    const uris = [
        process.env.MONGO_URI,
        process.env.MONGO_URI_FALLBACK,
        "mongodb://127.0.0.1:27017/bocatto"
    ].filter(Boolean);

    let lastError = null;

    for (const uri of uris) {

        try {

            await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 8000,
                connectTimeoutMS: 10000,
                family: 4
            });

            const host = uri.includes("@")
                ? uri.split("@")[1]
                : uri;

            console.log(`✅ MongoDB conectado correctamente (${host})`);

            return;

        } catch (error) {

            lastError = error;

            console.error("⚠ No se pudo conectar a MongoDB con una URI configurada.");

        }

    }

    console.error("❌ Error al conectar MongoDB");

    throw lastError;


};

export default connectDB;