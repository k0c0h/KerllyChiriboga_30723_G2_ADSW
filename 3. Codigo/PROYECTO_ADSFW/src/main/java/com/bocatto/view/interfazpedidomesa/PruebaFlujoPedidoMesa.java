package com.bocatto.view.interfazpedidomesa;

import com.bocatto.repository.MenuRepositoryMemoria;
import com.bocatto.repository.PedidoRepositoryMemoria;

public class PruebaFlujoPedidoMesa {
    public static void main(String[] args) {
        FlujoPedidoMesa flujo = new FlujoPedidoMesa(
                "Carlos Méndez",
                new MenuRepositoryMemoria(),
                new PedidoRepositoryMemoria());
        flujo.iniciar();
    }
}