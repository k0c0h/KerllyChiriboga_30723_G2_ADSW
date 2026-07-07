import ReporteService from "../services/reporteService.js";
import ReporteView from "../views/ReporteView.js";

import Loader from "../utils/Loader.js";
import Toast from "../utils/Toast.js";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";
class ReporteController {

    async init() {

        this.registrarEventos();

        await this.buscar();

    }

    registrarEventos() {

        document

            .getElementById("btnBuscar")

            .addEventListener(

                "click",

                () => this.buscar()

            );

        document

            .getElementById("btnPDF")

            .addEventListener(

                "click",

                () => this.exportarPDF()

            );

        document

            .getElementById("btnExcel")

            .addEventListener(

                "click",

                () => this.exportarExcel()

            );

    }

    async buscar() {

        const inicio =

            document.getElementById(

                "fechaInicio"

            ).value;

        const fin =

            document.getElementById(

                "fechaFin"

            ).value;

        Loader.mostrar();

        const respuesta =

            await ReporteService.listar(

                inicio,

                fin

            );

        Loader.ocultar();

        if (!respuesta.success) {

            Toast.error(

                respuesta.message

            );

            return;

        }

        ReporteView.render(

            respuesta.data

        );

    }

    exportarPDF() {

        const pdf = new jsPDF();

        pdf.text(

            "Reporte de Ventas",

            15,

            15

        );

        autoTable(pdf, {

            html: "#tablaReportes"

        });

        pdf.save(

            "ventas.pdf"

        );

    }

    exportarExcel() {

        const tabla = document.querySelector(

            "table"

        );

        const libro =

            XLSX.utils.table_to_book(

                tabla

            );

        XLSX.writeFile(

            libro,

            "ventas.xlsx"

        );

    }

}

export default new ReporteController();