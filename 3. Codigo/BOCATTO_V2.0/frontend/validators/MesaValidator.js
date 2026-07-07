class MesaValidator {

    validar(mesa) {

        if (mesa.numero === "" || Number(mesa.numero) <= 0) {

            return {

                ok: false,

                mensaje: "Ingrese un número válido."

            };

        }

        if (mesa.capacidad === "" || Number(mesa.capacidad) <= 0) {

            return {

                ok: false,

                mensaje: "Ingrese una capacidad válida."

            };

        }

        return {

            ok: true

        };

    }

}

export default new MesaValidator();