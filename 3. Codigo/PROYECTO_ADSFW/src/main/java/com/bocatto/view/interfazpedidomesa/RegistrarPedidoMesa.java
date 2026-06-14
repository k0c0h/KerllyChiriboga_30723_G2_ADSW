package com.bocatto.view.interfazpedidomesa;

import java.awt.*;
import java.util.HashMap;
import java.util.Map;
import javax.swing.*;
import javax.swing.border.EmptyBorder;

public class RegistrarPedidoMesa extends JFrame {
    private String nombreMesero;
    private int mesaSeleccionada;
    private Map<String, java.util.List<JPanel>> productosMap;

    public RegistrarPedidoMesa(String nombreMesero, int mesaSeleccionada) {
        this.nombreMesero = nombreMesero;
        this.mesaSeleccionada = mesaSeleccionada;
        this.productosMap = new HashMap<>();
        inicializarComponentes();
    }

    private void inicializarComponentes() {
        setTitle("Registrar Pedido - Mesa " + mesaSeleccionada);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setSize(1400, 800);
        setLocationRelativeTo(null);
        setResizable(false);

        JPanel panelPrincipal = new JPanel(new BorderLayout());
        panelPrincipal.setBackground(new Color(30, 30, 30));
        panelPrincipal.add(crearPanelSuperior(), BorderLayout.NORTH);
        panelPrincipal.add(crearPanelProductos(), BorderLayout.CENTER);
        panelPrincipal.add(crearPanelInferior(), BorderLayout.SOUTH);
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

        JLabel labelTitulo = new JLabel("Registrar Pedido · Mesa " + mesaSeleccionada);
        labelTitulo.setFont(new Font("Arial", Font.BOLD, 24));
        labelTitulo.setForeground(new Color(255, 255, 255));

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
        btnTotal.setPreferredSize(new Dimension(120, 40));
        btnTotal.setEnabled(false);

        panelDerecho.add(labelUsuario);
        panelDerecho.add(btnTotal);
        panel.add(panelIzquierdo, BorderLayout.WEST);
        panel.add(panelDerecho, BorderLayout.EAST);
        return panel;
    }

    private JPanel crearPanelProductos() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(new Color(30, 30, 30));
        panel.setBorder(new EmptyBorder(30, 40, 30, 40));

        JPanel panelCategorias = new JPanel(new FlowLayout(FlowLayout.LEFT, 15, 15));
        panelCategorias.setBackground(new Color(30, 30, 30));

        String[] categorias = {"Entradas", "Platos Fuertes", "Pizzas", "Postres", "Bebidas"};
        for (String categoria : categorias) {
            panelCategorias.add(crearBotonCategoria(categoria, categoria.equals("Entradas")));
        }

        JPanel panelProductosScroll = new JPanel();
        panelProductosScroll.setBackground(new Color(30, 30, 30));
        panelProductosScroll.setLayout(new BoxLayout(panelProductosScroll, BoxLayout.Y_AXIS));
        panelProductosScroll.add(crearProducto("Bruschetta al Tomate", "Pan tostado con tomate y albahaca", "$5.50"));
        panelProductosScroll.add(crearProducto("Tabla de Quesos", "Selección de quesos artesanales", "$8.00"));
        panelProductosScroll.add(crearProducto("Calamares a la Romana", "Calamares fritos con alioli", "$7.50"));

        JScrollPane scrollPane = new JScrollPane(panelProductosScroll);
        scrollPane.setBackground(new Color(30, 30, 30));
        scrollPane.setBorder(BorderFactory.createEmptyBorder());
        scrollPane.getViewport().setBackground(new Color(30, 30, 30));
        scrollPane.getVerticalScrollBar().setBackground(new Color(50, 50, 50));
        scrollPane.getVerticalScrollBar().setUI(new javax.swing.plaf.basic.BasicScrollBarUI() {
            @Override
            protected void configureScrollBarColors() {
                this.thumbColor = new Color(100, 100, 100);
            }
        });

