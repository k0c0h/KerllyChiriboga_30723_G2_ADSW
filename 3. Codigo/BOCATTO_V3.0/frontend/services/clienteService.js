import API from "./api.js";
import Storage from "../utils/storage.js";

class ClienteService{

    get headers(){

        return{

            "Content-Type":"application/json",

            Authorization:`Bearer ${Storage.obtenerToken()}`

        };

    }

    async listar(){

        const r=await fetch(`${API}/clientes`,{

            headers:this.headers

        });

        return await r.json();

    }

    async obtener(id){

        const r=await fetch(`${API}/clientes/${id}`,{

            headers:this.headers

        });

        return await r.json();

    }

    async crear(cliente){

        const r=await fetch(`${API}/clientes`,{

            method:"POST",

            headers:this.headers,

            body:JSON.stringify(cliente)

        });

        return await r.json();

    }

    async actualizar(id,cliente){

        const r=await fetch(`${API}/clientes/${id}`,{

            method:"PUT",

            headers:this.headers,

            body:JSON.stringify(cliente)

        });

        return await r.json();

    }

    async eliminar(id){

        const r=await fetch(`${API}/clientes/${id}`,{

            method:"DELETE",

            headers:this.headers

        });

        return await r.json();

    }

}

export default new ClienteService();