import Menu from "../models/Menu.js";

export default async function menuSeeder() {

    await Menu.deleteMany();

    await Menu.insertMany([

        {

            nombre: "Hamburguesa Clásica",

            descripcion: "Carne, queso y vegetales.",

            categoria: "Comida",

            precio: 8.50,

            imagen: "",

            disponible: true

        },

        {

            nombre: "Pizza Personal",

            descripcion: "Jamón y queso.",

            categoria: "Comida",

            precio: 10,

            imagen: "",

            disponible: true

        },

        {

            nombre: "Papas Fritas",

            descripcion: "Porción grande.",

            categoria: "Entradas",

            precio: 3,

            imagen: "",

            disponible: true

        },

        {

            nombre: "Coca Cola",

            descripcion: "500 ml.",

            categoria: "Bebidas",

            precio: 2,

            imagen: "",

            disponible: true

        },

        {

            nombre: "Limonada",

            descripcion: "Natural.",

            categoria: "Bebidas",

            precio: 2.5,

            imagen: "",

            disponible: true

        }

    ]);

    console.log("✔ Menú creado");

}