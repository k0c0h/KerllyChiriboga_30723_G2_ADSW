import PromocionesService from "../services/promocionesService.js";
import PromocionView from "../views/PromocioneView.js";
import Loader from "../utils/Loader.js";
import Toast from "../utils/Toast.js";
import Alert from "../utils/Alert.js";

class PromocionController {

    promociones = [];

    async init() {
        this.registrarEventos();
        await this.listar();
    }

    registrarEventos() {

        document.getElementById("btnNuevaPromocion").addEventListener("click", () => {
            PromocionView.limpiarFormulario();
            PromocionView.abrirModal();
        });

        document.getElementById("btnGuardarPromocion").addEventListener("click", () => {
            this.guardar();
        });

        document.getElementById("contenedorPromociones").addEventListener("click", e => {
            this.eventosCards(e);
        });
    }

    async listar() {
        Loader.mostrar();
        const respuesta = await PromocionesService.listar();
        Loader.ocultar();

        if (!respuesta.success) {
            Toast.error(respuesta.message || "Error al cargar promociones");
            return;
        }

        this.promociones = respuesta.data;
        PromocionView.renderCards(this.promociones);
    }

    async guardar() {
        const datos = PromocionView.obtenerFormulario();

        if (!datos.nombre) {
            Toast.warning("El nombre de la promoción es obligatorio.");
            return;
        }

        Loader.mostrar();
        let respuesta;

        if (datos.id === "") {
            respuesta = await PromocionesService.crear(datos);
        } else {
            respuesta = await PromocionesService.actualizar(datos.id, datos);
        }

        Loader.ocultar();

        if (!respuesta.success) {
            Toast.error(respuesta.message);
            return;
        }

        Toast.success("Promoción guardada correctamente");
        PromocionView.cerrarModal();
        await this.listar();
    }

    async eventosCards(e) {
        const boton = e.target.closest("button");
        if (!boton) return;

        const id = boton.dataset.id;

        if (boton.classList.contains("btnEditarPromocion")) {
            Loader.mostrar();
            const respuesta = await PromocionesService.obtener(id);
            Loader.ocultar();

            if (!respuesta.success) {
                Toast.error("No se pudo obtener la promoción");
                return;
            }

            PromocionView.llenarFormulario(respuesta.data);
            PromocionView.abrirModal();
        }

        if (boton.classList.contains("btnEliminarPromocion")) {
            const ok = await Alert.confirmar("¿Desea eliminar esta promoción?");
            if (!ok) return;

            Loader.mostrar();
            const respuesta = await PromocionesService.eliminar(id);
            Loader.ocultar();

            if (!respuesta.success) {
                Toast.error(respuesta.message);
                return;
            }

            Toast.success("Promoción eliminada");
            await this.listar();
        }
    }
}

export default new PromocionController();
