import Usuario from "./models/Usuario.js";

const usuario = new Usuario({
    nombre: "Administrador",
    apellido: "Sistema",
    username: "admin",
    password: "123456",
    rol: "ADMIN"
});

console.log(usuario);