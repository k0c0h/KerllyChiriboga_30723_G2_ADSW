import MenuDTO from "../dto/MenuDTO.js";

class MenuMapper{

    toDTO(producto){

        return new MenuDTO(producto);

    }

    toDTOList(lista){

        return lista.map(

            producto=>new MenuDTO(producto)

        );

    }

}

export default new MenuMapper();