class UsuarioDTO {

    constructor(usuario){

        this.id=usuario._id;

        this.nombreCompleto=`${usuario.nombre} ${usuario.apellido}`;

        this.username=usuario.username;

        this.rol=usuario.rol;

    }

}

export default UsuarioDTO;