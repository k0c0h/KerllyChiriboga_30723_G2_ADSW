package com.bocatto.model;

import java.util.HashMap;
import java.util.Map;

public class MenuPrototypeRegistry {
    private Map<String, Menu> prototipos = new HashMap<>();

    public void agregarPrototipo(String clave, Menu menu) {
        prototipos.put(clave, menu);
    }

    public Menu obtenerClon(String clave) {
        Menu original = prototipos.get(clave);
        if (original == null) {
            throw new IllegalArgumentException("No existe prototipo de menú: " + clave);
        }
        return original.clone();
    }

    public boolean existe(String clave) {
        return prototipos.containsKey(clave);
    }
}