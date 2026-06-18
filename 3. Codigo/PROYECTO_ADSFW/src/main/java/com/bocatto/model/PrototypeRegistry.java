package com.bocatto.model;

import java.util.HashMap;
import java.util.Map;

public class PrototypeRegistry {
    private Map<String, Promocion> prototipos = new HashMap<>();

    public void agregarPrototipo(String clave, Promocion promocion) {
        prototipos.put(clave, promocion);
    }

    public Promocion obtenerClon(String clave) {
        Promocion original = prototipos.get(clave);
        if (original == null) {
            throw new IllegalArgumentException("No existe prototipo con clave: " + clave);
        }
        return original.clone();
    }

    // Opcional: eliminar, listar, etc.
}