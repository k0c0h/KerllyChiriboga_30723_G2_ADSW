package com.bocatto.model;

public class ItemPedido {
    private Menu menu;
    private int cantidad;
    private String observacion;

    public ItemPedido(Menu menu, int cantidad, String observacion) {
        this.menu = menu;
        this.cantidad = cantidad;
        this.observacion = observacion;
    }

    public Menu getMenu() {
        return menu;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }

    @Override
    public String toString() {
        String base = menu.getNombre() + " x" + cantidad;
        if (observacion != null && !observacion.isEmpty()) {
            base += " (" + observacion + ")";
        }
        return base;
    }
}