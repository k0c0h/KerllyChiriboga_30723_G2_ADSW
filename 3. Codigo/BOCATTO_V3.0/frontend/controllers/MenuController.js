import MenuService from "../services/menuService.js";
import MenuView from "../views/MenuView.js";
import MenuValidator from "../validators/MenuValidator.js";

import Loader from "../utils/Loader.js";
import Toast from "../utils/Toast.js";
import Alert from "../utils/Alert.js";

class MenuController {

    productos = [];
    productoOrigenClon = null;

    async init() {

        this.registrarEventos();

        await this.listar();

    }

    registrarEventos() {

        document

            .getElementById("btnNuevoProducto")

            .addEventListener("click", () => {

                this.productoOrigenClon = null;

                MenuView.limpiarFormulario();

                MenuView.abrirModal();

            });

        document

            .getElementById("btnGuardarProducto")

            .addEventListener("click", () => {

                this.guardar();

            });

        document

            .getElementById("txtBuscarProducto")

            .addEventListener("keyup", e => {

                this.buscar(e.target.value);

            });

        document

            .getElementById("contenedorProductos")

            .addEventListener("click", e => {

                this.eventosCards(e);

            });

    }

    async listar() {

        Loader.mostrar();

        const respuesta = await MenuService.listar();

        Loader.ocultar();

        if (!respuesta.success) {

            Toast.error(respuesta.message);

            return;

        }

        this.productos = respuesta.data;

        MenuView.renderCards(this.productos);

    }

    buscar(texto) {

        texto = texto.toLowerCase();

        const resultado = this.productos.filter(producto =>

            producto.nombre.toLowerCase().includes(texto) ||

            producto.categoria.toLowerCase().includes(texto)

        );

        MenuView.renderCards(resultado);

    }

    async guardar() {

        const producto = MenuView.obtenerFormulario();

        const validar = MenuValidator.validar(producto);

        if (!validar.ok) {

            Toast.warning(validar.mensaje);

            return;

        }

        Loader.mostrar();

        let respuesta;

        if (this.productoOrigenClon) {

            respuesta = await MenuService.clonar(

                this.productoOrigenClon,

                producto

            );

        } else if (producto.id === "") {

            respuesta = await MenuService.crear(producto);

        } else {

            respuesta = await MenuService.actualizar(

                producto.id,

                producto

            );

        }

        Loader.ocultar();

        if (!respuesta.success) {

            Toast.error(respuesta.message);

            return;

        }

        Toast.success("Producto guardado correctamente");

        this.productoOrigenClon = null;

        MenuView.cerrarModal();

        await this.listar();

    }

    async eventosCards(e) {

        const boton = e.target.closest("button");

        if (!boton) return;

        const id = boton.dataset.id;

        if (boton.classList.contains("btnEditar")) {

            this.productoOrigenClon = null;

            Loader.mostrar();

            const respuesta = await MenuService.obtener(id);

            Loader.ocultar();

            MenuView.llenarFormulario(respuesta.data);

            MenuView.abrirModal();

        }

        if (boton.classList.contains("btnClonar")) {

            Loader.mostrar();

            const respuesta = await MenuService.obtener(id);

            Loader.ocultar();

            if (!respuesta.success) {

                Toast.error(respuesta.message);

                return;

            }

            this.productoOrigenClon = id;

            MenuView.llenarFormularioComoCopia(respuesta.data);

            MenuView.abrirModal();

        }

        if (boton.classList.contains("btnEliminar")) {

            const confirmar = await Alert.confirmar(

                "¿Desea eliminar este producto?"

            );

            if (!confirmar) return;

            Loader.mostrar();

            const respuesta = await MenuService.eliminar(id);

            Loader.ocultar();

            if (!respuesta.success) {

                Toast.error(respuesta.message);

                return;

            }

            Toast.success("Producto eliminado correctamente");

            await this.listar();

        }

    }

}

export default new MenuController();