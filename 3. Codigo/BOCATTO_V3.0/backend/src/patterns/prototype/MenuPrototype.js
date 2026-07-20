import Prototype from "./Prototype.js";

class MenuPrototype extends Prototype {

    constructor(menu) {

        super();

        this.menu = menu;

    }

    clone(cambios = {}) {

        const datos = this.prepararDatos(this.menu);

        return this.aplicarCambios(datos, cambios);

    }

}

export default MenuPrototype;