import Layout from "../../utils/layout.js";
import Router from "../../utils/router.js";
document.addEventListener("DOMContentLoaded", async () => {

    await Layout.init();

    await Router.init();

});