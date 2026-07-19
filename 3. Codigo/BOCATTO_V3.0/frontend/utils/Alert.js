/**
 * Alert utility — reemplaza confirm() nativo por un modal Bootstrap estético.
 * El modal #modalConfirmar debe existir en el DOM (se inserta en index.html).
 */
class Alert {

    /**
     * Muestra un modal de confirmación estético y retorna una Promise<boolean>.
     * @param {string} mensaje
     * @returns {Promise<boolean>}
     */
    confirmar(mensaje) {
        return new Promise((resolve) => {
            // Intentar usar el modal Bootstrap si existe
            const modalEl = document.getElementById("modalConfirmar");
            const labelEl = document.getElementById("modalConfirmarMensaje");

            if (!modalEl || !labelEl) {
                // Fallback si el modal no existe en el DOM
                resolve(window.confirm(mensaje));
                return;
            }

            labelEl.textContent = mensaje;

            const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

            // Limpiar listeners anteriores
            const btnSi = document.getElementById("btnConfirmarSi");
            const btnNo = document.getElementById("btnConfirmarNo");

            const cloneSi = btnSi.cloneNode(true);
            const cloneNo = btnNo.cloneNode(true);
            btnSi.replaceWith(cloneSi);
            btnNo.replaceWith(cloneNo);

            document.getElementById("btnConfirmarSi").addEventListener("click", () => {
                modal.hide();
                resolve(true);
            }, { once: true });

            document.getElementById("btnConfirmarNo").addEventListener("click", () => {
                modal.hide();
                resolve(false);
            }, { once: true });

            // Si cierra con X o backdrop, resolver false
            modalEl.addEventListener("hidden.bs.modal", () => resolve(false), { once: true });

            modal.show();
        });
    }

}

export default new Alert();