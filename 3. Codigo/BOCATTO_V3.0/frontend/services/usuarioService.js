import API from "./api.js";
import Storage from "../utils/storage.js";

class UsuarioService {

    get headers() {

        const token = Storage.obtenerToken();
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        return headers;

    }

    async listar() {

        const response = await fetch(`${API}/usuarios`, {

            headers: this.headers

        });

        return await response.json();

    }

    async obtener(id) {

        const response = await fetch(`${API}/usuarios/${id}`, {

            headers: this.headers

        });

        return await response.json();

    }

    async crear(usuario) {

        const response = await fetch(`${API}/usuarios`, {

            method: "POST",

            headers: this.headers,

            body: JSON.stringify(usuario)

        });

        return await response.json();

    }

    async actualizar(id, usuario) {

        const response = await fetch(`${API}/usuarios/${id}`, {

            method: "PUT",

            headers: this.headers,

            body: JSON.stringify(usuario)

        });

        return await response.json();

    }

    async eliminar(id) {

        const response = await fetch(`${API}/usuarios/${id}`, {

            method: "DELETE",

            headers: this.headers

        });

        return await response.json();

    }

}

export default new UsuarioService();