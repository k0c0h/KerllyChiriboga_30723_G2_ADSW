package com.bocatto.view.interfazpedidomesa;

import com.bocatto.controller.PedidoController;
import com.bocatto.repository.MenuRepository;
import com.bocatto.repository.PedidoRepository;

import javax.swing.*;

public class FlujoPedidoMesa {
    private String nombreMesero;
    private MenuRepository menuRepository;
    private PedidoRepository pedidoRepository;
    private PedidoController pedidoController;

    private DashboardMesero dashboardMesero;
    private SeleccionarMesa seleccionarMesa;
    private RegistrarPedidoMesa registrarPedidoMesa;

    public FlujoPedidoMesa(String nombreMesero, MenuRepository menuRepository,
            PedidoRepository pedidoRepository) {
        this.nombreMesero = nombreMesero;
        this.menuRepository = menuRepository;
        this.pedidoRepository = pedidoRepository;
        this.pedidoController = new PedidoController(pedidoRepository);
    }

    public void iniciar() {
        dashboardMesero = new DashboardMesero(nombreMesero, e -> mostrarSeleccionarMesa());
        dashboardMesero.setVisible(true);
    }

    private void mostrarSeleccionarMesa() {
        seleccionarMesa = new SeleccionarMesa(nombreMesero, e -> mostrarRegistrarPedidoMesa());
        seleccionarMesa.setVisible(true);
    }

    private void mostrarRegistrarPedidoMesa() {
        int mesaSeleccionada = seleccionarMesa.getMesaSeleccionada();
        if (mesaSeleccionada > 0) {
            registrarPedidoMesa = new RegistrarPedidoMesa(nombreMesero, mesaSeleccionada,
                    menuRepository, pedidoController);
            registrarPedidoMesa.setVisible(true);
        } else {
            JOptionPane.showMessageDialog(seleccionarMesa, "Por favor seleccione una mesa",
                    "Mesa no seleccionada", JOptionPane.WARNING_MESSAGE);
        }
    }
}