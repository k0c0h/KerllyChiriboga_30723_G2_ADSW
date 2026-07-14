class Modal{

    abrir(id){

        new bootstrap.Modal(

            document.getElementById(id)

        ).show();

    }

    cerrar(id){

        bootstrap.Modal

        .getInstance(

            document.getElementById(id)

        ).hide();

    }

}

export default new Modal();