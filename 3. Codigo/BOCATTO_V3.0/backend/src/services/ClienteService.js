import ClienteRepository from "../repositories/ClienteRepository.js";

class ClienteService {

    async listarClientes() {
        return await ClienteRepository.obtenerTodos();
    }

    async obtenerCliente(id) {
        return await ClienteRepository.obtenerPorId(id);
    }

    async crearCliente(datos) {
        return await ClienteRepository.crear(datos);
    }

    async actualizarCliente(id, datos) {
        return await ClienteRepository.actualizar(id, datos);
    }

    async eliminarCliente(id) {
        return await ClienteRepository.eliminar(id);
    }

}

export default new ClienteService();