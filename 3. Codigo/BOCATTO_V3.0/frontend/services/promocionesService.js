import API from "./api.js";
import Storage from "../utils/storage.js";

class PromocionesService {

    get headers() {
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Storage.obtenerToken()}`
        };
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
