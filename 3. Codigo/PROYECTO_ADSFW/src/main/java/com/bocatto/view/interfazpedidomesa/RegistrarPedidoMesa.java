package com.bocatto.view.interfazpedidomesa;

import com.bocatto.controller.PedidoController;
import com.bocatto.model.*;
import com.bocatto.model.Menu;
import com.bocatto.repository.MenuRepository;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class RegistrarPedidoMesa extends JFrame {

    private String nombreMesero;
    private int mesaSeleccionada;
    private MenuRepository menuRepository;
    private PedidoController pedidoController;

    private Map<String, List<JPanel>> categoriasPanels;
    private JPanel panelProductos;
    private JPanel panelCarrito;
    private JLabel labelTotalCarrito;
    private JTextArea areaObservaciones;
    private JButton btnEnviar;

    private List<ItemPedido> carrito = new ArrayList<>();
    private Map<Menu, JLabel> cantidadesLabels = new HashMap<>();

    private PedidoBuilder pedidoBuilder = new PedidoBuilder();
    private MenuPrototypeRegistry menuPrototypeRegistry = new MenuPrototypeRegistry();

    public RegistrarPedidoMesa(String nombreMesero, int mesaSeleccionada,
            MenuRepository menuRepository, PedidoController pedidoController) {
        this.nombreMesero = nombreMesero;
        this.mesaSeleccionada = mesaSeleccionada;
        this.menuRepository = menuRepository;
        this.pedidoController = pedidoController;
        this.categoriasPanels = new HashMap<>();

        for (Menu menu : menuRepository.listar()) {
            menuPrototypeRegistry.agregarPrototipo(menu.getId(), menu);
        }

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
        panelPrincipal.add(crearPanelCentral(), BorderLayout.CENTER);
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
        labelTitulo.setForeground(Color.WHITE);

        panelIzquierdo.add(btnAtras);
        panelIzquierdo.add(labelTitulo);

        JPanel panelDerecho = new JPanel(new FlowLayout(FlowLayout.RIGHT, 15, 0));
        panelDerecho.setBackground(new Color(30, 30, 30));

        JLabel labelUsuario = new JLabel("RF-01 · " + nombreMesero);
        labelUsuario.setFont(new Font("Arial", Font.PLAIN, 14));
        labelUsuario.setForeground(new Color(200, 150, 100));

        panelDerecho.add(labelUsuario);
        panel.add(panelIzquierdo, BorderLayout.WEST);
        panel.add(panelDerecho, BorderLayout.EAST);
        return panel;
    }

    private JPanel crearPanelCentral() {
        JPanel panelCentral = new JPanel(new BorderLayout(10, 0));
        panelCentral.setBackground(new Color(30, 30, 30));
        panelCentral.setBorder(new EmptyBorder(10, 20, 10, 20));

        // Panel izquierdo: categorías y productos
        JPanel panelIzquierdo = new JPanel(new BorderLayout());
        panelIzquierdo.setBackground(new Color(30, 30, 30));

        // Botones de categoría
        JPanel panelCategorias = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 10));
        panelCategorias.setBackground(new Color(30, 30, 30));
        List<String> categorias = menuRepository.listarCategorias();
        for (String cat : categorias) {
            JButton btnCat = crearBotonCategoria(cat);
            btnCat.addActionListener(e -> mostrarProductosCategoria(cat));
            panelCategorias.add(btnCat);
        }
        panelIzquierdo.add(panelCategorias, BorderLayout.NORTH);

        // Panel de productos (scroll)
        panelProductos = new JPanel();
        panelProductos.setLayout(new BoxLayout(panelProductos, BoxLayout.Y_AXIS));
        panelProductos.setBackground(new Color(30, 30, 30));

        JScrollPane scrollProductos = new JScrollPane(panelProductos);
        scrollProductos.setBorder(BorderFactory.createEmptyBorder());
        scrollProductos.getViewport().setBackground(new Color(30, 30, 30));
        scrollProductos.setPreferredSize(new Dimension(750, 0));

        panelIzquierdo.add(scrollProductos, BorderLayout.CENTER);
        panelCentral.add(panelIzquierdo, BorderLayout.CENTER);

        // Panel derecho: carrito
        JPanel panelDerecho = crearPanelCarrito();
        panelDerecho.setPreferredSize(new Dimension(400, 0));
        panelCentral.add(panelDerecho, BorderLayout.EAST);

        return panelCentral;
    }

    private void mostrarProductosCategoria(String categoria) {
        panelProductos.removeAll();
        List<Menu> productos = menuRepository.buscarPorCategoria(categoria);
        for (Menu menu : productos) {
            panelProductos.add(crearPanelProducto(menu));
        }
        panelProductos.revalidate();
        panelProductos.repaint();
    }
    
    private JPanel crearPanelProducto(Menu menu) {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(new Color(30, 30, 30));
        panel.setBorder(BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(60, 60, 60)));
        panel.setBorder(new EmptyBorder(15, 15, 15, 15));
        panel.setMaximumSize(new Dimension(Integer.MAX_VALUE, 100));

        JPanel panelInfo = new JPanel(new BorderLayout());
        panelInfo.setBackground(new Color(30, 30, 30));

        JLabel lblNombre = new JLabel(menu.getNombre());
        lblNombre.setFont(new Font("Arial", Font.BOLD, 15));
        lblNombre.setForeground(Color.WHITE);

        JLabel lblDescripcion = new JLabel(menu.getDescripcion());
        lblDescripcion.setFont(new Font("Arial", Font.PLAIN, 12));
        lblDescripcion.setForeground(new Color(150, 150, 150));

        JLabel lblPrecio = new JLabel("$" + menu.getPrecio());
        lblPrecio.setFont(new Font("Arial", Font.BOLD, 14));
        lblPrecio.setForeground(new Color(255, 165, 0));

        panelInfo.add(lblNombre, BorderLayout.NORTH);
        panelInfo.add(lblDescripcion, BorderLayout.CENTER);

        JPanel panelAcciones = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        panelAcciones.setBackground(new Color(30, 30, 30));

        JButton btnAgregar = new JButton("+ Agregar");
        btnAgregar.setFont(new Font("Arial", Font.BOLD, 13));
        btnAgregar.setBackground(new Color(255, 165, 0));
        btnAgregar.setForeground(Color.BLACK);
        btnAgregar.setFocusPainted(false);
        btnAgregar.setBorderPainted(false);
        btnAgregar.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));

        btnAgregar.addActionListener(e -> agregarAlCarrito(menu));

        panelAcciones.add(lblPrecio);
        panelAcciones.add(btnAgregar);

        panel.add(panelInfo, BorderLayout.WEST);
        panel.add(panelAcciones, BorderLayout.EAST);
        return panel;
    }

    private JPanel crearPanelCarrito() {
        JPanel panel = new JPanel(new BorderLayout(0, 10));
        panel.setBackground(new Color(45, 45, 45));
        panel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(100, 100, 100), 2),
                new EmptyBorder(15, 15, 15, 15)));

        JLabel lblTitulo = new JLabel("🛒 Carrito");
        lblTitulo.setFont(new Font("Arial", Font.BOLD, 18));
        lblTitulo.setForeground(Color.WHITE);

        panelCarrito = new JPanel();
        panelCarrito.setLayout(new BoxLayout(panelCarrito, BoxLayout.Y_AXIS));
        panelCarrito.setBackground(new Color(45, 45, 45));

        JScrollPane scrollCarrito = new JScrollPane(panelCarrito);
        scrollCarrito.setBorder(BorderFactory.createEmptyBorder());
        scrollCarrito.getViewport().setBackground(new Color(45, 45, 45));
        scrollCarrito.setPreferredSize(new Dimension(380, 200));

        // Observaciones generales
        JPanel panelObservaciones = new JPanel(new BorderLayout());
        panelObservaciones.setBackground(new Color(45, 45, 45));
        JLabel lblObs = new JLabel("Observaciones:");
        lblObs.setForeground(Color.WHITE);
        areaObservaciones = new JTextArea(3, 20);
        areaObservaciones.setBackground(new Color(60, 60, 60));
        areaObservaciones.setForeground(Color.WHITE);
        areaObservaciones.setLineWrap(true);
        areaObservaciones.setWrapStyleWord(true);
        JScrollPane scrollObs = new JScrollPane(areaObservaciones);
        scrollObs.setBorder(BorderFactory.createEmptyBorder());
        panelObservaciones.add(lblObs, BorderLayout.NORTH);
        panelObservaciones.add(scrollObs, BorderLayout.CENTER);

        // Total
        JPanel panelTotal = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        panelTotal.setBackground(new Color(45, 45, 45));
        labelTotalCarrito = new JLabel("Total: $0.00");
        labelTotalCarrito.setFont(new Font("Arial", Font.BOLD, 16));
        labelTotalCarrito.setForeground(new Color(255, 165, 0));
        panelTotal.add(labelTotalCarrito);

        panel.add(lblTitulo, BorderLayout.NORTH);
        panel.add(scrollCarrito, BorderLayout.CENTER);
        panel.add(panelObservaciones, BorderLayout.SOUTH);
        panel.add(panelTotal, BorderLayout.SOUTH);

        return panel;
    }

    private void agregarAlCarrito(Menu menu) {
        // Preguntar cantidad y observación (opcional)
        JTextField txtCantidad = new JTextField("1");
        JTextField txtObs = new JTextField();

        JPanel panel = new JPanel(new GridLayout(0, 1));
        panel.add(new JLabel("Cantidad:"));
        panel.add(txtCantidad);
        panel.add(new JLabel("Observación (opcional):"));
        panel.add(txtObs);

        int result = JOptionPane.showConfirmDialog(this, panel, "Agregar " + menu.getNombre(),
                JOptionPane.OK_CANCEL_OPTION, JOptionPane.PLAIN_MESSAGE);
        if (result == JOptionPane.OK_OPTION) {
            int cantidad;
            try {
                cantidad = Integer.parseInt(txtCantidad.getText().trim());
                if (cantidad <= 0)
                    throw new NumberFormatException();
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(this, "Cantidad inválida.", "Error", JOptionPane.ERROR_MESSAGE);
                return;
            }
            String observacion = txtObs.getText().trim();
            if (observacion.isEmpty())
                observacion = "";

            // Clonar el menú usando el prototipo registrado
            Menu clon = menuPrototypeRegistry.obtenerClon(menu.getId());
            ItemPedido item = new ItemPedido(clon, cantidad, observacion);
            carrito.add(item);
            actualizarCarrito();
        }
    }

    private void actualizarCarrito() {
        panelCarrito.removeAll();
        cantidadesLabels.clear();

        for (ItemPedido item : carrito) {
            JPanel itemPanel = new JPanel(new BorderLayout());
            itemPanel.setBackground(new Color(45, 45, 45));
            itemPanel.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5));
            itemPanel.setMaximumSize(new Dimension(Integer.MAX_VALUE, 40));

            String texto = item.getMenu().getNombre() + " x" + item.getCantidad();
            if (!item.getObservacion().isEmpty()) {
                texto += " (" + item.getObservacion() + ")";
            }
            JLabel lblItem = new JLabel(texto);
            lblItem.setForeground(Color.WHITE);
            lblItem.setFont(new Font("Arial", Font.PLAIN, 13));

            JButton btnEliminar = new JButton("X");
            btnEliminar.setFont(new Font("Arial", Font.BOLD, 10));
            btnEliminar.setBackground(Color.RED);
            btnEliminar.setForeground(Color.WHITE);
            btnEliminar.setBorderPainted(false);
            btnEliminar.setFocusPainted(false);
            btnEliminar.setMargin(new Insets(0, 5, 0, 5));
            btnEliminar.addActionListener(e -> {
                carrito.remove(item);
                actualizarCarrito();
            });

            itemPanel.add(lblItem, BorderLayout.CENTER);
            itemPanel.add(btnEliminar, BorderLayout.EAST);
            panelCarrito.add(itemPanel);
        }

        // Actualizar total
        BigDecimal total = carrito.stream()
                .map(item -> item.getMenu().getPrecio().multiply(BigDecimal.valueOf(item.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        labelTotalCarrito.setText("Total: $" + total);

        panelCarrito.revalidate();
        panelCarrito.repaint();

        // Habilitar/deshabilitar botón enviar según si hay items
        btnEnviar.setEnabled(!carrito.isEmpty());
    }

    private JButton crearBotonCategoria(String nombre) {
        JButton boton = new JButton(nombre);
        boton.setFont(new Font("Arial", Font.BOLD, 12));
        boton.setBackground(new Color(70, 70, 70));
        boton.setForeground(new Color(220, 220, 220));
        boton.setBorder(BorderFactory.createLineBorder(new Color(90, 90, 90), 2));
        boton.setFocusPainted(false);
        boton.setPreferredSize(new Dimension(120, 40));
        boton.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        boton.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseEntered(java.awt.event.MouseEvent e) {
                boton.setBackground(new Color(100, 100, 100));
            }

            public void mouseExited(java.awt.event.MouseEvent e) {
                boton.setBackground(new Color(70, 70, 70));
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

        btnEnviar = crearBotonAccion("Enviar a Cocina", new Color(50, 150, 50));
        btnEnviar.setEnabled(false); // inicialmente deshabilitado
        btnEnviar.addActionListener(e -> enviarPedido());

        panel.add(btnCancelar);
        panel.add(btnEnviar);
        return panel;
    }

    private void enviarPedido() {
        if (carrito.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Agregue al menos un producto.", "Pedido vacío",
                    JOptionPane.WARNING_MESSAGE);
            return;
        }

        // Crear cliente para la mesa
        Cliente clienteMesa = new Cliente("mesa-" + mesaSeleccionada, "Mesa " + mesaSeleccionada, "", "", "");

        // Usar el builder
        pedidoBuilder.withCliente(clienteMesa)
                .withTipoEntrega("Mesa")
                .withNumeroMesa(mesaSeleccionada)
                .withObservaciones(areaObservaciones.getText().trim())
                .withUsuarioAsignado(nombreMesero);

        for (ItemPedido item : carrito) {
            pedidoBuilder.agregarItem(item);
        }

        try {
            Pedido pedido = pedidoBuilder.build();
            boolean creado = pedidoController.crearPedido(pedido);
            if (creado) {
                JOptionPane.showMessageDialog(this,
                        "Pedido registrado correctamente.\nID: " + pedido.getId(),
                        "Éxito",
                        JOptionPane.INFORMATION_MESSAGE);
                dispose();
            } else {
                JOptionPane.showMessageDialog(this,
                        "El pedido no pudo ser registrado. Revise los datos.",
                        "Error",
                        JOptionPane.ERROR_MESSAGE);
            }
        } catch (IllegalStateException ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage(), "Error de validación", JOptionPane.ERROR_MESSAGE);
        }
    }

    private JButton crearBotonAccion(String texto, Color color) {
        JButton boton = new JButton(texto);
        boton.setFont(new Font("Arial", Font.BOLD, 14));
        boton.setBackground(color);
        boton.setForeground(Color.WHITE);
        boton.setBorderPainted(false);
        boton.setFocusPainted(false);
        boton.setPreferredSize(new Dimension(150, 40));
        boton.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
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
        boton.setBorder(BorderFactory.createLineBorder(new Color(100, 100, 100), 1));
        boton.setFocusPainted(false);
        boton.setPreferredSize(new Dimension(80, 35));
        boton.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
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