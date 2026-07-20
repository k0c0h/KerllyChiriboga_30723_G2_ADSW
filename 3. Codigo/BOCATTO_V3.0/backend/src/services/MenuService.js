import MenuRepository from "../repositories/MenuRepository.js";
import MenuPrototype from "../patterns/prototype/MenuPrototype.js";
import ApiError from "../utils/ApiError.js";
import MenuValidator from "../validators/MenuValidator.js";

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

        async clonarProducto(id, cambios = {}) {

        const productoOriginal = await MenuRepository.obtenerPorId(id);

        if (!productoOriginal) {
            throw new ApiError("Producto no encontrado.", 404);
        }

        const productoClonado = new MenuPrototype(productoOriginal).clone(cambios);

        MenuValidator.validar(productoClonado);

        return await MenuRepository.crear(productoClonado);
    }


    async actualizarProducto(id, datos) {
        return await MenuRepository.actualizar(id, datos);
    }

    async eliminarProducto(id) {
        return await MenuRepository.eliminar(id);
    }

}

export default new MenuService();