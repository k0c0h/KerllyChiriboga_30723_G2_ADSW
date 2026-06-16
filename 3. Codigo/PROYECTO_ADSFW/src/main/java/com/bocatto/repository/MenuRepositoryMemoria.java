package com.bocatto.repository;

import com.bocatto.model.Menu;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class MenuRepositoryMemoria implements MenuRepository {

    private final List<Menu> menus = new ArrayList<>();

    public MenuRepositoryMemoria() {
        // Datos de ejemplo
        menus.addAll(Arrays.asList(
                new Menu("1", "Bruschetta al Tomate", "Pan tostado con tomate y albahaca", new BigDecimal("5.50"),
                        "Entradas", 10),
                new Menu("2", "Tabla de Quesos", "Selección de quesos artesanales", new BigDecimal("8.00"), "Entradas",
                        8),
                new Menu("3", "Calamares a la Romana", "Calamares fritos con alioli", new BigDecimal("7.50"),
                        "Entradas", 5),
                new Menu("4", "Lomo Saltado", "Tiras de lomo con papas y arroz", new BigDecimal("12.00"),
                        "Platos Fuertes", 15),
                new Menu("5", "Pollo a la Parrilla", "Pechuga grillada con ensalada", new BigDecimal("10.50"),
                        "Platos Fuertes", 12),
                new Menu("6", "Pizza Margarita", "Pizza clásica con mozzarella", new BigDecimal("9.00"), "Pizzas", 10),
                new Menu("7", "Pizza Pepperoni", "Pizza con pepperoni y queso", new BigDecimal("10.00"), "Pizzas", 10),
                new Menu("8", "Tiramisú", "Postre italiano de café y mascarpone", new BigDecimal("6.50"), "Postres", 7),
                new Menu("9", "Cheesecake de Maracuyá", "Cheesecake cremoso con maracuyá", new BigDecimal("7.00"),
                        "Postres", 6),
                new Menu("10", "Limonada Frozen", "Limonada helada estilo frozen", new BigDecimal("3.50"), "Bebidas",
                        20),
                new Menu("11", "Jugo de Maracuyá", "Jugo natural de maracuyá", new BigDecimal("4.00"), "Bebidas", 15),
                new Menu("12", "Cerveza Artesanal", "Cerveza artesanal 330ml", new BigDecimal("5.00"), "Bebidas", 30)));
    }

    @Override
    public List<Menu> listar() {
        return new ArrayList<>(menus);
    }

    @Override
    public List<Menu> buscarPorCategoria(String categoria) {
        return menus.stream()
                .filter(m -> m.getCategoria().equalsIgnoreCase(categoria))
                .collect(Collectors.toList());
    }

    @Override
    public List<String> listarCategorias() {
        return menus.stream()
                .map(Menu::getCategoria)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
}