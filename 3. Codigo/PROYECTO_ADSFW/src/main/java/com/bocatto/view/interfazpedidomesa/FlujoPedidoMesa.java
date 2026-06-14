package com.bocatto.view.interfazpedidomesa;

import javax.swing.*;

public class FlujoPedidoMesa {
    private String nombreMesero;
    private DashboardMesero dashboardMesero;
    private SeleccionarMesa seleccionarMesa;
    private RegistrarPedidoMesa registrarPedidoMesa;

    public FlujoPedidoMesa(String nombreMesero) {
        this.nombreMesero = nombreMesero;
    }

    public void iniciar() {

        dashboardMesero = new DashboardMesero(
            nombreMesero,
            e -> mostrarSeleccionarMesa()
        );

        dashboardMesero.setVisible(true);
    }

private void mostrarSeleccionarMesa() {
    seleccionarMesa =
        new SeleccionarMesa(
            nombreMesero,
            e -> mostrarRegistrarPedidoMesa()
        );

    seleccionarMesa.setVisible(true);
}

    private void mostrarRegistrarPedidoMesa() {
        int mesaSeleccionada = seleccionarMesa.getMesaSeleccionada();
        if (mesaSeleccionada > 0) {
            registrarPedidoMesa = new RegistrarPedidoMesa(nombreMesero, mesaSeleccionada);
            registrarPedidoMesa.setVisible(true);
        } else {
            JOptionPane.showMessageDialog(seleccionarMesa, "Por favor seleccione una mesa", "Mesa no seleccionada", JOptionPane.WARNING_MESSAGE);
        }
    }
}
