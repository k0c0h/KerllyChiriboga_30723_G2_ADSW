import Menu from "../models/Menu.js";

class MenuRepository {

    async obtenerTodos() {

        return await Menu.find();

    }

    async obtenerDisponibles() {

        return await Menu.find({
            disponible: true
        });

    }

    async obtenerPorId(id) {

        return await Menu.findById(id);

    }

    async crear(producto) {

        return await Menu.create(producto);

    }

    async actualizar(id, datos) {

        return await Menu.findByIdAndUpdate(
            id,
            datos,
            {
                new: true
            }
        );

    }

    async eliminar(id) {

        return await Menu.findByIdAndDelete(id);

    }

}

export default new MenuRepository();