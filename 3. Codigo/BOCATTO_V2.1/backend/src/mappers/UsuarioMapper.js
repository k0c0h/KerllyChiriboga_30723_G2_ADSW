import UsuarioDTO from "../dto/UsuarioDTO.js";

class UsuarioMapper{

    toDTO(usuario){

        return new UsuarioDTO(usuario);

    }

    toDTOList(lista){

        return lista.map(

            usuario=>new UsuarioDTO(usuario)

        );

    }

}

export default new UsuarioMapper();