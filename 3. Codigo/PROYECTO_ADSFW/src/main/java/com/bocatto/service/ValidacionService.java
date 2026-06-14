package com.bocatto.service;

import com.bocatto.model.Pedido;
import java.util.ArrayList;
import java.util.List;

public class ValidacionService {

    public List<String> validarPedido(Pedido pedido) {
        List<String> errores = new ArrayList<>();

        if (pedido.getCliente() == null) {
            errores.add("El cliente es obligatorio.");
        }

        if (pedido.getItems().isEmpty()) {
            errores.add("El pedido debe contener al menos un item.");
        }

        if (pedido.getTipoEntrega() == null || pedido.getTipoEntrega().trim().isEmpty()) {
            errores.add("El tipo de entrega es obligatorio.");
        }

        return errores;
    }

    public List<String> validarCredenciales(String usuario, String contrasena) {
        List<String> errores = new ArrayList<>();

        if (usuario == null || usuario.trim().isEmpty()) {
            errores.add("El usuario es obligatorio.");
        } else if (!usuario.matches("[a-zA-Z0-9._-]{3,20}")) {
            errores.add("El usuario debe tener entre 3 y 20 caracteres alfanuméricos.");
        }

        if (contrasena == null || contrasena.isEmpty()) {
            errores.add("La contraseña es obligatoria.");
        } else if (contrasena.length() < 4) {
            errores.add("La contraseña debe tener al menos 4 caracteres.");
        }

        return errores;
    }
}
