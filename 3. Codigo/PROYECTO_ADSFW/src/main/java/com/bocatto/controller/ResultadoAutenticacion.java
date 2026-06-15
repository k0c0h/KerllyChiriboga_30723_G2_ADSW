package com.bocatto.controller;

import com.bocatto.model.Usuario;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

public class ResultadoAutenticacion {

    private final boolean exitoso;
    private final Optional<Usuario> usuario;
    private final String mensajeError; // para mostrar en pantalla
    private final int intentosRestantes; // 0 cuando está bloqueado o no aplica
    private final LocalDateTime bloqueadoHasta; // null si no hay bloqueo

    // Constructor privado – usamos métodos fábrica
    private ResultadoAutenticacion(boolean exitoso, Optional<Usuario> usuario,
            String mensajeError, int intentosRestantes,
            LocalDateTime bloqueadoHasta) {
        this.exitoso = exitoso;
        this.usuario = usuario;
        this.mensajeError = mensajeError;
        this.intentosRestantes = intentosRestantes;
        this.bloqueadoHasta = bloqueadoHasta;
    }

    // Fábricas estáticas para los distintos casos
    public static ResultadoAutenticacion exito(Usuario usuario) {
        return new ResultadoAutenticacion(true, Optional.of(usuario), null, 0, null);
    }

    public static ResultadoAutenticacion fallo(String mensaje, int intentosRestantes,
            LocalDateTime bloqueadoHasta) {
        return new ResultadoAutenticacion(false, Optional.empty(), mensaje,
                intentosRestantes, bloqueadoHasta);
    }

    // Getters
    public boolean isExitoso() {
        return exitoso;
    }

    public Optional<Usuario> getUsuario() {
        return usuario;
    }

    public String getMensajeError() {
        return mensajeError;
    }

    public int getIntentosRestantes() {
        return intentosRestantes;
    }

    public LocalDateTime getBloqueadoHasta() {
        return bloqueadoHasta;
    }

    /** Devuelve el tiempo restante de bloqueo en un formato legible. */
    public String tiempoRestanteBloqueo() {
        if (bloqueadoHasta == null)
            return "";
        long segundos = ChronoUnit.SECONDS.between(LocalDateTime.now(), bloqueadoHasta);
        if (segundos <= 0)
            return "0s";
        long minutos = segundos / 60;
        long segs = segundos % 60;
        return String.format("%d min %d seg", minutos, segs);
    }
}