import mongoose from "mongoose";

import itemPedidoSchema from "./ItemPedido.js";

const pedidoSchema = new mongoose.Schema(
    {
        canal: {
            type: String,
            enum: ["MESA", "TELEFONO", "QR"],
            default: "MESA"
        },

        mesa: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mesa",
            required: function requiredMesa() {
                return this.canal !== "TELEFONO";
            }
        },

        cliente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cliente"
        },

        clienteNombre: {
            type: String,
            default: ""
        },

        mesero: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario"
        },

        metodoPago: {
            type: String,
            enum: ["EFECTIVO", "TARJETA", "TRANSFERENCIA"],
            default: null
        },

        observaciones: {
            type: String,
            default: ""
        },

        items: [itemPedidoSchema],

        total: {
            type: Number,
            default: 0
        },

        telefonoEntrega: {
            type: String,
            default: ""
        },

        direccionEntrega: {
            type: String,
            default: ""
        },

        codigoSeguimiento: {
            type: String,
            unique: true,
            sparse: true
        },

        estado: {
            type: String,
            enum: [
                "PENDIENTE",
                "COCINA",
                "LISTO",
                "ENTREGADO",
                "PAGADO"
            ],
            default: "PENDIENTE"
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model("Pedido", pedidoSchema);