import API from "./api.js";
import Storage from "../utils/storage.js";

class DashboardService {

    get headers() {

        return {

            "Content-Type": "application/json",

            Authorization: `Bearer ${Storage.obtenerToken()}`

        };

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