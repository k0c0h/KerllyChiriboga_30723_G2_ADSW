package com.bocatto.repository;

import com.bocatto.model.Usuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository {

    List<Usuario> listar();

    Optional<Usuario> buscarPorId(String id);

    Optional<Usuario> buscarPorUsuario(String usuario);

    void guardar(Usuario usuario);

    void actualizar(Usuario usuario);

    void eliminar(String id);
}
