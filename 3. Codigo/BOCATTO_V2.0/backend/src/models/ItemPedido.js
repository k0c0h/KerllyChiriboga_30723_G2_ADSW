import mongoose from "mongoose";

const itemPedidoSchema = new mongoose.Schema(
    {
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu",
            required: true
        },

        nombre: String,

        cantidad: {
            type: Number,
            required: true
        },

        precio: {
            type: Number,
            required: true
        },

        subtotal: Number,

        observacion: {
            type: String,
            default: ""
        }
    },
    {
        _id: false
    }
);

export default itemPedidoSchema;