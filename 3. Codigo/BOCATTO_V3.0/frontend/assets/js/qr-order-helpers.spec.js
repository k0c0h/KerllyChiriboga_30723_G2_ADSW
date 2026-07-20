import { describe, it, expect } from "vitest";
import {
    moneda,
    totalItems,
    estadoBadgeClass,
    agregarProductoACarrito,
    cambiarCantidadEnCarrito,
    quitarDeCarrito,
    ESTADO_MENSAJES,
    ESTADO_TIPOS
} from "./qr-order-helpers.js";

describe("moneda (RF 3.2.8)", () => {
  it("formatea un número a $ con 2 decimales", () => {
    expect(moneda(2.5)).toBe("$2.50");
    expect(moneda(0)).toBe("$0.00");
  });
  it("maneja valores nulos/undefined como 0", () => {
    expect(moneda(null)).toBe("$0.00");
    expect(moneda(undefined)).toBe("$0.00");
  });
  it("convierte strings numéricos", () => {
    expect(moneda("3")).toBe("$3.00");
  });
});

describe("totalItems (RF 3.2.9)", () => {
  it("suma cantidad*precio de cada item", () => {
    const items = [
      { cantidad: 2, precio: 2.5 },
      { cantidad: 1, precio: 3 },
    ];
    expect(totalItems(items)).toBe(8);
  });
  it("retorna 0 para carrito vacío", () => {
    expect(totalItems([])).toBe(0);
  });
});

describe("estadoBadgeClass (RF 3.2.19)", () => {
  it("mapea cada estado a su clase Bootstrap", () => {
    expect(estadoBadgeClass("PENDIENTE")).toBe("text-bg-secondary");
    expect(estadoBadgeClass("COCINA")).toBe("text-bg-warning");
    expect(estadoBadgeClass("LISTO")).toBe("text-bg-info");
    expect(estadoBadgeClass("ENTREGADO")).toBe("text-bg-success");
    expect(estadoBadgeClass("PAGADO")).toBe("text-bg-dark");
  });
  it("usa text-bg-dark por defecto para estados desconocidos", () => {
    expect(estadoBadgeClass("DESCONOCIDO")).toBe("text-bg-dark");
  });
});

describe("agregarProductoACarrito (RF 3.2.9)", () => {
  const producto = { _id: "p1", nombre: "Café", precio: 2.5 };

  it("agrega un producto nuevo con cantidad 1", () => {
    const items = agregarProductoACarrito([], producto);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ producto: "p1", nombre: "Café", precio: 2.5, cantidad: 1, observacion: "" });
  });

  it("incrementa cantidad si el producto ya está en el carrito", () => {
    const items = agregarProductoACarrito([{ producto: "p1", nombre: "Café", precio: 2.5, cantidad: 1, observacion: "" }], producto);
    expect(items).toHaveLength(1);
    expect(items[0].cantidad).toBe(2);
  });

  it("retorna el carrito sin cambiar si el producto es nulo", () => {
    const items = [{ producto: "p1", cantidad: 1 }];
    expect(agregarProductoACarrito(items, null)).toBe(items);
  });

  it("no muta el carrito original", () => {
    const original = [{ producto: "p1", nombre: "Café", precio: 2.5, cantidad: 1, observacion: "" }];
    agregarProductoACarrito(original, producto);
    expect(original[0].cantidad).toBe(1);
  });
});

describe("cambiarCantidadEnCarrito (RF 3.2.9)", () => {
  const items = [
    { producto: "p1", nombre: "Café", precio: 2.5, cantidad: 2, observacion: "" },
    { producto: "p2", nombre: "Té", precio: 1.5, cantidad: 1, observacion: "" },
  ];

  it("incrementa la cantidad en +1", () => {
    const r = cambiarCantidadEnCarrito(items, 0, 1);
    expect(r[0].cantidad).toBe(3);
  });

  it("decrementa la cantidad en -1", () => {
    const r = cambiarCantidadEnCarrito(items, 0, -1);
    expect(r[0].cantidad).toBe(1);
  });

  it("elimina el item si la cantidad llega a 0", () => {
    const r = cambiarCantidadEnCarrito(items, 1, -1);
    expect(r).toHaveLength(1);
    expect(r[0].producto).toBe("p1");
  });

  it("no muta el carrito original", () => {
    cambiarCantidadEnCarrito(items, 0, 1);
    expect(items[0].cantidad).toBe(2);
  });

  it("retorna el carrito igual si el índice no existe", () => {
    const r = cambiarCantidadEnCarrito(items, 99, 1);
    expect(r).toBe(items);
  });
});

describe("quitarDeCarrito (RF 3.2.9)", () => {
  const items = [
    { producto: "p1", cantidad: 1 },
    { producto: "p2", cantidad: 1 },
  ];

  it("elimina el item en el índice dado", () => {
    const r = quitarDeCarrito(items, 0);
    expect(r).toHaveLength(1);
    expect(r[0].producto).toBe("p2");
  });

  it("no muta el carrito original", () => {
    quitarDeCarrito(items, 0);
    expect(items).toHaveLength(2);
  });
});

describe("ESTADO_MENSAJES y ESTADO_TIPOS (RF 3.2.19)", () => {
  it("tienen mensaje para COCINA, LISTO, ENTREGADO, PAGADO", () => {
    expect(ESTADO_MENSAJES.COCINA).toMatch(/cocina/);
    expect(ESTADO_MENSAJES.LISTO).toMatch(/listo/);
    expect(ESTADO_MENSAJES.ENTREGADO).toMatch(/entregado/);
    expect(ESTADO_MENSAJES.PAGADO).toMatch(/pagado/);
  });

  it("tienen tipo de toast para cada estado", () => {
    expect(ESTADO_TIPOS.COCINA).toBe("warning");
    expect(ESTADO_TIPOS.LISTO).toBe("success");
    expect(ESTADO_TIPOS.ENTREGADO).toBe("success");
    expect(ESTADO_TIPOS.PAGADO).toBe("info");
  });
});