package com.bocatto.repository;

import com.bocatto.model.Menu;
import java.util.List;

public interface MenuRepository {
    List<Menu> listar();

    List<Menu> buscarPorCategoria(String categoria);

    List<String> listarCategorias();
}