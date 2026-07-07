import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },

        descripcion: String,

        categoria: String,

        precio: {
            type: Number,
            required: true
        },

        imagen: {
            type: String,
            default: ""
        },

        disponible: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model("Menu", menuSchema);