import ReporteService from "../services/reporteService.js";
import ReporteView from "../views/ReporteView.js";
import Loader from "../utils/Loader.js";
import Toast from "../utils/Toast.js";

class ReporteController {

    pedidos = [];

    libreriasPromise = null;

    async cargarLibrerias() {
        if (!this.libreriasPromise) {
            this.libreriasPromise = Promise.all([
                import("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm"),
                import("https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.4/+esm"),
                import("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm")
            ]).then(([jsPDFModulo, autoTableModulo, xlsxModulo]) => ({
                jsPDF: jsPDFModulo.jsPDF || jsPDFModulo.default || jsPDFModulo,
                autoTable: autoTableModulo.default || autoTableModulo,
                XLSX: xlsxModulo.default || xlsxModulo
            }));
        }
        return await this.libreriasPromise;
    }

    async init() {
        this.registrarEventos();
        await this.buscar();
    }

    registrarEventos() {

        document.getElementById("btnBuscar")
            .addEventListener("click", () => this.buscar());

        document.getElementById("btnPDF")
            .addEventListener("click", () => this.exportarPDF());

        document.getElementById("btnExcel")
            .addEventListener("click", () => this.exportarExcel());

        // Delegated event for dynamically rendered print buttons
        document.getElementById("tablaReportes")
            .addEventListener("click", e => {
                const btn = e.target.closest(".btnFactura");
                if (!btn) return;
                const id = btn.dataset.id;
                const pedido = this.pedidos.find(p => p._id === id);
                if (pedido) {
                    ReporteView.imprimirFactura(pedido);
                } else {
                    Toast.warning("No se encontró el pedido.");
                }
            });
    }

    async buscar() {

        const inicio = document.getElementById("fechaInicio").value;
        const fin    = document.getElementById("fechaFin").value;

        Loader.mostrar();
        const respuesta = await ReporteService.listar(inicio, fin);
        Loader.ocultar();

        if (!respuesta.success) {
            Toast.error(respuesta.message || "Error al cargar reportes");
            return;
        }

        this.pedidos = respuesta.data;
        ReporteView.render(this.pedidos);
    }

    async exportarPDF() {
        if (this.pedidos.length === 0) {
            Toast.warning("No hay datos para exportar.");
            return;
        }

        try {
            const { jsPDF, autoTable } = await this.cargarLibrerias();

            const pdf = new jsPDF();

            pdf.setFontSize(18);
            pdf.setTextColor(200, 100, 10);
            pdf.text("BOCATTO - Reporte de Ventas", 15, 18);

            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Generado: ${new Date().toLocaleString("es-EC")}`, 15, 26);

            autoTable(pdf, {
                startY: 32,
                head: [["Fecha", "Mesa", "Total", "Estado"]],
                body: this.pedidos.map(p => [
                    new Date(p.createdAt).toLocaleDateString("es-EC"),
                    p.mesa ? `Mesa ${p.mesa.numero}` : "Telefónico",
                    `$${p.total.toFixed(2)}`,
                    p.estado
                ]),
                headStyles: { fillColor: [200, 100, 10] },
                alternateRowStyles: { fillColor: [252, 248, 244] }
            });

            pdf.save(`bocatto_ventas_${new Date().toLocaleDateString("es-EC").replace(/\//g, "-")}.pdf`);
            Toast.success("PDF generado correctamente");

        } catch (err) {
            console.error(err);
            Toast.error("No se pudo generar el PDF.");
        }
    }

    async exportarExcel() {
        if (this.pedidos.length === 0) {
            Toast.warning("No hay datos para exportar.");
            return;
        }

        try {
            const { XLSX } = await this.cargarLibrerias();

            const datos = this.pedidos.map(p => ({
                Fecha: new Date(p.createdAt).toLocaleDateString("es-EC"),
                Mesa: p.mesa ? `Mesa ${p.mesa.numero}` : "Telefónico",
                Total: p.total.toFixed(2),
                Estado: p.estado
            }));

            const hoja = XLSX.utils.json_to_sheet(datos);
            const libro = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(libro, hoja, "Ventas");
            XLSX.writeFile(libro, `bocatto_ventas_${new Date().toLocaleDateString("es-EC").replace(/\//g, "-")}.xlsx`);
            Toast.success("Excel generado correctamente");

        } catch (err) {
            console.error(err);
            Toast.error("No se pudo generar el Excel.");
        }
    }

}

export default new ReporteController();