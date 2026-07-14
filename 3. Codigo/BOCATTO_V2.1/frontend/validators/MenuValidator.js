class MenuValidator {

    validar(producto) {

        if (producto.nombre.trim() === "") {

            return {

                ok: false,

                mensaje: "Ingrese el nombre del producto."

            };

        }

        if (producto.precio <= 0) {

            return {

                ok: false,

                mensaje: "Ingrese un precio válido."

            };

        }

        return {

            ok: true

        };

    }

}

export default new MenuValidator();