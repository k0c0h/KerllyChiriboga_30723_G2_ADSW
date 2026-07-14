import Mesa from "../models/Mesa.js";

export default async function mesasSeeder() {

    await Mesa.deleteMany();

    const mesas = [];

    for (let i = 1; i <= 10; i++) {

        mesas.push({

            numero: i,

            capacidad: 4,

            estado: "LIBRE"

        });

    }

    await Mesa.insertMany(mesas);

    console.log("✔ Mesas creadas");

}