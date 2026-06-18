package com.bocatto.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class Promocion implements Cloneable {
    private String id;
    private String nombre;
    private String descripcion;
    private BigDecimal descuento; // porcentaje o monto fijo
    private List<Menu> productos; // productos incluidos en la promoción
    private boolean activo;

    public Promocion(String id, String nombre, String descripcion,
            BigDecimal descuento, List<Menu> productos, boolean activo) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.descuento = descuento;
        this.productos = new ArrayList<>(productos);
        this.activo = activo;
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public BigDecimal getDescuento() {
        return descuento;
    }

    public List<Menu> getProductos() {
        return new ArrayList<>(productos);
    }

    public boolean isActivo() {
        return activo;
    }

    // ... setters si se requieren ...

    @Override
    public Promocion clone() {
        try {
            Promocion clon = (Promocion) super.clone();
            // Clon profundo de la lista de productos (si Menu es mutable)
            clon.productos = new ArrayList<>(this.productos);
            return clon;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }

    @Override
    public String toString() {
        return "Promocion{" + nombre + ", descuento=" + descuento + "%}";
    }
}