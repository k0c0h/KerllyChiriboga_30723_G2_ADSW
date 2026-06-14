package com.bocatto.controller;

import com.bocatto.model.Pedido;
import com.bocatto.repository.PedidoRepository;
import com.bocatto.service.ValidacionService;
import java.util.List;
import java.util.Optional;

public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final ValidacionService validacionService;

    public PedidoController(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.validacionService = new ValidacionService();
    }

    public boolean crearPedido(Pedido pedido) {
        List<String> errores = validacionService.validarPedido(pedido);
        if (!errores.isEmpty()) {
            return false;
        }
        pedidoRepository.guardar(pedido);
        return true;
    }

    public List<Pedido> listarPedidos() {
        return pedidoRepository.listar();
    }

    public Optional<Pedido> obtenerPedido(String id) {
        return pedidoRepository.buscarPorId(id);
    }

    public void actualizarPedido(Pedido pedido) {
        pedidoRepository.actualizar(pedido);
    }

    public void eliminarPedido(String id) {
        pedidoRepository.eliminar(id);
    }
}
