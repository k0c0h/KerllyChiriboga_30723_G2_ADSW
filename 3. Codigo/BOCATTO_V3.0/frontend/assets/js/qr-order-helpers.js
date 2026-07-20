// Helpers puros (sin DOM) extraídos de qr-order.js para permitir pruebas unitarias.

export function moneda(valor) {
    return `$${Number(valor || 0).toFixed(2)}`;
}

export function totalItems(items) {
    return items.reduce((acc, item) => acc + item.cantidad * item.precio, 0);
}

export function estadoBadgeClass(estado) {
    const clases = {
        PENDIENTE: "text-bg-secondary",
        COCINA:    "text-bg-warning",
        LISTO:     "text-bg-info",
        ENTREGADO: "text-bg-success",
        PAGADO:    "text-bg-dark"
    };
    return clases[estado] || "text-bg-dark";
}

export function agregarProductoACarrito(items, producto) {
    if (!producto) return items;
    const existente = items.find(i => i.producto === producto._id);
    if (existente) {
        return items.map(i =>
            i.producto === producto._id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
    }
    return [
        ...items,
        {
            producto: producto._id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1,
            observacion: ""
        }
    ];
}

export function cambiarCantidadEnCarrito(items, index, delta) {
    if (!items[index]) return items;
    const nuevaCantidad = items[index].cantidad + delta;
    if (nuevaCantidad <= 0) {
        return items.filter((_, i) => i !== index);
    }
    return items.map((item, i) =>
        i === index ? { ...item, cantidad: nuevaCantidad } : item
    );
}

export function quitarDeCarrito(items, index) {
    return items.filter((_, i) => i !== index);
}

export const ESTADO_MENSAJES = {
    COCINA:    "🍳 ¡Tu pedido ya está en cocina!",
    LISTO:     "✅ ¡Tu pedido está listo! Pronto lo recibirás.",
    ENTREGADO: "🎉 ¡Tu pedido fue entregado! Buen provecho.",
    PAGADO:    "💳 Pedido pagado. ¡Gracias por tu visita!"
};

export const ESTADO_TIPOS = {
    COCINA:    "warning",
    LISTO:     "success",
    ENTREGADO: "success",
    PAGADO:    "info"
};