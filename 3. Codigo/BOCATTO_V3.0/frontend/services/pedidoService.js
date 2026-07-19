import API from "./api.js";
import Storage from "../utils/storage.js";

class PedidoService {

    get headers() {

        return {

            "Content-Type": "application/json",

            Authorization: `Bearer ${Storage.obtenerToken()}`

        };

    }

    async listar() {

        const r = await fetch(`${API}/pedidos`, {

            headers: this.headers

        });

        return await r.json();

    }

    async crear(pedido) {

        const r = await fetch(`${API}/pedidos`, {

            method: "POST",

            headers: this.headers,

            body: JSON.stringify(pedido)

        });

        return await r.json();

    }

    async actualizar(id, pedido) {

        const r = await fetch(`${API}/pedidos/${id}`, {

            method: "PUT",

            headers: this.headers,

            body: JSON.stringify(pedido)

        });

        return await r.json();

    }


    async buscarPorMesa(idMesa) {

        const r = await fetch(

            `${API}/pedidos/mesa/${idMesa}`,

            {

                headers: this.headers

            }

        );

        return await r.json();

    }
}

export default new PedidoService();