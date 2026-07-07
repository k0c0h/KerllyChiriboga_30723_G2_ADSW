package com.bocatto.view.interfazpedidomesa;

import java.awt.*;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.*;
import javax.swing.border.EmptyBorder;

public class SeleccionarMesa extends JFrame {

    private String nombreMesero;
    private List<JButton> botonesMesas;
    private ActionListener botonMesaSeleccionadaAction;

    // NUEVO
    private int mesaSeleccionada = -1;

    public SeleccionarMesa(String nombreMesero,
                           ActionListener botonMesaSeleccionadaAction) {

        this.nombreMesero = nombreMesero;
        this.botonMesaSeleccionadaAction = botonMesaSeleccionadaAction;
        this.botonesMesas = new ArrayList<>();

        inicializarComponentes();
    }

    private void inicializarComponentes() {
        setTitle("Registrar Pedido - Seleccionar Mesa");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setSize(1400, 800);
        setLocationRelativeTo(null);
        setResizable(false);

        JPanel panelPrincipal = new JPanel(new BorderLayout());
        panelPrincipal.setBackground(new Color(30, 30, 30));

        panelPrincipal.add(crearPanelSuperior(), BorderLayout.NORTH);
        panelPrincipal.add(crearPanelMesas(), BorderLayout.CENTER);

        add(panelPrincipal);
    }

    private JPanel crearPanelSuperior() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(new Color(30, 30, 30));
        panel.setBorder(new EmptyBorder(15, 20, 15, 20));

        JPanel panelIzquierdo = new JPanel(new FlowLayout(FlowLayout.LEFT, 15, 0));
        panelIzquierdo.setBackground(new Color(30, 30, 30));

        JButton btnAtras = crearBotonAtras();
        btnAtras.addActionListener(e -> dispose());

        JLabel labelTitulo = new JLabel("Registrar Pedido - Mesa");
        labelTitulo.setFont(new Font("Arial", Font.BOLD, 24));
        labelTitulo.setForeground(Color.WHITE);

        panelIzquierdo.add(btnAtras);
        panelIzquierdo.add(labelTitulo);

        JPanel panelDerecho = new JPanel(new FlowLayout(FlowLayout.RIGHT, 15, 0));
        panelDerecho.setBackground(new Color(30, 30, 30));

        JLabel labelUsuario = new JLabel("RF-01 · " + nombreMesero);
        labelUsuario.setFont(new Font("Arial", Font.PLAIN, 14));
        labelUsuario.setForeground(new Color(200, 150, 100));

        JButton btnTotal = new JButton("🛒 $0.00");
        btnTotal.setFont(new Font("Arial", Font.BOLD, 14));
        btnTotal.setBackground(new Color(255, 165, 0));
        btnTotal.setForeground(Color.BLACK);
        btnTotal.setBorderPainted(false);
        btnTotal.setFocusPainted(false);
        btnTotal.setEnabled(false);
        btnTotal.setPreferredSize(new Dimension(120, 40));

        panelDerecho.add(labelUsuario);
        panelDerecho.add(btnTotal);

        panel.add(panelIzquierdo, BorderLayout.WEST);
        panel.add(panelDerecho, BorderLayout.EAST);

        return panel;
    }

    private JPanel crearPanelMesas() {

        JPanel panel = new JPanel(new BorderLayout(0, 20));
        panel.setBackground(new Color(30, 30, 30));
        panel.setBorder(new EmptyBorder(40, 60, 40, 60));

        JLabel labelSeleccionar = new JLabel("Seleccionar Mesa");
        labelSeleccionar.setFont(new Font("Arial", Font.BOLD, 20));
        labelSeleccionar.setForeground(Color.WHITE);

        JLabel labelInstruccion = new JLabel(
                "Elija la mesa para registrar el pedido");
        labelInstruccion.setFont(new Font("Arial", Font.PLAIN, 14));
        labelInstruccion.setForeground(new Color(150, 150, 150));

        JPanel encabezado = new JPanel(new BorderLayout());
        encabezado.setBackground(new Color(30, 30, 30));

        encabezado.add(labelSeleccionar, BorderLayout.NORTH);
        encabezado.add(labelInstruccion, BorderLayout.SOUTH);

        JPanel gridMesas = new JPanel(new GridLayout(3, 4, 30, 25));
        gridMesas.setBackground(new Color(30, 30, 30));

        for (int i = 1; i <= 12; i++) {

            JButton btnMesa = crearBotonMesa(i);

            botonesMesas.add(btnMesa);
            gridMesas.add(btnMesa);
        }

        JScrollPane scrollPane = new JScrollPane(gridMesas);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());
        scrollPane.getViewport().setBackground(new Color(30, 30, 30));

        panel.add(encabezado, BorderLayout.NORTH);
        panel.add(scrollPane, BorderLayout.CENTER);

        return panel;
    }

    private JButton crearBotonMesa(int numeroMesa) {

        JButton boton = new JButton("Mesa " + numeroMesa);

        boton.setFont(new Font("Arial", Font.BOLD, 18));
        boton.setBackground(new Color(55, 55, 55));
        boton.setForeground(new Color(255, 255, 255));
        boton.setOpaque(true);
boton.setContentAreaFilled(true);
boton.setBorderPainted(false);
        boton.setBorder(
                BorderFactory.createLineBorder(
                        new Color(80, 80, 80), 2));

        boton.setFocusPainted(false);
        boton.setCursor(new Cursor(Cursor.HAND_CURSOR));
        boton.setPreferredSize(new Dimension(260, 150));

        boton.addActionListener(e -> {

            mesaSeleccionada = numeroMesa;

            // Restaurar todos los botones
            for (JButton btn : botonesMesas) {
                btn.setBackground(new Color(40, 40, 40));
                btn.setForeground(Color.WHITE);
                btn.setBorder(
                        BorderFactory.createLineBorder(
                                new Color(80, 80, 80), 2));
            }

            // Resaltar mesa seleccionada
            boton.setBackground(new Color(255, 165, 0));
            boton.setForeground(Color.BLACK);
            boton.setBorder(
                    BorderFactory.createLineBorder(
                            new Color(255, 220, 0), 3));

            botonMesaSeleccionadaAction.actionPerformed(null);
        });

        return boton;
    }

    private JButton crearBotonAtras() {

        JButton boton = new JButton("< Atrás");
        boton.setOpaque(true);
        boton.setContentAreaFilled(true);
        boton.setBorderPainted(false);

        boton.setFont(new Font("Arial", Font.PLAIN, 12));
        boton.setBackground(new Color(80, 80, 80));
        boton.setForeground(Color.WHITE);

        boton.setBorder(
                BorderFactory.createLineBorder(
                        new Color(100, 100, 100), 1));

        boton.setFocusPainted(false);
        boton.setCursor(new Cursor(Cursor.HAND_CURSOR));
        boton.setPreferredSize(new Dimension(80, 35));

        return boton;
    }

    public int getMesaSeleccionada() {
        return mesaSeleccionada;
    }
}