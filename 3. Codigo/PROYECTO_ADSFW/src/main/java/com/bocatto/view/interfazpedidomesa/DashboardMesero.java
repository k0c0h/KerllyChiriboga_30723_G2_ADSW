package com.bocatto.view.interfazpedidomesa;

import java.awt.*;
import java.awt.event.ActionListener;
import javax.swing.*;

public class DashboardMesero extends JFrame {
    private String nombreMesero;
    private ActionListener botonPedidoMesaAction;

    public DashboardMesero(String nombreMesero, ActionListener botonPedidoMesaAction) {
        this.nombreMesero = nombreMesero;
        this.botonPedidoMesaAction = botonPedidoMesaAction;
        inicializarComponentes();
    }

    private void inicializarComponentes() {
        setTitle("Bocatto Valley - Dashboard Mesero");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1400, 800);
        setLocationRelativeTo(null);
        setResizable(false);

        JPanel panelPrincipal = new JPanel(new BorderLayout());
        panelPrincipal.setBackground(new Color(30, 30, 30));
        panelPrincipal.add(crearPanelSuperior(), BorderLayout.NORTH);
        panelPrincipal.add(crearPanelCentral(), BorderLayout.CENTER);
        panelPrincipal.add(crearPanelInferior(), BorderLayout.SOUTH);
        add(panelPrincipal);
    }

    private JPanel crearPanelSuperior() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(new Color(30, 30, 30));
        panel.setBorder(BorderFactory.createCompoundBorder(
        BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(60,60,60)),
        BorderFactory.createEmptyBorder(25, 35, 25, 35)
        ));
        JLabel labelLogo = new JLabel("🥘 Bocatto Valley");
        labelLogo.setFont(new Font("Segoe UI Emoji", Font.BOLD, 30));        labelLogo.setForeground(new Color(255, 165, 0));

        JLabel labelSubtitulo = new JLabel("Sistema de Gestión - Dashboard");
        labelSubtitulo.setFont(new Font("Segoe UI Emoji", Font.PLAIN, 14));
        labelSubtitulo.setForeground(new Color(150, 150, 150));

        JPanel panelIzquierdo = new JPanel(new FlowLayout(FlowLayout.LEFT, 20, 0));
        panelIzquierdo.setBackground(new Color(30, 30, 30));
        panelIzquierdo.add(labelLogo);
        panelIzquierdo.add(labelSubtitulo);

        JPanel panelDerecho = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        panelDerecho.setBackground(new Color(30, 30, 30));

        JLabel labelUsuario = new JLabel(nombreMesero);
        labelUsuario.setFont(new Font("Segoe UI Emoji", Font.BOLD, 14));
        labelUsuario.setForeground(new Color(100, 150, 200));

        JButton btnSalir = crearBoton("Salir", new Color(200, 50, 50));
        btnSalir.addActionListener(e -> System.exit(0));

        panelDerecho.add(labelUsuario);
        panelDerecho.add(btnSalir);
        panel.add(panelIzquierdo, BorderLayout.WEST);
        panel.add(panelDerecho, BorderLayout.EAST);
        return panel;
    }

    private JPanel crearPanelCentral() {

    JPanel principal = new JPanel();
    principal.setBackground(new Color(30,30,30));
    principal.setLayout(new BoxLayout(principal, BoxLayout.Y_AXIS));
    principal.setBorder(
        BorderFactory.createEmptyBorder(
            30,50,30,50
        )
    );

    JPanel estadisticas =
        new JPanel(
            new GridLayout(1,4,20,0)
        );

    estadisticas.setBackground(
        new Color(30,30,30)
    );

    estadisticas.setMaximumSize(
        new Dimension(
            Integer.MAX_VALUE,
            120
        )
    );

    estadisticas.add(
        crearTarjetaEstadistica(
            "⏳ Pendientes",
            "0",
            new Color(100,80,0)
        )
    );

    estadisticas.add(
        crearTarjetaEstadistica(
            "👨‍🍳 En Cocina",
            "0",
            new Color(30,50,80)
        )
    );

    estadisticas.add(
        crearTarjetaEstadistica(
            "✅ Listos",
            "0",
            new Color(30,80,30)
        )
    );

    estadisticas.add(
        crearTarjetaEstadistica(
            "💰 Total del Día",
            "$0.00",
            new Color(100,80,0)
        )
    );

    JLabel titulo =
        new JLabel("FUNCIONES DEL SISTEMA", SwingConstants.CENTER);

    titulo.setForeground(
        new Color(255,165,0)
    );

    titulo.setFont(
        new Font(
            "Segoe UI Emoji",
            Font.BOLD,
            20
        )
    );

    titulo.setBorder(
        BorderFactory.createEmptyBorder(
            30,0,25,0
        )
    );

    JPanel funciones =
        new JPanel(
            new GridLayout(
                1,3,25,0
            )
        );

    funciones.setBackground(
        new Color(30,30,30)
    );

    funciones.setMaximumSize(
    new Dimension(
        Integer.MAX_VALUE,
        320
    )
    );

    funciones.add(
        crearCardFuncion(
            "🍽️",
            "Pedido por Mesa",
            "Mesero registra pedidos en mesa.<br>Seleccione la mesa y envíe a cocina.",
            true
        )
    );

    funciones.add(
        crearCardFuncion(
            "👤",
            "Pedido Operador",
            "Operador registra pedidos a nombre de un cliente.<br>Solo Operador",
            false
        )
    );

    funciones.add(
        crearCardFuncion(
            "📋",
            "Gestión Pedidos",
            "Visualice y actualice el estado de pedidos activos.",
            false
        )
    );

    principal.add(estadisticas);
    principal.add(Box.createVerticalStrut(20));
    principal.add(titulo);
    principal.add(funciones);

    return principal;
}

    private JPanel crearTarjetaEstadistica(String titulo,
                                        String valor,
                                        Color color) {

        JPanel panel = new JPanel(new BorderLayout(0,15));
        panel.setBackground(color);

        panel.setBorder(
            BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(
                    new Color(255,165,0),2,true),
                BorderFactory.createEmptyBorder(
                    20,25,20,25)
            )
        );

        panel.setPreferredSize(
    new Dimension(
        250,
        120
    )
);

        JLabel labelTitulo = new JLabel(titulo);
        labelTitulo.setFont(new Font("Segoe UI Emoji", Font.PLAIN, 15));
        labelTitulo.setForeground(Color.WHITE);

        JLabel labelValor = new JLabel(valor);
        labelValor.setFont(new Font("Segoe UI Emoji", Font.BOLD, 28));
        labelValor.setForeground(new Color(255,255,120));

        panel.add(labelTitulo, BorderLayout.NORTH);
        panel.add(labelValor, BorderLayout.CENTER);

        return panel;
    }

    private JPanel crearCardFuncion(String icono, String titulo, String descripcion, boolean activo) {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBackground(new Color(45, 45, 45));
        panel.setBorder(BorderFactory.createLineBorder(new Color(100, 100, 100), 2));
        panel.setPreferredSize(new Dimension(380, 280));
        panel.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(100, 100, 100), 2),
            BorderFactory.createEmptyBorder(25,25,25,25)        
        ));

        JLabel labelIcono = new JLabel(icono, SwingConstants.CENTER);
        labelIcono.setFont(new Font("Segoe UI Emoji", Font.BOLD, 36));

        JLabel labelTitulo =
        new JLabel(titulo, SwingConstants.CENTER);

        labelTitulo.setFont(
        new Font("Segoe UI Emoji", Font.BOLD, 18));
        labelTitulo.setForeground(new Color(255, 200, 0));

        JLabel labelDescripcion =
        new JLabel(
            "<html><div style='text-align:center;'>"
            + descripcion +
            "</div></html>"
        );
        labelDescripcion.setFont(new Font("Segoe UI Emoji", Font.PLAIN, 12));
        labelDescripcion.setForeground(new Color(200, 200, 200));

        JPanel panelContenido = new JPanel(new BorderLayout());
        panelContenido.setBackground(new Color(45, 45, 45));
        panelContenido.add(labelIcono, BorderLayout.NORTH);
        panelContenido.add(labelTitulo, BorderLayout.CENTER);
        panelContenido.add(labelDescripcion, BorderLayout.SOUTH);

        panel.add(panelContenido, BorderLayout.CENTER);

        if (activo) {
            JButton btnIr = crearBoton("Ir", new Color(255, 165, 0));
            btnIr.addActionListener(e -> abrirSeleccionarMesa());
            panel.add(btnIr, BorderLayout.SOUTH);
        } else {
            JLabel labelDeshabilitado = new JLabel("Solo Operador");
            labelDeshabilitado.setFont(new Font("Segoe UI Emoji", Font.ITALIC, 11));
            labelDeshabilitado.setForeground(new Color(200, 100, 100));
            panel.add(labelDeshabilitado, BorderLayout.SOUTH);
        }

        return panel;
    }

    private void abrirSeleccionarMesa() {
        botonPedidoMesaAction.actionPerformed(null);
    }

    private JPanel crearPanelInferior() {
        JPanel panel = new JPanel();
        panel.setBackground(new Color(20, 20, 20));
        panel.setBorder(BorderFactory.createEmptyBorder(10, 20, 10, 20));

        JLabel labelInfo = new JLabel("Sistema Bocatto · Pedido Mesa (Mesero) · Pedido Operador · Pedido QR (Cliente) · Gestión de Pedidos");
        labelInfo.setFont(new Font("Segoe UI Emoji", Font.BOLD, 11));
        labelInfo.setForeground(new Color(100, 100, 100));

        panel.add(labelInfo);
        return panel;
    }

    private JButton crearBoton(String texto, Color color) {
        JButton boton = new JButton(texto);
        boton.setFont(new Font("Segoe UI Emoji", Font.BOLD, 13));
        boton.setBackground(color);
        boton.setForeground(Color.WHITE);
        boton.setBorderPainted(false);
        boton.setFocusPainted(false);
        boton.setPreferredSize(
        new Dimension(120, 42));        
        boton.setCursor(new Cursor(Cursor.HAND_CURSOR));

        boton.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseEntered(java.awt.event.MouseEvent e) {
                boton.setBackground(color.brighter());
            }

            public void mouseExited(java.awt.event.MouseEvent e) {
                boton.setBackground(color);
            }
        });

        return boton;
    }
}
