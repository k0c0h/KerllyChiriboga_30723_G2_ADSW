import API from "./api.js";
import Storage from "../utils/storage.js";

class ReporteService {

    get headers() {

        return {

            "Content-Type": "application/json",

            Authorization: `Bearer ${Storage.obtenerToken()}`

        };

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