import MesaDTO from "../dto/MesaDTO.js";

class MesaMapper{

    toDTO(mesa){

        return new MesaDTO(mesa);

    }

    toDTOList(lista){

        return lista.map(

            mesa=>new MesaDTO(mesa)

        );

    }

}

export default new MesaMapper();