import Prototype from "./Prototype.js";

class PromocionPrototype extends Prototype {

    constructor(promocion) {

        super();

        this.promocion = promocion;

    }

    clone() {

        return JSON.parse(JSON.stringify(this.promocion));

    }

}

export default PromocionPrototype;