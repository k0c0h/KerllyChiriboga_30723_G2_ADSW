class Toast{

    success(mensaje){

        this.mostrar(

            mensaje,

            "success"

        );

    }

    error(mensaje){

        this.mostrar(

            mensaje,

            "danger"

        );

    }

    warning(mensaje){

        this.mostrar(

            mensaje,

            "warning"

        );

    }

    info(mensaje){

        this.mostrar(

            mensaje,

            "primary"

        );

    }

    mostrar(mensaje,color){

        const toast=document.createElement("div");

        toast.className=

        `toast align-items-center text-bg-${color}
        border-0 position-fixed top-0 end-0 m-3`;

        toast.style.zIndex=9999;

        toast.innerHTML=`

        <div class="d-flex">

        <div class="toast-body">

        ${mensaje}

        </div>

        <button

        class="btn-close btn-close-white me-2 m-auto"

        data-bs-dismiss="toast">

        </button>

        </div>

        `;

        document.body.appendChild(toast);

        const bsToast=

        new bootstrap.Toast(toast,{

            delay:2500

        });

        bsToast.show();

        toast.addEventListener(

            "hidden.bs.toast",

            ()=>toast.remove()

        );

    }

}

export default new Toast();