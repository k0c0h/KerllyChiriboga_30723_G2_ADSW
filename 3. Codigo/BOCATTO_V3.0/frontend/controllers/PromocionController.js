import PromocionesService from "../services/promocionesService.js";
import PromocionView from "../views/PromocioneView.js";
import Loader from "../utils/Loader.js";
import Toast from "../utils/Toast.js";
import Alert from "../utils/Alert.js";

class PromocionController {

    promociones = [];
    _abortController = null;
    promocionOrigenClon = null;


    async init() {
        // Limpiar listeners anteriores para evitar duplicados al re-navegar
        if (this._abortController) {
            this._abortController.abort();
        }
        this._abortController = new AbortController();
        const signal = this._abortController.signal;

        this.registrarEventos(signal);
        await this.listar();
    }

    registrarEventos(signal) {
        document.getElementById("btnNuevaPromocion").addEventListener("click", () => {
            this.promocionOrigenClon = null;
            PromocionView.limpiarFormulario();
            PromocionView.abrirModal();
        }, { signal });

        document.getElementById("btnGuardarPromocion").addEventListener("click", () => {
            this.guardar();
        }, { signal });

        document.getElementById("contenedorPromociones").addEventListener("click", e => {
            this.eventosCards(e);
        }, { signal });
    }

    async listar() {
        Loader.mostrar();
        try {
            const respuesta = await PromocionesService.listar();
            if (!respuesta.success) {
                Toast.error(respuesta.message || "Error al cargar promociones");
                return;
            }
            this.promociones = respuesta.data;
            PromocionView.renderCards(this.promociones);
        } catch (err) {
            Toast.error("Error de conexión al cargar promociones.");
        } finally {
            Loader.ocultar();
        }
    }

    async guardar() {
        const datos = PromocionView.obtenerFormulario();

        if (!datos.nombre) {
            Toast.warning("El nombre de la promoción es obligatorio.");
            return;
        }

        Loader.mostrar();
        try {
            let respuesta;
            if (this.promocionOrigenClon) {
                respuesta = await PromocionesService.clonar(this.promocionOrigenClon, datos);
            } else if (datos.id === "") {
                respuesta = await PromocionesService.crear(datos);
            } else {
                respuesta = await PromocionesService.actualizar(datos.id, datos);
            }

            if (!respuesta.success) {
                Toast.error(respuesta.message || "Error al guardar la promoción.");
                return;
            }

            Toast.success("Promoción guardada correctamente.");
            this.promocionOrigenClon = null;
            PromocionView.cerrarModal();
            await this.listar();
        } catch (err) {
            Toast.error("Error de conexión. No se pudo guardar.");
        } finally {
            Loader.ocultar();
        }
    }

    async eventosCards(e) {
        const boton = e.target.closest("button");
        if (!boton) return;

        const id = boton.dataset.id;

        if (boton.classList.contains("btnEditarPromocion")) {
            this.promocionOrigenClon = null;

            Loader.mostrar();
            try {
                const respuesta = await PromocionesService.obtener(id);
                if (!respuesta.success) {
                    Toast.error("No se pudo obtener la promoción.");
                    return;
                }
                PromocionView.llenarFormulario(respuesta.data);
                PromocionView.abrirModal();
            } catch (err) {
                Toast.error("Error de conexión.");
            } finally {
                Loader.ocultar();
            }
        }

        if (boton.classList.contains("btnClonarPromocion")) {
            Loader.mostrar();
            try {
                const respuesta = await PromocionesService.obtener(id);
                if (!respuesta.success) {
                    Toast.error(respuesta.message || "No se pudo obtener la promociÃ³n.");
                    return;
                }
                this.promocionOrigenClon = id;
                PromocionView.llenarFormularioComoCopia(respuesta.data);
                PromocionView.abrirModal();
            } catch (err) {
                Toast.error("Error de conexiÃ³n.");
            } finally {
                Loader.ocultar();
            }
        }

        if (boton.classList.contains("btnEliminarPromocion")) {
            const ok = await Alert.confirmar("¿Desea eliminar esta promoción?");
            if (!ok) return;

            Loader.mostrar();
            try {
                const respuesta = await PromocionesService.eliminar(id);
                if (!respuesta.success) {
                    Toast.error(respuesta.message || "No se pudo eliminar.");
                    return;
                }
                Toast.success("Promoción eliminada.");
                await this.listar();
            } catch (err) {
                Toast.error("Error de conexión.");
            } finally {
                Loader.ocultar();
            }
        }
    }
}

export default new PromocionController();
