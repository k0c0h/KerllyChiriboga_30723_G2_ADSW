import mongoose from "mongoose";

const promocionSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },

        descripcion: String,

        descuento: {
            type: Number,
            default: 0
        },

        activa: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model("Promocion", promocionSchema);