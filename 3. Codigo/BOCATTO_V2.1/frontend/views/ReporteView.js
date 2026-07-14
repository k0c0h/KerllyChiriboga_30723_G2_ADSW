class ReporteView {

    render(pedidos) {

        const tbody = document.getElementById("tablaReportes");

        if (!tbody) return;

        tbody.innerHTML = "";

        if (pedidos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No hay datos para mostrar</td></tr>`;
            return;
        }

        pedidos.forEach(pedido => {

            tbody.innerHTML += `
            <tr>
                <td>${new Date(pedido.createdAt).toLocaleDateString("es-EC")}</td>
                <td>${pedido.mesa ? `Mesa ${pedido.mesa.numero}` : "Telefónico"}</td>
                <td><strong>$${pedido.total.toFixed(2)}</strong></td>
                <td>
                    <span class="badge ${this._estadoBadge(pedido.estado)}">
                        ${pedido.estado}
                    </span>
                </td>
                <td>
                    <button
                        class="btn btn-sm btn-outline-secondary btnFactura"
                        data-id="${pedido._id}"
                        title="Imprimir factura">
                        <i class="bi bi-printer"></i>
                    </button>
                </td>
            </tr>`;

        });

    }

    _estadoBadge(estado) {
        const mapa = {
            PENDIENTE: "bg-warning text-dark",
            COCINA:    "bg-primary",
            LISTO:     "bg-success",
            ENTREGADO: "bg-secondary",
            PAGADO:    "bg-info text-dark"
        };
        return mapa[estado] || "bg-secondary";
    }

    imprimirFactura(pedido) {
        if (!pedido) return;

        const ventana = window.open("", "_blank", "width=420,height=600");

        const items = pedido.items && pedido.items.length > 0
            ? pedido.items.map(i => `
                <tr>
                    <td>${i.nombre}</td>
                    <td style="text-align:center;">${i.cantidad}</td>
                    <td style="text-align:right;">$${(i.subtotal || 0).toFixed(2)}</td>
                </tr>
                ${i.observacion ? `<tr><td colspan="3" style="color:#888;font-size:11px;padding-left:10px;">↳ ${i.observacion}</td></tr>` : ""}
            `).join("")
            : `<tr><td colspan="3" style="text-align:center;color:#888;">Sin items</td></tr>`;

        ventana.document.write(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Factura Bocatto</title>
                <style>
                    * { box-sizing: border-box; margin:0; padding:0; }
                    body { font-family: 'Courier New', monospace; font-size: 13px; color: #111; padding: 20px; }
                    .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 12px; margin-bottom: 12px; }
                    .brand { font-size: 22px; font-weight: bold; letter-spacing: 2px; color: #c8640a; }
                    .sub { font-size: 11px; color: #555; margin-top: 2px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    th { background: #f0ede8; padding: 6px 4px; font-size: 11px; text-transform: uppercase; }
                    td { padding: 5px 4px; border-bottom: 1px dashed #ddd; vertical-align: top; }
                    .total-row { font-weight: bold; font-size: 15px; border-top: 2px solid #333; }
                    .footer { text-align: center; margin-top: 14px; font-size: 11px; color: #666; border-top: 1px dashed #333; padding-top: 10px; }
                    @media print { body { padding: 0; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="brand">BOCATTO</div>
                    <div class="sub">SISTEMA DE GESTIÓN DE RESTAURANTE</div>
                    <div class="sub">Fecha: ${new Date(pedido.createdAt).toLocaleString("es-EC")}</div>
                    <div class="sub">Mesa: ${pedido.mesa ? pedido.mesa.numero : "Telefónico"}</div>
                    <div class="sub">Pedido #${pedido._id?.slice(-8).toUpperCase() || "N/A"}</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th style="text-align:center;">Cant.</th>
                            <th style="text-align:right;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items}
                        <tr class="total-row">
                            <td colspan="2">TOTAL</td>
                            <td style="text-align:right;">$${pedido.total.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="footer">
                    ¡Gracias por su visita!<br>
                    Estado: ${pedido.estado}
                </div>
                <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }<\/script>
            </body>
            </html>
        `);

        ventana.document.close();
    }

}

export default new ReporteView();