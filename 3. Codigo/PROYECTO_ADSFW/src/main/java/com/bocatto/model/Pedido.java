package com.bocatto.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Pedido {

    private String id;
    private Cliente cliente;
    private final List<Menu> items;
    private BigDecimal total;
    private String estado;
    private LocalDateTime fecha;
    private String usuarioAsignado;
    private String tipoEntrega;

    public Pedido(String id, Cliente cliente, String tipoEntrega) {
        this.id = id;
        this.cliente = cliente;
        this.items = new ArrayList<>();
        this.total = BigDecimal.ZERO;
        this.estado = "PENDIENTE";
        this.fecha = LocalDateTime.now();
        this.tipoEntrega = tipoEntrega;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public List<Menu> getItems() {
        return items;
    }

    public void agregarItem(Menu item) {
        items.add(item);
        recalcularTotal();
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    private void recalcularTotal() {
        this.total = items.stream()
                .map(Menu::getPrecio)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public String getUsuarioAsignado() {
        return usuarioAsignado;
    }

    public void setUsuarioAsignado(String usuarioAsignado) {
        this.usuarioAsignado = usuarioAsignado;
    }

    public String getTipoEntrega() {
        return tipoEntrega;
    }

    public void setTipoEntrega(String tipoEntrega) {
        this.tipoEntrega = tipoEntrega;
    }

    @Override
    public String toString() {
        return "Pedido [" + id + "] - " + cliente.getNombre() + " - $" + total + " (" + estado + ")";
    }
}
