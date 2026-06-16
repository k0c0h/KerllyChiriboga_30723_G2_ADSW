package com.bocatto.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Pedido {

    private String id;
    private Cliente cliente;
    private List<ItemPedido> items; // antes: List<Menu>
    private BigDecimal total;
    private String estado;
    private LocalDateTime fecha;
    private String usuarioAsignado;
    private String tipoEntrega;
    private int numeroMesa; // nuevo campo
    private String observaciones; // nuevo campo (observaciones generales del pedido)

    // Constructor adaptado: ahora recibe el número de mesa y las observaciones
    public Pedido(String id, Cliente cliente, String tipoEntrega, int numeroMesa, String observaciones) {
        this.id = id;
        this.cliente = cliente;
        this.items = new ArrayList<>();
        this.total = BigDecimal.ZERO;
        this.estado = "pendiente";
        this.fecha = LocalDateTime.now();
        this.tipoEntrega = tipoEntrega;
        this.numeroMesa = numeroMesa;
        this.observaciones = observaciones;
    }

    // Getters y setters existentes (id, cliente, estado, etc.) se mantienen igual

    public List<ItemPedido> getItems() {
        return items;
    }

    // Método para agregar un ItemPedido
    public void agregarItem(ItemPedido item) {
        items.add(item);
        recalcularTotal();
    }

    // Recalcular total basado en ItemPedido
    private void recalcularTotal() {
        this.total = items.stream()
                .map(item -> item.getMenu().getPrecio().multiply(BigDecimal.valueOf(item.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getTotal() {
        return total;
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

    public int getNumeroMesa() {
        return numeroMesa;
    }

    public void setNumeroMesa(int numeroMesa) {
        this.numeroMesa = numeroMesa;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    @Override
    public String toString() {
        return "Pedido [" + id + "] - Mesa " + numeroMesa + " - $" + total + " (" + estado + ")";
    }
}