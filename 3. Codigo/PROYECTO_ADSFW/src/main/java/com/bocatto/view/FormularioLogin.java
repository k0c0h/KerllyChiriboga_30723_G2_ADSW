package com.bocatto.view;

import com.bocatto.controller.AuthController;
import com.bocatto.model.Usuario;
import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GradientPaint;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.RenderingHints;
import java.awt.event.FocusAdapter;
import java.awt.event.FocusEvent;
import java.util.Optional;
import javax.swing.BorderFactory;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.GroupLayout;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JSeparator;
import javax.swing.JTextField;
import javax.swing.UIManager;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;

public class FormularioLogin extends JFrame {

    private final AuthController authController;
    private JTextField txtUsuario;
    private JPasswordField txtContrasena;
    private JLabel lblUsuarioError;
    private JLabel lblContrasenaError;
    private JLabel lblEstado;

    public FormularioLogin(AuthController authController) {
        this.authController = authController;
        inicializarComponentes();
        configurarEventos();
    }

    private void inicializarComponentes() {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException | javax.swing.UnsupportedLookAndFeelException ex) {
            // Se conserva el look and feel por defecto si falla el sistema.
        }

        setTitle("Sistema Bocatto - Iniciar Sesión");
        setSize(1280, 780);
        setMinimumSize(new Dimension(1100, 700));
        setLocationRelativeTo(null);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setContentPane(new FondoDegradado());
        setLayout(new GridBagLayout());

        JPanel tarjeta = new JPanel();
        tarjeta.setPreferredSize(new Dimension(460, 450));
        tarjeta.setMaximumSize(new Dimension(460, 450));
        tarjeta.setBackground(new Color(41, 36, 34));
        tarjeta.setBorder(BorderFactory.createCompoundBorder(
                new LineBorder(new Color(66, 56, 52), 1, true),
                new EmptyBorder(28, 32, 24, 32)));

        JLabel lblTitulo = new JLabel("Iniciar Sesión");
        lblTitulo.setAlignmentX(Component.CENTER_ALIGNMENT);
        lblTitulo.setForeground(Color.WHITE);
        lblTitulo.setFont(new Font("SansSerif", Font.BOLD, 26));

        JLabel lblUsuario = crearEtiquetaCampo("Usuario");
        txtUsuario = crearCampoTexto();
        lblUsuarioError = crearError();

        JLabel lblContrasena = crearEtiquetaCampo("Contraseña");
        txtContrasena = crearCampoContrasena();
        lblContrasenaError = crearError();

        JButton btnIngresar = crearBotonPrincipal("Ingresar al Sistema");
        JButton btnCliente = crearBotonSecundario("Acceso Cliente (sin login)");
        lblEstado = new JLabel(" ");
        lblEstado.setAlignmentX(Component.CENTER_ALIGNMENT);
        lblEstado.setForeground(new Color(198, 198, 198));
        lblEstado.setFont(new Font("SansSerif", Font.PLAIN, 12));


        GroupLayout layout = new GroupLayout(tarjeta);
        tarjeta.setLayout(layout);
        layout.setAutoCreateGaps(false);
        layout.setAutoCreateContainerGaps(false);

        layout.setHorizontalGroup(
                layout.createParallelGroup(GroupLayout.Alignment.CENTER)
                        .addComponent(lblTitulo)
                        .addGroup(layout.createParallelGroup(GroupLayout.Alignment.LEADING)
                                .addComponent(lblUsuario)
                                .addComponent(txtUsuario)
                                .addComponent(lblUsuarioError)
                                .addComponent(lblContrasena)
                                .addComponent(txtContrasena)
                                .addComponent(lblContrasenaError)
                                .addComponent(btnIngresar)
                                .addComponent(btnCliente)
                                .addComponent(lblEstado)
        ));

