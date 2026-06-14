package com.bocatto.repository;

import com.bocatto.model.Pedido;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class PedidoRepositoryMemoria implements PedidoRepository {

    private final List<Pedido> pedidos = new ArrayList<>();

    @Override
    public List<Pedido> listar() {
        return new ArrayList<>(pedidos);
    }

    @Override
    public Optional<Pedido> buscarPorId(String id) {
        return pedidos.stream()
                .filter(p -> p.getId().equals(id))
                .findFirst();
    }

    @Override
    public void guardar(Pedido pedido) {
        pedidos.add(pedido);
    }

    @Override
    public void actualizar(Pedido pedido) {
        pedidos.removeIf(p -> p.getId().equals(pedido.getId()));
        pedidos.add(pedido);
    }

    @Override
    public void eliminar(String id) {
        pedidos.removeIf(p -> p.getId().equals(id));
    }
}
