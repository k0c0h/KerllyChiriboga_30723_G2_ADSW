import ApiError from "../../utils/ApiError.js";

class PedidoBuilder {

    constructor() {

        this.reset();

    }

    reset() {

        this.pedido = {

            canal: "MESA",

            mesa: null,

            cliente: null,

            mesero: null,

            items: [],

            total: 0,

            estado: "PENDIENTE",

            telefonoEntrega: "",

            direccionEntrega: ""

        };

        return this;

    }

    setCanal(canal = "MESA") {

        this.pedido.canal = String(canal).toUpperCase();

        return this;

    }

    setMesa(mesa) {

        this.pedido.mesa = mesa;

        return this;

    }

    setCliente(cliente) {

        this.pedido.cliente = cliente;

        return this;

    }

    setMesero(mesero) {

        this.pedido.mesero = mesero;

        return this;

    }

    setDatosEntrega(telefonoEntrega = "", direccionEntrega = "") {

        this.pedido.telefonoEntrega = telefonoEntrega;

        this.pedido.direccionEntrega = direccionEntrega;

        return this;

    }

    agregarProducto(producto, cantidad, observacion = "") {

        if (cantidad <= 0) {

            throw new ApiError(
                "Cantidad inválida.",
                400
            );

        }

        if (!producto || producto.precio <= 0) {

            throw new ApiError(
                "Precio inválido.",
                400
            );

        }

        const subtotal = producto.precio * cantidad;

        this.pedido.items.push({

            producto: producto._id,

            nombre: producto.nombre,

            cantidad,

            precio: producto.precio,

            subtotal,

            observacion

        });

        this.pedido.total += subtotal;

        return this;

    }

    aplicarPromocion(promocion) {

        if (!promocion) {

            return this;

        }

        this.pedido.total -=
            this.pedido.total *
            (promocion.descuento / 100);

        return this;

    }

    calcularTotal() {

        this.pedido.total = Number(

            this.pedido.total.toFixed(2)

        );

        return this;

    }

    validar() {

        if (
            this.pedido.canal !== "TELEFONO" &&
            !this.pedido.mesa
        ) {

            throw new ApiError(
                "Debe seleccionar una mesa.",
                400
            );

        }

        if (this.pedido.items.length === 0) {

            throw new ApiError(
                "Debe agregar productos.",
                400
            );

        }

        if (this.pedido.total <= 0) {

            throw new ApiError(
                "Total inválido.",
                400
            );

        }

        if (
            this.pedido.canal === "TELEFONO" &&
            !this.pedido.telefonoEntrega
        ) {

            throw new ApiError(
                "Debe registrar teléfono para pedido telefónico.",
                400
            );

        }

        return this;

    }

    build() {

        this.validar();

        const resultado = { ...this.pedido };

        this.reset();

        return resultado;

    }

}

export default PedidoBuilder;