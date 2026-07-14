class EventBus {

    emitir(nombre, detalle = null) {

        document.dispatchEvent(

            new CustomEvent(

                nombre,

                {

                    detail: detalle

                }

            )

        );

    }

    escuchar(nombre, callback) {

        document.addEventListener(

            nombre,

            callback

        );

    }

    eliminar(nombre, callback) {

        document.removeEventListener(

            nombre,

            callback

        );

    }

}

export default new EventBus();