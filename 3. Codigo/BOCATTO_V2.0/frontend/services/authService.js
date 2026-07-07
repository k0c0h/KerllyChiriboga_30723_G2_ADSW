import API from "./api.js";

class AuthService {

    async login(usuario,password){

        const response=await fetch(

            `${API}/auth/login`,

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    username:usuario,

                    password

                })

            }

        );

        return await response.json();

    }

}

export default new AuthService();