import ClienteService from "../services/clienteService.js";
import ClienteView from "../views/ClienteView.js";
import ClienteValidator from "../validators/ClienteValidator.js";

import Loader from "../utils/Loader.js";
import Toast from "../utils/Toast.js";
import Alert from "../utils/Alert.js";

class ClienteController {

    clientes = [];

    async init() {

        this.registrarEventos();

        await this.listar();

    }

    registrarEventos() {

        document
            .getElementById("btnNuevoCliente")
            .addEventListener("click", () => {

                ClienteView.limpiarFormulario();

                ClienteView.abrirModal();

            });

        document
            .getElementById("btnGuardarCliente")
            .addEventListener("click", () => {

                this.guardar();

            });

        document
            .getElementById("txtBuscarCliente")
            .addEventListener("keyup", e => {

                this.buscar(e.target.value);

            });

        document
            .getElementById("tbodyClientes")
            .addEventListener("click", e => {

                this.eventosTabla(e);

            });

    }

    async listar() {

        Loader.mostrar();

        const respuesta = await ClienteService.listar();

        Loader.ocultar();

        if (!respuesta.success) {

            Toast.error(respuesta.message);

            return;

        }

        this.clientes = respuesta.data;

        ClienteView.renderTabla(this.clientes);

    }

    buscar(texto) {

        texto = texto.toLowerCase();

        const resultado = this.clientes.filter(cliente =>

            cliente.nombre.toLowerCase().includes(texto) ||

            cliente.telefono.includes(texto) ||

            cliente.correo.toLowerCase().includes(texto)

        );

        ClienteView.renderTabla(resultado);

    }

    async guardar() {

        const cliente = ClienteView.obtenerFormulario();

        const validar = ClienteValidator.validar(cliente);

        if (!validar.ok) {

            Toast.warning(validar.mensaje);

            return;

        }

        Loader.mostrar();

        let respuesta;

        if (cliente.id === "") {

            respuesta = await ClienteService.crear(cliente);

        } else {

            respuesta = await ClienteService.actualizar(cliente.id, cliente);

        }

        Loader.ocultar();

        if (!respuesta.success) {

            Toast.error(respuesta.message);

            return;

        }

        Toast.success("Cliente guardado correctamente");

        ClienteView.cerrarModal();

        await this.listar();

    }

    async eventosTabla(e) {

        const boton = e.target.closest("button");

        if (!boton) return;

        const id = boton.dataset.id;

        if (boton.classList.contains("btnEditar")) {

            Loader.mostrar();

            const respuesta = await ClienteService.obtener(id);

            Loader.ocultar();

            ClienteView.llenarFormulario(respuesta.data);

            ClienteView.abrirModal();

        }

        if (boton.classList.contains("btnEliminar")) {

            const confirmar = await Alert.confirmar(

                "¿Eliminar este cliente?"

            );

            if (!confirmar) return;

            Loader.mostrar();

            const respuesta = await ClienteService.eliminar(id);

            Loader.ocultar();

            if (!respuesta.success) {

                Toast.error(respuesta.message);

                return;

            }

            Toast.success("Cliente eliminado correctamente");

            await this.listar();

        }

    }

}

export default new ClienteController();