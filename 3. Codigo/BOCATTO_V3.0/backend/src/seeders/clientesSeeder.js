import Cliente from "../models/Cliente.js";

export default async function clientesSeeder() {

    await Cliente.deleteMany();

    await Cliente.insertMany([

        {

            nombre: "Consumidor Final",

            telefono: "",

            correo: ""

        },

        {

            nombre: "Pedro Gómez",

            telefono: "0999999999",

            correo: "pedro@gmail.com"

        }

    ]);

    console.log("✔ Clientes creados");

}