package com.bocatto.repository;

import com.bocatto.model.Pedido;
import java.util.List;
import java.util.Optional;

public interface PedidoRepository {

    List<Pedido> listar();

    Optional<Pedido> buscarPorId(String id);

    void guardar(Pedido pedido);

    void actualizar(Pedido pedido);

    void eliminar(String id);
}