        layout.setVerticalGroup(
                layout.createSequentialGroup()
                        .addComponent(lblTitulo)
                        .addGap(8)
                        .addComponent(lblUsuario)
                        .addGap(8)
                        .addComponent(txtUsuario, GroupLayout.PREFERRED_SIZE, 50, GroupLayout.PREFERRED_SIZE)
                        .addGap(4)
                        .addComponent(lblUsuarioError)
                        .addGap(18)
                        .addComponent(lblContrasena)
                        .addGap(8)
                        .addComponent(txtContrasena, GroupLayout.PREFERRED_SIZE, 50, GroupLayout.PREFERRED_SIZE)
                        .addGap(4)
                        .addComponent(lblContrasenaError)
                        .addGap(18)
                        .addComponent(btnIngresar, GroupLayout.PREFERRED_SIZE, 50, GroupLayout.PREFERRED_SIZE)
                        .addGap(12)
                        .addComponent(btnCliente, GroupLayout.PREFERRED_SIZE, 50, GroupLayout.PREFERRED_SIZE)
                        .addGap(14)
                        .addComponent(lblEstado)
                        .addGap(18)
        );

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.weightx = 1.0;
        gbc.weighty = 1.0;
        gbc.fill = GridBagConstraints.NONE;
        gbc.anchor = GridBagConstraints.CENTER;
        gbc.insets = new Insets(24, 24, 24, 24);
        add(tarjeta, gbc);

