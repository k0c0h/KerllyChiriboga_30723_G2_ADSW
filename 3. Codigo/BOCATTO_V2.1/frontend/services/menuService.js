import API from "./api.js";
import Storage from "../utils/storage.js";

class MenuService {

    get headers() {

        return {

            "Content-Type": "application/json",

            Authorization: `Bearer ${Storage.obtenerToken()}`

        };

    }

    async listar() {

        const r = await fetch(`${API}/menu`, {

            headers: this.headers

        });

        return await r.json();

    }

    async obtener(id) {

        const r = await fetch(`${API}/menu/${id}`, {

            headers: this.headers

        });

        return await r.json();

    }

    async crear(producto) {

        const r = await fetch(`${API}/menu`, {

            method: "POST",

            headers: this.headers,

            body: JSON.stringify(producto)

        });

        return await r.json();

    }

    async actualizar(id, producto) {

        const r = await fetch(`${API}/menu/${id}`, {

            method: "PUT",

            headers: this.headers,

            body: JSON.stringify(producto)

        });

        return await r.json();

    }

    async eliminar(id) {

        const r = await fetch(`${API}/menu/${id}`, {

            method: "DELETE",

            headers: this.headers

        });

        return await r.json();

    }

}

export default new MenuService();