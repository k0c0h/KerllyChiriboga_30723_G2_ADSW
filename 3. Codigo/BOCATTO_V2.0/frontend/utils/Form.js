class Form{

    obtener(id){

        return document.getElementById(id);

    }

    valor(id){

        return this.obtener(id).value;

    }

    asignar(id,valor){

        this.obtener(id).value=valor;

    }

    limpiar(id){

        this.obtener(id).reset();

    }

}

export default new Form();