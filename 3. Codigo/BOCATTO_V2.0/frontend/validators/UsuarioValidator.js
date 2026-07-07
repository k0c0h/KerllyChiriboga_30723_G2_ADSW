class UsuarioValidator{

    validar(usuario){

        if(usuario.nombre.trim()==="")

            return{

                ok:false,

                mensaje:"Ingrese el nombre"

            };

        if(usuario.apellido.trim()==="")

            return{

                ok:false,

                mensaje:"Ingrese el apellido"

            };

        if(usuario.username.trim()==="")

            return{

                ok:false,

                mensaje:"Ingrese el usuario"

            };

        if(usuario.id==="" &&

        usuario.password.trim()==="")

            return{

                ok:false,

                mensaje:"Ingrese la contraseña"

            };

        return{

            ok:true

        };

    }

}

export default new UsuarioValidator();