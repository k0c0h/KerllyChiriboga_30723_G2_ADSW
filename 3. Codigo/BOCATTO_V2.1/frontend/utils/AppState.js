class AppState {

    guardarMesa(mesa) {

        const valor = typeof mesa === "object" && mesa !== null
            ? mesa
            : {
                id: mesa,
                numero: null
            };

        sessionStorage.setItem(

            "mesaSeleccionada",

            JSON.stringify(valor)

        );

    }

    obtenerMesa() {

        const valor = sessionStorage.getItem(

            "mesaSeleccionada"

        );

        if (!valor) return null;

        try {

            return JSON.parse(valor);

        } catch {

            return {

                id: valor,

                numero: null

            };

        }

    }

    limpiarMesa() {

        sessionStorage.removeItem(

            "mesaSeleccionada"

        );

    }

    guardarPedido(id) {

        sessionStorage.setItem(

            "pedidoSeleccionado",

            id

        );

    }

    obtenerPedido() {

        return sessionStorage.getItem(

            "pedidoSeleccionado"

        );

    }

    limpiarPedido() {

        sessionStorage.removeItem(

            "pedidoSeleccionado"

        );

    }

}

export default new AppState();