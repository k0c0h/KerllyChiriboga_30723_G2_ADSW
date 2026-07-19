class Loader{

    mostrar(){

        if(document.getElementById("loader"))

            return;

        const div=document.createElement("div");

        div.id="loader";

        div.innerHTML=`

        <div class="loader-overlay">

            <div class="spinner-border text-warning">

            </div>

        </div>

        `;

        document.body.appendChild(div);

    }

    ocultar(){

        const loader=

        document.getElementById("loader");

        if(loader)

            loader.remove();

    }

}

export default new Loader();