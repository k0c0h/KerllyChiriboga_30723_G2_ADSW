import MenuRepository from "../repositories/MenuRepository.js";

class MenuService {

    async listarMenu() {
        return await MenuRepository.obtenerTodos();
    }

    async listarDisponibles() {
        return await MenuRepository.obtenerDisponibles();
    }

    async obtenerProducto(id) {
        return await MenuRepository.obtenerPorId(id);
    }

    async crearProducto(datos) {
        return await MenuRepository.crear(datos);
    }

    async actualizarProducto(id, datos) {
        return await MenuRepository.actualizar(id, datos);
    }

    async eliminarProducto(id) {
        return await MenuRepository.eliminar(id);
    }

}

export default new MenuService();