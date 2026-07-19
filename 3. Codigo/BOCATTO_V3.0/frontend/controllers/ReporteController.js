import ReporteService from "../services/reporteService.js";
import ReporteView from "../views/ReporteView.js";
import Loader from "../utils/Loader.js";
import Toast from "../utils/Toast.js";

class ReporteController {

    pedidos = [];

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
        const fin = document.getElementById("fechaFin").value;

        Loader.mostrar();
        try {
            const respuesta = await ReporteService.listar(inicio, fin);
            if (!respuesta.success) {
                Toast.error(respuesta.message || "Error al cargar reportes");
                return;
            }

            this.pedidos = respuesta.data;
            ReporteView.render(this.pedidos);
            this.calcularResumen();
        } catch (err) {
            Toast.error("Error al buscar reportes de ventas.");
        } finally {
            Loader.ocultar();
        }
    }

    calcularResumen() {
        let efectivo = 0;
        let transferencia = 0;
        let tarjeta = 0;
        let total = 0;

        // Solo sumamos pedidos cobrados/pagados
        const pedidosPagados = this.pedidos.filter(p =>
            ["PAGADO", "ENTREGADO"].includes(p.estado)
        );

        pedidosPagados.forEach(p => {
            const metodo = p.metodoPago || "EFECTIVO";
            if (metodo === "EFECTIVO") {
                efectivo += p.total;
            } else if (metodo === "TRANSFERENCIA") {
                transferencia += p.total;
            } else if (metodo === "TARJETA") {
                tarjeta += p.total;
            }
            total += p.total;
        });

        document.getElementById("resumenEfectivo").textContent = `$${efectivo.toFixed(2)}`;
        document.getElementById("resumenTransferencia").textContent = `$${transferencia.toFixed(2)}`;
        document.getElementById("resumenTarjeta").textContent = `$${tarjeta.toFixed(2)}`;
        document.getElementById("resumenTotal").textContent = `$${total.toFixed(2)}`;
    }

    async exportarPDF() {
        if (this.pedidos.length === 0) {
            Toast.warning("No hay datos para exportar.");
            return;
        }

        try {
            if (!window.jspdf || !window.jspdf.jsPDF) {
                Toast.error("La librería PDF no se cargó correctamente.");
                return;
            }

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();

            pdf.setFontSize(18);
            pdf.setTextColor(200, 100, 10);
            pdf.text("BOCATTO — Reporte de Ventas", 15, 18);

            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Generado: ${new Date().toLocaleString("es-EC")}`, 15, 26);

            // Generar tabla de ventas
            pdf.autoTable({
                startY: 32,
                head: [["Fecha", "Mesa", "Total", "Estado", "Método de Pago"]],
                body: this.pedidos.map(p => [
                    new Date(p.createdAt).toLocaleDateString("es-EC"),
                    p.mesa ? `Mesa ${p.mesa.numero}` : "Telefónico",
                    `$${p.total.toFixed(2)}`,
                    p.estado,
                    p.metodoPago || "N/A"
                ]),
                headStyles: { fillColor: [200, 100, 10] },
                alternateRowStyles: { fillColor: [252, 248, 244] }
            });

            pdf.save(`bocatto_ventas_${new Date().toLocaleDateString("es-EC").replace(/\//g, "-")}.pdf`);
            Toast.success("PDF generado correctamente.");

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
            if (!window.XLSX) {
                Toast.error("La librería Excel no se cargó correctamente.");
                return;
            }

            const XLSX = window.XLSX;
            const datos = this.pedidos.map(p => ({
                Fecha: new Date(p.createdAt).toLocaleDateString("es-EC"),
                Mesa: p.mesa ? `Mesa ${p.mesa.numero}` : "Telefónico",
                Total: p.total.toFixed(2),
                Estado: p.estado,
                "Método de Pago": p.metodoPago || "N/A"
            }));

            const hoja = XLSX.utils.json_to_sheet(datos);
            const libro = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(libro, hoja, "Ventas");
            XLSX.writeFile(libro, `bocatto_ventas_${new Date().toLocaleDateString("es-EC").replace(/\//g, "-")}.xlsx`);
            Toast.success("Excel generado correctamente.");

        } catch (err) {
            console.error(err);
            Toast.error("No se pudo generar el Excel.");
        }
    }

}

export default new ReporteController();