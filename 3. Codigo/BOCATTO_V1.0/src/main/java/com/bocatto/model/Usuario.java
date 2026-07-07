package com.bocatto.model;

import java.time.LocalDateTime;

public class Usuario {

    private String id;
    private String usuario;
    private String contrasena;
    private String nombreCompleto;
    private String rol;
    private boolean activo;
    
    private int intentosFallidos;

    private LocalDateTime tiempoDesbloqueo;

    public Usuario(String id, String usuario, String contrasena, String nombreCompleto, String rol, boolean activo) {
        this.id = id;
        this.usuario = usuario;
        this.contrasena = contrasena;
        this.nombreCompleto = nombreCompleto;
        this.rol = rol;
        this.activo = activo;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }
    

    public int getIntentosFallidos() {
        return intentosFallidos;
    }

    public void setIntentosFallidos(int intentosFallidos) {
        this.intentosFallidos = intentosFallidos;
    }

    public LocalDateTime getTiempoDesbloqueo() {
        return tiempoDesbloqueo;
    }

    public void setTiempoDesbloqueo(LocalDateTime tiempoDesbloqueo) {
        this.tiempoDesbloqueo = tiempoDesbloqueo;
    }

    @Override
    public String toString() {
        return nombreCompleto + " (" + usuario + ", " + rol + ")";
    }

    public String tiempoRestanteBloqueo() {
        if (tiempoDesbloqueo == null)
            return "";
        long segundos = java.time.temporal.ChronoUnit.SECONDS.between(LocalDateTime.now(), tiempoDesbloqueo);
        if (segundos <= 0)
            return "0s";
        long minutos = segundos / 60;
        segundos = segundos % 60;
        return String.format("%dm %ds", minutos, segundos);
    }

    
}
