import Promocion from "../models/Promocion.js";

export default async function promocionesSeeder() {

    await Promocion.deleteMany();

    await Promocion.insertMany([

        {

            nombre: "Combo Hamburguesa",

            descripcion: "15% de descuento",

            descuento: 15,

            activa: true

        },

        {

            nombre: "Martes Pizza",

            descripcion: "20% de descuento",

            descuento: 20,

            activa: true

        }

    ]);

    console.log("✔ Promociones creadas");

}