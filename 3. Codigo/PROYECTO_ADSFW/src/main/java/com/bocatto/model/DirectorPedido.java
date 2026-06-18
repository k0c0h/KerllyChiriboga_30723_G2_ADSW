package com.bocatto.model;

import java.util.List;

public class DirectorPedido {
    private PedidoBuilder builder;

    public DirectorPedido(PedidoBuilder builder) {
        this.builder = builder;
    }

    public Pedido construirPedidoMesa(Cliente cliente, int mesa,
            List<ItemPedido> items, String observaciones,
            String mesero) {
        builder.withCliente(cliente)
                .withTipoEntrega("Mesa")
                .withNumeroMesa(mesa)
                .withObservaciones(observaciones)
                .withUsuarioAsignado(mesero);
        for (ItemPedido item : items) {
            builder.agregarItem(item);
        }
        return builder.build();
    }

    // Podrían añadirse métodos para pedido telefónico, QR, etc.
}