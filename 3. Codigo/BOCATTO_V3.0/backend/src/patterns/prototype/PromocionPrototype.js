import Prototype from "./Prototype.js";

class PromocionPrototype extends Prototype {

    constructor(promocion) {

        super();

        this.promocion = promocion;

    }

     clone(cambios = {}) {

        const datos = this.prepararDatos(this.promocion);

        return this.aplicarCambios(datos, cambios);

    }


}

export default PromocionPrototype;