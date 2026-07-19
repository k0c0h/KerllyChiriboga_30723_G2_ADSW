import Auth from "../../utils/Auth.js";
import Layout from "../../utils/layout.js";
import Router from "../../utils/router.js";

document.addEventListener("DOMContentLoaded", async () => {

    if (!Auth.autenticado()) {
        window.location.replace("login.html");
        return;
    }

    await Layout.init();
    await Router.init();

});