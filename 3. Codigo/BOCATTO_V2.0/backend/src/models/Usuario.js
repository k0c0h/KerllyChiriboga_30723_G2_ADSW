import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },

        apellido: {
            type: String,
            required: true,
            trim: true
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        rol: {
            type: String,
            enum: ["ADMIN", "MESERO", "OPERADOR", "COCINA", "CAJA"],
            required: true
        },

        intentosFallidos: {
            type: Number,
            default: 0
        },

        bloqueado: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model("Usuario", usuarioSchema);