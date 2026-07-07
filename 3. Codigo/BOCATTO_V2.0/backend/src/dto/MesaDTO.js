class MesaDTO{

    constructor(mesa){

        this.id=mesa._id;

        this.numero=mesa.numero;

        this.capacidad=mesa.capacidad;

        this.estado=mesa.estado;

    }

}

export default MesaDTO;