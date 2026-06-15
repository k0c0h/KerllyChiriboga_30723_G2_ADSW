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

    public ResultadoAutenticacion autenticar(String usuario, String contrasena) {
        List<String> errores = validacionService.validarCredenciales(usuario, contrasena);
        if (!errores.isEmpty()) {
            return ResultadoAutenticacion.fallo(errores.get(0), 3, null);
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.buscarPorUsuario(usuario);
        if (usuarioOpt.isEmpty()) {
            return ResultadoAutenticacion.fallo("Credenciales Incorrectas.", 3, null);
        }

        Usuario usuarioEncontrado = usuarioOpt.get();

        //check if the user is locked out
        if (usuarioEncontrado.getTiempoDesbloqueo() != null
                && usuarioEncontrado.getTiempoDesbloqueo().isAfter(java.time.LocalDateTime.now())) {
                return ResultadoAutenticacion.fallo("Usuario bloqueado. Intente nuevamente en "
                        + usuarioEncontrado.tiempoRestanteBloqueo(), 0, usuarioEncontrado.getTiempoDesbloqueo());
        }
        
        // validate credentials and active status
        if (usuarioEncontrado.getContrasena().equals(contrasena) && usuarioEncontrado.isActivo()) {
            // reset failed attempts on successful login
            usuarioEncontrado.setIntentosFallidos(0);
            usuarioEncontrado.setTiempoDesbloqueo(null);
            usuarioRepository.actualizar(usuarioEncontrado);
            return ResultadoAutenticacion.exito(usuarioEncontrado);
        } else {
            // increment failed attempts
            int intentosFallidos = usuarioEncontrado.getIntentosFallidos() + 1;
            usuarioEncontrado.setIntentosFallidos(intentosFallidos);

            // lock the user if max attempts reached
            if (intentosFallidos >= 3) {
                usuarioEncontrado.setTiempoDesbloqueo(java.time.LocalDateTime.now().plusMinutes(5));
            }

            usuarioRepository.actualizar(usuarioEncontrado);

            // calculate remaining attempts
            int intentosRestantes = Math.max(0, 3 - intentosFallidos);
            if (usuarioEncontrado.getTiempoDesbloqueo() != null) {
                intentosRestantes = 0; // user is locked, no attempts left
            }

            String mensaje;

            if (usuarioEncontrado.getTiempoDesbloqueo() != null) {
                mensaje = "Usuario bloqueado. Intente nuevamente en " + usuarioEncontrado.tiempoRestanteBloqueo();
            } else {
                mensaje = "Contraseña Incorrecta. Intentos restantes: " + intentosRestantes;
            }
            return ResultadoAutenticacion.fallo(mensaje, intentosRestantes, usuarioEncontrado.getTiempoDesbloqueo());
        }

    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.listar();
    }

    public Optional<Usuario> obtenerPorId(String id) {
        return usuarioRepository.buscarPorId(id);
    }
}
