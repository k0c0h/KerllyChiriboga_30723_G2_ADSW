import Form from "../utils/Form.js";
import Modal from "../utils/Modal.js";

class UsuarioView {

    constructor(){

        this.modalId="modalUsuario";

        this.formId="formUsuario";

    }

    obtenerFormulario(){

        return{

            id:Form.valor("id"),

            nombre:Form.valor("nombre"),

            apellido:Form.valor("apellido"),

            username:Form.valor("username"),

            password:Form.valor("password"),

            rol:Form.valor("rol")

        };

    }

    limpiarFormulario(){

        Form.limpiar(this.formId);

        Form.asignar("id","");

    }

    llenarFormulario(usuario){

        Form.asignar("id",usuario._id);

        Form.asignar("nombre",usuario.nombre);

        Form.asignar("apellido",usuario.apellido);

        Form.asignar("username",usuario.username);

        Form.asignar("rol",usuario.rol);

    }

    abrirModal(){

        Modal.abrir(this.modalId);

    }

    cerrarModal(){

        Modal.cerrar(this.modalId);

    }

    renderTabla(usuarios){

        const tbody=document.getElementById("tbodyUsuarios");

        tbody.innerHTML="";

        usuarios.forEach(usuario=>{

            tbody.innerHTML+=`

            <tr>

                <td>${usuario.nombre} ${usuario.apellido}</td>

                <td>${usuario.username}</td>

                <td>

                    <span class="badge bg-warning text-dark">

                        ${usuario.rol}

                    </span>

                </td>

                <td>

                    <button

                        class="btn btn-warning btn-sm btnEditar"

                        data-id="${usuario._id}">

                        <i class="bi bi-pencil"></i>

                    </button>

                    <button

                        class="btn btn-danger btn-sm btnEliminar"

                        data-id="${usuario._id}">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            </tr>

            `;

        });

    }

}

export default new UsuarioView();