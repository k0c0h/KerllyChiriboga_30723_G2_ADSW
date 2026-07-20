import API from "./api.js";
import Storage from "../utils/storage.js";

class ReporteService {

    get headers() {

        const token = Storage.obtenerToken();
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        return headers;

    }

    async listar(fechaInicio, fechaFin) {

        const r = await fetch(

            `${API}/reportes?inicio=${fechaInicio}&fin=${fechaFin}`,

            {

                headers: this.headers

            }

        );

        return await r.json();

    }

}

export default new ReporteService();