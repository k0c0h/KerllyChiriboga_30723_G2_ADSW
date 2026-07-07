import Prototype from "./Prototype.js";

class MenuPrototype extends Prototype {

    constructor(menu) {

        super();

        this.menu = menu;

    }

    clone() {

        return JSON.parse(JSON.stringify(this.menu));

    }

}

export default MenuPrototype;