package com.bocatto;

import com.bocatto.controller.AuthController;
import com.bocatto.repository.UsuarioRepositoryMemoria;
import com.bocatto.view.FormularioLogin;

public class Main {

    public static void main(String[] args) {
        UsuarioRepositoryMemoria repositorio = new UsuarioRepositoryMemoria();
        AuthController authController = new AuthController(repositorio);

        java.awt.EventQueue.invokeLater(() -> {
            new FormularioLogin(authController).setVisible(true);
        });
    }
}
