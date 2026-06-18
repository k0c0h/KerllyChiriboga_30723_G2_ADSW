package com.bocatto.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class PedidoBuilder {
    private String id;
    private Cliente cliente;
    private List<ItemPedido> items = new ArrayList<>();
    private String tipoEntrega;
    private int numeroMesa;
    private String observaciones;
    private String usuarioAsignado;

    public PedidoBuilder() {
    }

    public PedidoBuilder withCliente(Cliente cliente) {
        this.cliente = cliente;
        return this;
    }

    public PedidoBuilder withTipoEntrega(String tipoEntrega) {
        this.tipoEntrega = tipoEntrega;
        return this;
    }

    public PedidoBuilder withNumeroMesa(int numeroMesa) {
        this.numeroMesa = numeroMesa;
        return this;
    }

    public PedidoBuilder withObservaciones(String observaciones) {
        this.observaciones = observaciones;
        return this;
    }

    public PedidoBuilder withUsuarioAsignado(String usuarioAsignado) {
        this.usuarioAsignado = usuarioAsignado;
        return this;
    }

    public PedidoBuilder agregarItem(ItemPedido item) {
        this.items.add(item);
        return this;
    }

    public Pedido build() {
        // Validación centralizada: al menos un ítem
        if (items.isEmpty()) {
            throw new IllegalStateException("El pedido debe tener al menos un producto.");
        }
        if (cliente == null) {
            throw new IllegalStateException("El cliente es obligatorio.");
        }
        if (tipoEntrega == null || tipoEntrega.isBlank()) {
            throw new IllegalStateException("El tipo de entrega es obligatorio.");
        }

        // Generar ID único (puede usarse UUID en producción)
        if (id == null) {
            id = "PED-" + System.currentTimeMillis();
        }

        Pedido pedido = new Pedido(id, cliente, tipoEntrega, numeroMesa, observaciones);
        pedido.setUsuarioAsignado(usuarioAsignado);
        // Los items se agregan mediante el método agregarItem de Pedido, que recalcula
        // el total
        for (ItemPedido item : items) {
            pedido.agregarItem(item); // ya incluye recalcularTotal
        }
        pedido.setEstado("pendiente");
        pedido.setFecha(LocalDateTime.now());
        return pedido;
    }

    // Opcional: permitir setId manualmente (para restauración de prototipos)
    public PedidoBuilder withId(String id) {
        this.id = id;
        return this;
    }
}