class MenuDTO{

    constructor(producto){

        this.id=producto._id;

        this.nombre=producto.nombre;

        this.descripcion=producto.descripcion;

        this.categoria=producto.categoria;

        this.precio=producto.precio;

        this.imagen=producto.imagen;

        this.disponible=producto.disponible;

    }

}

export default MenuDTO;