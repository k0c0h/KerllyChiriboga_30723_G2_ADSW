import API from "./api.js";
import Storage from "../utils/storage.js";

class PromocionesService {

    get headers() {
        const token = Storage.obtenerToken();
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        return headers;
    }

    async listar() {
        const r = await fetch(`${API}/promociones`, { headers: this.headers });
        return await r.json();
    }

    async obtener(id) {
        const r = await fetch(`${API}/promociones/${id}`, { headers: this.headers });
        return await r.json();
    }

    async crear(datos) {
        const r = await fetch(`${API}/promociones`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(datos)
        });
        return await r.json();
    }

    async actualizar(id, datos) {
        const r = await fetch(`${API}/promociones/${id}`, {
            method: "PUT",
            headers: this.headers,
            body: JSON.stringify(datos)
        });
        return await r.json();
    }

    async eliminar(id) {
        const r = await fetch(`${API}/promociones/${id}`, {
            method: "DELETE",
            headers: this.headers
        });
        return await r.json();
    }

}

export default new PromocionesService();
