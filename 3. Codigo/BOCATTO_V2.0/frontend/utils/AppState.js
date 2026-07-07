class AppState {

    guardarMesa(id) {

        sessionStorage.setItem(

            "mesaSeleccionada",

            id

        );

    }

    obtenerMesa() {

        return sessionStorage.getItem(

            "mesaSeleccionada"

        );

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