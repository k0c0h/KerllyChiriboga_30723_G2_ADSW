class ClienteDTO{

    constructor(cliente){

        this.id=cliente._id;

        this.nombre=cliente.nombre;

        this.telefono=cliente.telefono;

        this.correo=cliente.correo;

    }

}

export default ClienteDTO;