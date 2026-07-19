class Modal {

    abrir(id) {
        const el = document.getElementById(id);
        if (!el) return;
        bootstrap.Modal.getOrCreateInstance(el).show();
    }

    cerrar(id) {
        const el = document.getElementById(id);
        if (!el) return;
        const instance = bootstrap.Modal.getInstance(el);
        if (instance) instance.hide();
    }

}

export default new Modal();