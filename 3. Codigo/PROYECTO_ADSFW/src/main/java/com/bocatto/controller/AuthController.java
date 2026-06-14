package com.bocatto.controller;

import com.bocatto.model.Usuario;
import com.bocatto.repository.UsuarioRepository;
import com.bocatto.service.ValidacionService;
import java.util.List;
import java.util.Optional;

public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final ValidacionService validacionService;

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
        this.validacionService = new ValidacionService();
    }

    public Optional<Usuario> autenticar(String usuario, String contrasena) {
        List<String> errores = validacionService.validarCredenciales(usuario, contrasena);
        if (!errores.isEmpty()) {
            return Optional.empty();
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.buscarPorUsuario(usuario);
        if (usuarioOpt.isPresent()) {
            Usuario usuarioEncontrado = usuarioOpt.get();
            if (usuarioEncontrado.getContrasena().equals(contrasena) && usuarioEncontrado.isActivo()) {
                return Optional.of(usuarioEncontrado);
            }
        }

        return Optional.empty();
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.listar();
    }

    public Optional<Usuario> obtenerPorId(String id) {
        return usuarioRepository.buscarPorId(id);
    }
}
