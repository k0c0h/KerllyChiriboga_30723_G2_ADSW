class ClienteValidator{

    validar(cliente){

        if(cliente.nombre.trim()==="")

            return{

                ok:false,

                mensaje:"Ingrese el nombre"

            };

        if(cliente.telefono.trim()==="")

            return{

                ok:false,

                mensaje:"Ingrese el teléfono"

            };

        return{

            ok:true

        };

    }

}

export default new ClienteValidator();