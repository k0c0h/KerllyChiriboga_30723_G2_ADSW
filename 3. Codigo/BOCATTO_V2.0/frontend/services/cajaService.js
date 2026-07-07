import API from "./api.js";
import Storage from "../utils/storage.js";

class CajaService {

    get headers() {

        return {

            "Content-Type": "application/json",

            Authorization: `Bearer ${Storage.obtenerToken()}`

        };

    }

    async listar() {

        const r = await fetch(

            `${API}/pedidos`,

            {

                headers: this.headers

            }

        );

        return await r.json();

    }

    async cobrar(id) {

        const r = await fetch(

            `${API}/pedidos/${id}/pagar`,

            {

                method: "PUT",

                headers: this.headers

            }

        );

        return await r.json();

    }

}

export default new CajaService();