        btnIngresar.addActionListener(e -> autenticar());
        btnCliente.addActionListener(e -> accederComoCliente());
    }

    private void configurarEventos() {
        txtUsuario.addFocusListener(new FocusAdapter() {
            @Override
            public void focusLost(FocusEvent e) {
                validarUsuario();
            }
        });

        txtContrasena.addFocusListener(new FocusAdapter() {
            @Override
            public void focusLost(FocusEvent e) {
                validarContrasena();
            }
        });
    }

    private void autenticar() {
        boolean usuarioValido = validarUsuario();
        boolean contrasenaValida = validarContrasena();

        if (!usuarioValido || !contrasenaValida) {
            lblEstado.setText("Revise los datos del formulario.");
            return;
        }

        Optional<Usuario> usuario = authController.autenticar(
                txtUsuario.getText().trim(),
                new String(txtContrasena.getPassword()));

        if (usuario.isPresent()) {
            Usuario autenticado = usuario.get();
            lblEstado.setText("Ingreso correcto como " + autenticado.getRol() + ".");
            JOptionPane.showMessageDialog(
                    this,
                    "Bienvenido, " + autenticado.getNombreCompleto() + "\nRol: " + autenticado.getRol(),
                    "Acceso autorizado",
                    JOptionPane.INFORMATION_MESSAGE);
        } else {
            lblEstado.setText("Usuario o contraseña incorrectos.");
            JOptionPane.showMessageDialog(
                    this,
                    "Las credenciales no coinciden con los registros de prueba.",
                    "Acceso denegado",
                    JOptionPane.ERROR_MESSAGE);
        }
    }

    private void accederComoCliente() {
        lblEstado.setText("Ingreso como cliente sin autenticacion.");
        JOptionPane.showMessageDialog(
                this,
                "Se habilito el acceso de cliente invitado.",
                "Acceso cliente",
                JOptionPane.INFORMATION_MESSAGE);
    }

    private boolean validarUsuario() {
        String usuario = txtUsuario.getText().trim();
        if (usuario.isEmpty() || !usuario.matches("[a-zA-Z0-9._-]{3,20}")) {
            lblUsuarioError.setText("Usuario inválido (3-20 caracteres alfanuméricos).");
            return false;
        }
        lblUsuarioError.setText(" ");
        return true;
    }

    private boolean validarContrasena() {
        String contrasena = new String(txtContrasena.getPassword());
        if (contrasena.isEmpty() || contrasena.length() < 4) {
            lblContrasenaError.setText("Contraseña inválida (mín. 4 caracteres).");
            return false;
        }
        lblContrasenaError.setText(" ");
        return true;
    }

    private JLabel crearEtiquetaCampo(String texto) {
        JLabel etiqueta = new JLabel(texto);
        etiqueta.setForeground(new Color(228, 222, 219));
        etiqueta.setFont(new Font("SansSerif", Font.BOLD, 13));
        etiqueta.setAlignmentX(Component.LEFT_ALIGNMENT);
        return etiqueta;
    }

    private JLabel crearError() {
        JLabel error = new JLabel(" ");
        error.setForeground(new Color(230, 87, 87));
        error.setFont(new Font("SansSerif", Font.PLAIN, 11));
        error.setAlignmentX(Component.LEFT_ALIGNMENT);
        return error;
    }

    private JTextField crearCampoTexto() {
        JTextField campo = new JTextField();
        configurarCampo(campo);
        return campo;
    }

    private JPasswordField crearCampoContrasena() {
        JPasswordField campo = new JPasswordField();
        configurarCampo(campo);
        return campo;
    }

    private void configurarCampo(JComponent campo) {
        campo.setMaximumSize(new Dimension(Integer.MAX_VALUE, 50));
        campo.setBorder(BorderFactory.createCompoundBorder(
                new LineBorder(new Color(113, 97, 91), 1, true),
                new EmptyBorder(12, 14, 12, 14)));
        campo.setBackground(new Color(67, 59, 55));
        campo.setForeground(new Color(240, 236, 233));
        campo.setFont(new Font("SansSerif", Font.PLAIN, 14));
        campo.setAlignmentX(Component.LEFT_ALIGNMENT);
    }

    private JButton crearBotonPrincipal(String texto) {
        JButton boton = crearBotonBase(texto, new Color(255, 162, 0), new Color(45, 29, 0), new Color(255, 177, 49));
        boton.setFont(new Font("SansSerif", Font.BOLD, 15));
        return boton;
    }

    private JButton crearBotonSecundario(String texto) {
        JButton boton = crearBotonBase(texto, new Color(37, 88, 99), new Color(193, 245, 255), new Color(52, 116, 128));
        boton.setFont(new Font("SansSerif", Font.BOLD, 14));
        return boton;
    }

    private JButton crearBotonBase(String texto, Color fondo, Color frente, Color hover) {
        JButton boton = new JButton(texto);
        boton.setAlignmentX(Component.LEFT_ALIGNMENT);
        boton.setMaximumSize(new Dimension(Integer.MAX_VALUE, 50));
        boton.setBackground(fondo);
        boton.setForeground(frente);
        boton.setFocusPainted(false);
        boton.setBorder(BorderFactory.createEmptyBorder(12, 16, 12, 16));
        boton.setOpaque(true);
        boton.setContentAreaFilled(true);
        boton.setBorderPainted(false);

        boton.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override
            public void mouseEntered(java.awt.event.MouseEvent e) {
                boton.setBackground(hover);
            }

            @Override
            public void mouseExited(java.awt.event.MouseEvent e) {
                boton.setBackground(fondo);
            }
        });

        return boton;
    }

    private JPanel crearTarjetasDemo() {
        JPanel contenedor = new JPanel();
        contenedor.setOpaque(false);
        contenedor.setLayout(new java.awt.GridLayout(1, 2, 12, 0));

        contenedor.add(crearTarjetaDemo("Mesero", "mesero", new Color(65, 127, 255)));
        contenedor.add(crearTarjetaDemo("Operador", "operador", new Color(0, 214, 122)));

        return contenedor;
    }

    private JPanel crearTarjetaDemo(String titulo, String usuario, Color acento) {
        JPanel tarjeta = new JPanel();
        tarjeta.setBackground(new Color(58, 51, 48));
        tarjeta.setBorder(BorderFactory.createCompoundBorder(
                new LineBorder(new Color(76, 68, 64), 1, true),
                new EmptyBorder(10, 12, 10, 12)));
        tarjeta.setLayout(new BoxLayout(tarjeta, BoxLayout.Y_AXIS));

        JLabel lblTitulo = new JLabel(titulo);
        lblTitulo.setAlignmentX(Component.CENTER_ALIGNMENT);
        lblTitulo.setForeground(acento);
        lblTitulo.setFont(new Font("SansSerif", Font.BOLD, 13));

        JLabel lblUsuario = new JLabel(usuario);
        lblUsuario.setAlignmentX(Component.CENTER_ALIGNMENT);
        lblUsuario.setForeground(new Color(210, 204, 200));
        lblUsuario.setFont(new Font("SansSerif", Font.PLAIN, 12));

        tarjeta.add(lblTitulo);
        tarjeta.add(Box.createVerticalStrut(2));
        tarjeta.add(lblUsuario);
        return tarjeta;
    }

    private static class FondoDegradado extends JPanel {

        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
            GradientPaint paint = new GradientPaint(
                    0, 0, new Color(37, 14, 7),
                    getWidth(), getHeight(), new Color(120, 54, 10));
            g2.setPaint(paint);
            g2.fillRect(0, 0, getWidth(), getHeight());

            g2.setComposite(AlphaComposite.SrcOver.derive(0.10f));
            g2.setColor(Color.BLACK);
            g2.fillOval(-120, -70, 420, 420);
            g2.fillOval(getWidth() - 260, getHeight() - 250, 360, 360);
            g2.dispose();
        }
    }
}
