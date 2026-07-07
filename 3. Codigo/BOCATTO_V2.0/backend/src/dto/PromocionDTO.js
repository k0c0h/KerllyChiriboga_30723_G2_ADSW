class PromocionDTO{

    constructor(promocion){

        this.id=promocion._id;

        this.nombre=promocion.nombre;

        this.descripcion=promocion.descripcion;

        this.descuento=promocion.descuento;

        this.activa=promocion.activa;

    }

}

export default PromocionDTO;