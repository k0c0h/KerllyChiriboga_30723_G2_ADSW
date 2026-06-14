package com.bocatto.repository;

import com.bocatto.model.Usuario;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class UsuarioRepositoryMemoria implements UsuarioRepository {

    private final List<Usuario> usuarios = new ArrayList<>();

    public UsuarioRepositoryMemoria() {
        inicializarDatos();
    }

    private void inicializarDatos() {
        usuarios.add(new Usuario("1", "mesero", "1234", "Mesero Demo", "MESERO", true));
        usuarios.add(new Usuario("2", "operador", "1234", "Operador Demo", "OPERADOR", true));
        usuarios.add(new Usuario("3", "admin", "1234", "Administrador", "ADMIN", true));
    }

    @Override
    public List<Usuario> listar() {
        return new ArrayList<>(usuarios);
    }

    @Override
    public Optional<Usuario> buscarPorId(String id) {
        return usuarios.stream()
                .filter(u -> u.getId().equals(id))
                .findFirst();
    }

    @Override
    public Optional<Usuario> buscarPorUsuario(String usuario) {
        return usuarios.stream()
                .filter(u -> u.getUsuario().equalsIgnoreCase(usuario))
                .findFirst();
    }

    @Override
    public void guardar(Usuario usuario) {
        usuarios.add(usuario);
    }

    @Override
    public void actualizar(Usuario usuario) {
        usuarios.removeIf(u -> u.getId().equals(usuario.getId()));
        usuarios.add(usuario);
    }

    @Override
    public void eliminar(String id) {
        usuarios.removeIf(u -> u.getId().equals(id));
    }
}
