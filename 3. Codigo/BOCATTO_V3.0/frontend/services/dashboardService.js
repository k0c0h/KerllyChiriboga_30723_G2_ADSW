import API from "./api.js";
import Storage from "../utils/storage.js";

class DashboardService {

    get headers() {

        const token = Storage.obtenerToken();
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        return headers;

    }

    async obtenerResumen() {

        const r = await fetch(

            `${API}/dashboard/resumen`,

            {

                headers: this.headers

            }

        );

        return await r.json();

    }

}

export default new DashboardService();