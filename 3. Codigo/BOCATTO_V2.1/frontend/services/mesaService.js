import API from "./api.js";
import Storage from "../utils/storage.js";

class MesaService {

    get headers() {

        return {

            "Content-Type": "application/json",

            Authorization: `Bearer ${Storage.obtenerToken()}`

        };

    }

    async listar() {

        const r = await fetch(`${API}/mesas`, {

            headers: this.headers

        });

        return await r.json();

    }

    async obtener(id) {

        const r = await fetch(`${API}/mesas/${id}`, {

            headers: this.headers

        });

        return await r.json();

    }

    async crear(mesa) {

        const r = await fetch(`${API}/mesas`, {

            method: "POST",

            headers: this.headers,

            body: JSON.stringify(mesa)

        });

        return await r.json();

    }

    async actualizar(id, mesa) {

        const r = await fetch(`${API}/mesas/${id}`, {

            method: "PUT",

            headers: this.headers,

            body: JSON.stringify(mesa)

        });

        return await r.json();

    }

    async eliminar(id) {

        const r = await fetch(`${API}/mesas/${id}`, {

            method: "DELETE",

            headers: this.headers

        });

        return await r.json();

    }

    async cambiarEstado(id, estado) {

        const r = await fetch(

            `${API}/mesas/${id}/estado`,

            {

                method: "PATCH",

                headers: this.headers,

                body: JSON.stringify({

                    estado

                })

            }

        );

        return await r.json();

    }
}

export default new MesaService();