class Alert{

    async confirmar(mensaje){

        return Promise.resolve(

            confirm(mensaje)

        );

    }

}

export default new Alert();