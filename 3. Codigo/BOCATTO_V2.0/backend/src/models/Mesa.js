import mongoose from "mongoose";

const mesaSchema = new mongoose.Schema(
    {
        numero: {
            type: Number,
            required: true,
            unique: true
        },

        capacidad: {
            type: Number,
            default: 4
        },

        estado: {
            type: String,
            enum: ["LIBRE", "OCUPADA", "RESERVADA"],
            default: "LIBRE"
        }
    },
    {
        versionKey: false
    }
);

export default mongoose.model("Mesa", mesaSchema);