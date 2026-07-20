import API from "./api.js";

import Storage from "../utils/storage.js";

class CocinaService{

    get headers(){

        const token = Storage.obtenerToken();
        const headers = { "Content-Type":"application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        return headers;

    }

    async listar(){

        const r=await fetch(

            `${API}/pedidos`,

            {

                headers:this.headers

            }

        );

        return await r.json();

    }

    async actualizarEstado(id,estado){

        const r=await fetch(

            `${API}/pedidos/${id}`,

            {

                method:"PUT",

                headers:this.headers,

                body:JSON.stringify({

                    estado

                })

            }

        );

        return await r.json();

    }

}

export default new CocinaService();