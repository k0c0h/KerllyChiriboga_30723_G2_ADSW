import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";

export default async function usuariosSeeder() {

    await Usuario.deleteMany();

    const password = await bcrypt.hash("123456", 10);

    await Usuario.insertMany([

        {
            nombre: "Administrador",
            apellido: "Sistema",
            username: "admin",
            password,
            rol: "ADMIN"
        },

        {
            nombre: "Juan",
            apellido: "Pérez",
            username: "mesero",
            password,
            rol: "MESERO"
        },

        {
            nombre: "Laura",
            apellido: "Mora",
            username: "operador",
            password,
            rol: "OPERADOR"
        },

        {
            nombre: "Carlos",
            apellido: "Cruz",
            username: "cocina",
            password,
            rol: "COCINA"
        },

        {
            nombre: "María",
            apellido: "Lopez",
            username: "caja",
            password,
            rol: "CAJA"
        }

    ]);

    console.log("✔ Usuarios creados");

}