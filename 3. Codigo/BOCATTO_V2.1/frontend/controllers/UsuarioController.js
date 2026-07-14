import UsuarioService from "../services/usuarioService.js";

import UsuarioView from "../views/UsuarioView.js";

import UsuarioValidator from "../validators/UsuarioValidator.js";

import Toast from "../utils/Toast.js";

import Loader from "../utils/Loader.js";

import Alert from "../utils/Alert.js";

class UsuarioController{

    usuarios=[];

    async init(){

        this.registrarEventos();

        await this.listar();

    }

    registrarEventos(){

        document

        .getElementById("btnNuevo")

        .addEventListener(

            "click",

            ()=>{

                UsuarioView.limpiarFormulario();

                UsuarioView.abrirModal();

            }

        );

        document

        .getElementById("btnGuardar")

        .addEventListener(

            "click",

            ()=>this.guardar()

        );

        document

        .getElementById("txtBuscar")

        .addEventListener(

            "keyup",

            e=>this.buscar(e.target.value)

        );

        document

        .getElementById("tbodyUsuarios")

        .addEventListener(

            "click",

            e=>this.acciones(e)

        );

    }

    async listar(){

        Loader.mostrar();

        const respuesta=

        await UsuarioService.listar();

        Loader.ocultar();

        if(!respuesta.success){

            Toast.error(respuesta.message);

            return;

        }

        this.usuarios=respuesta.data;

        UsuarioView.renderTabla(this.usuarios);

    }

    buscar(texto){

        texto=texto.toLowerCase();

        const resultado=this.usuarios.filter(usuario=>

            usuario.nombre.toLowerCase().includes(texto)||

            usuario.apellido.toLowerCase().includes(texto)||

            usuario.username.toLowerCase().includes(texto)

        );

        UsuarioView.renderTabla(resultado);

    }

    async guardar(){

        const usuario=

        UsuarioView.obtenerFormulario();

        const validar=

        UsuarioValidator.validar(usuario);

        if(!validar.ok){

            Toast.warning(validar.mensaje);

            return;

        }

        Loader.mostrar();

        let respuesta;

        if(usuario.id===""){

            respuesta=

            await UsuarioService.crear(usuario);

        }

        else{

            respuesta=

            await UsuarioService.actualizar(

                usuario.id,

                usuario

            );

        }

        Loader.ocultar();

        if(!respuesta.success){

            Toast.error(respuesta.message);

            return;

        }

        Toast.success("Usuario guardado correctamente");

        UsuarioView.cerrarModal();

        await this.listar();

    }

    async acciones(e){

        const id=e.target.closest("button")?.dataset.id;

        if(!id) return;

        if(e.target.closest(".btnEditar")){

            Loader.mostrar();

            const respuesta=

            await UsuarioService.obtener(id);

            Loader.ocultar();

            UsuarioView.llenarFormulario(

                respuesta.data

            );

            UsuarioView.abrirModal();

        }

        if(e.target.closest(".btnEliminar")){

            const ok=

            await Alert.confirmar(

                "¿Desea eliminar el usuario?"

            );

            if(!ok) return;

            Loader.mostrar();

            await UsuarioService.eliminar(id);

            Loader.ocultar();

            Toast.success("Usuario eliminado");

            await this.listar();

        }

    }

}

export default new UsuarioController();