        panel.add(panelCategorias, BorderLayout.NORTH);
        panel.add(scrollPane, BorderLayout.CENTER);
        return panel;
    }

    private JPanel crearProducto(String nombre, String descripcion, String precio) {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(new Color(30, 30, 30));
        panel.setBorder(BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(60, 60, 60)));
        panel.setBorder(new EmptyBorder(25, 25, 25, 25));
        panel.setMaximumSize(new Dimension(Integer.MAX_VALUE, 130));

        JPanel panelInfo = new JPanel(new BorderLayout());
        panelInfo.setBackground(new Color(30, 30, 30));

        JLabel labelNombre = new JLabel(nombre);
        labelNombre.setFont(new Font("Arial", Font.BOLD, 15));
        labelNombre.setForeground(new Color(255, 255, 255));

        JLabel labelDescripcion = new JLabel(descripcion);
        labelDescripcion.setFont(new Font("Arial", Font.PLAIN, 13));
        labelDescripcion.setForeground(new Color(150, 150, 150));

        JPanel panelTexto = new JPanel(new BorderLayout());
        panelTexto.setBackground(new Color(30, 30, 30));
        panelTexto.add(labelNombre, BorderLayout.NORTH);
        panelTexto.add(labelDescripcion, BorderLayout.CENTER);

        JLabel labelPrecio = new JLabel(precio);
        labelPrecio.setFont(new Font("Arial", Font.BOLD, 16));
        labelPrecio.setForeground(new Color(255, 165, 0));

        JButton btnAgregar = new JButton("+");
        btnAgregar.setFont(new Font("Arial", Font.BOLD, 22));
        btnAgregar.setBackground(new Color(255, 165, 0));
        btnAgregar.setForeground(Color.BLACK);
        btnAgregar.setBorderPainted(false);
        btnAgregar.setFocusPainted(false);
        btnAgregar.setPreferredSize(new Dimension(60, 60));
        btnAgregar.setCursor(new Cursor(Cursor.HAND_CURSOR));

        btnAgregar.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseEntered(java.awt.event.MouseEvent e) {
                btnAgregar.setBackground(new Color(255, 200, 0));
            }

            public void mouseExited(java.awt.event.MouseEvent e) {
                btnAgregar.setBackground(new Color(255, 165, 0));
            }
        });

        JPanel panelDerechos = new JPanel(new FlowLayout(FlowLayout.RIGHT, 20, 0));
        panelDerechos.setBackground(new Color(30, 30, 30));
        panelDerechos.add(labelPrecio);
        panelDerechos.add(btnAgregar);

        panel.add(panelTexto, BorderLayout.WEST);
        panel.add(panelDerechos, BorderLayout.EAST);
        return panel;
    }

    private JButton crearBotonCategoria(String nombre, boolean seleccionado) {
        JButton boton = new JButton(nombre);
        boton.setFont(new Font("Arial", Font.BOLD, 12));
        if (seleccionado) {
            boton.setBackground(new Color(255, 165, 0));
            boton.setForeground(Color.BLACK);
        } else {
            boton.setBackground(new Color(70, 70, 70));
            boton.setForeground(new Color(220, 220, 220));
        }

        boton.setBorderPainted(true);
        boton.setBorder(BorderFactory.createLineBorder(
            seleccionado ? new Color(255, 200, 0) : new Color(90, 90, 90), 2
        ));
        boton.setFocusPainted(false);
        boton.setPreferredSize(new Dimension(120, 40));
        boton.setCursor(new Cursor(Cursor.HAND_CURSOR));

        boton.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseEntered(java.awt.event.MouseEvent e) {
                if (!boton.getBackground().equals(new Color(255, 165, 0))) {
                    boton.setBackground(new Color(100, 100, 100));
                    boton.setForeground(new Color(255, 255, 255));
                }
            }

            public void mouseExited(java.awt.event.MouseEvent e) {
                if (!boton.getBackground().equals(new Color(255, 165, 0))) {
                    boton.setBackground(new Color(70, 70, 70));
                    boton.setForeground(new Color(220, 220, 220));
                }
            }
        });
        return boton;
    }

    private JPanel crearPanelInferior() {
        JPanel panel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 15, 15));
        panel.setBackground(new Color(30, 30, 30));
        panel.setBorder(BorderFactory.createMatteBorder(1, 0, 0, 0, new Color(60, 60, 60)));

        JButton btnCancelar = crearBotonAccion("Cancelar", new Color(100, 100, 100));
        btnCancelar.addActionListener(e -> dispose());

        JButton btnEnviar = crearBotonAccion("Enviar a Cocina", new Color(50, 150, 50));

        panel.add(btnCancelar);
        panel.add(btnEnviar);
        return panel;
    }

    private JButton crearBotonAccion(String texto, Color color) {
        JButton boton = new JButton(texto);
        boton.setFont(new Font("Arial", Font.BOLD, 14));
        boton.setBackground(color);
        boton.setForeground(Color.WHITE);
        boton.setBorderPainted(false);
        boton.setFocusPainted(false);
        boton.setPreferredSize(new Dimension(150, 40));
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

    private JButton crearBotonAtras() {
        JButton boton = new JButton("< Atrás");
        boton.setFont(new Font("Arial", Font.PLAIN, 12));
        boton.setBackground(new Color(80, 80, 80));
        boton.setForeground(Color.WHITE);
        boton.setBorderPainted(true);
        boton.setBorder(BorderFactory.createLineBorder(new Color(100, 100, 100), 1));
        boton.setFocusPainted(false);
        boton.setPreferredSize(new Dimension(80, 35));
        boton.setCursor(new Cursor(Cursor.HAND_CURSOR));

        boton.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseEntered(java.awt.event.MouseEvent e) {
                boton.setBackground(new Color(120, 120, 120));
            }

            public void mouseExited(java.awt.event.MouseEvent e) {
                boton.setBackground(new Color(80, 80, 80));
            }
        });
        return boton;
    }
}
