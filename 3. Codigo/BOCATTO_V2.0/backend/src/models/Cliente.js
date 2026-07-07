import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },

        telefono: {
            type: String,
            default: ""
        },

        correo: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model("Cliente", clienteSchema);