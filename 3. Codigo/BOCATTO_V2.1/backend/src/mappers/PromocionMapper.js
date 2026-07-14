import PromocionDTO from "../dto/PromocionDTO.js";

class PromocionMapper{

    toDTO(promocion){

        return new PromocionDTO(promocion);

    }

    toDTOList(lista){

        return lista.map(

            promocion=>new PromocionDTO(promocion)

        );

    }

}

export default new PromocionMapper();