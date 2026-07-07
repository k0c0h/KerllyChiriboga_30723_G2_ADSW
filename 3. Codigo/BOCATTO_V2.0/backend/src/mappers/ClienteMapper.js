import ClienteDTO from "../dto/ClienteDTO.js";

class ClienteMapper{

    toDTO(cliente){

        return new ClienteDTO(cliente);

    }

    toDTOList(lista){

        return lista.map(

            cliente=>new ClienteDTO(cliente)

        );

    }

}

export default new ClienteMapper();