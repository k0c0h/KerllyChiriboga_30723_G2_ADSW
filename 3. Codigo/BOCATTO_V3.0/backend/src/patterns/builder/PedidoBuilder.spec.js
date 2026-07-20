import { describe, it, expect } from "@jest/globals";
import PedidoBuilder from "./PedidoBuilder.js";
import DirectorPedido from "./DirectorPedido.js";
import ApiError from "../../utils/ApiError.js";

const prod = (over = {}) => ({ _id: "p1", nombre: "Café", precio: 2.5, ...over });

describe("PedidoBuilder", () => {
  it("se reinicia a un pedido MESA con estado PENDIENTE y total 0", () => {
    const b = new PedidoBuilder();
    b.setMesa("M1").agregarProducto(prod(), 1);
    expect(b.pedido.items).toHaveLength(1);
    b.reset();
    expect(b.pedido).toMatchObject({
      canal: "MESA",
      mesa: null,
      cliente: null,
      clienteNombre: "",
      mesero: null,
      items: [],
      total: 0,
      estado: "PENDIENTE",
      telefonoEntrega: "",
      direccionEntrega: "",
      observaciones: "",
    });
  });

  it("convierte canal a mayúsculas y por defecto es MESA", () => {
    const b = new PedidoBuilder();
    b.setCanal("telefono");
    expect(b.pedido.canal).toBe("TELEFONO");
    b.reset();
    expect(b.pedido.canal).toBe("MESA");
  });

  it("rechaza cantidad <= 0 (BVA: 0, negativo)", () => {
    const b = new PedidoBuilder();
    expect(() => b.agregarProducto(prod(), 0)).toThrow(ApiError);
    expect(() => b.agregarProducto(prod(), -1)).toThrow(ApiError);
  });

  it("rechaza producto sin precio positivo (BVA: 0, negativo, nulo)", () => {
    const b = new PedidoBuilder();
    expect(() => b.agregarProducto({ ...prod(), precio: 0 }, 1)).toThrow(/Precio inválido/);
    expect(() => b.agregarProducto({ ...prod(), precio: -1 }, 1)).toThrow(/Precio inválido/);
    expect(() => b.agregarProducto(null, 1)).toThrow(/Precio inválido/);
  });

  it("acumula total e items", () => {
    const b = new PedidoBuilder();
    b.agregarProducto(prod(), 2).agregarProducto(prod({ precio: 3 }), 1);
    expect(b.pedido.items).toHaveLength(2);
    expect(b.pedido.total).toBeCloseTo(2.5 * 2 + 3, 2);
  });

  it("aplica un descuento porcentual", () => {
    const b = new PedidoBuilder();
    b.agregarProducto(prod(), 2).aplicarPromocion({ descuento: 50 });
    expect(b.pedido.total).toBeCloseTo(2.5);
  });

  it("aplicarPromocion sin promoción no altera el total", () => {
    const b = new PedidoBuilder();
    b.agregarProducto(prod(), 2);
    const antes = b.pedido.total;
    b.aplicarPromocion(null);
    expect(b.pedido.total).toBe(antes);
  });

  it("requiere mesa para canales distintos de TELEFONO", () => {
    const b = new PedidoBuilder();
    b.agregarProducto(prod(), 1);
    expect(() => b.validar()).toThrow(/mesa/i);
  });

  it("requiere teléfono para el canal TELEFONO", () => {
    const b = new PedidoBuilder();
    b.setCanal("TELEFONO").agregarProducto(prod(), 1);
    expect(() => b.validar()).toThrow(/teléfono/i);
  });

  it("requiere items (no vacío)", () => {
    const b = new PedidoBuilder();
    b.setMesa("M1");
    expect(() => b.validar()).toThrow(/productos/);
  });

  it("expone setClienteNombre y setObservaciones", () => {
    const b = new PedidoBuilder();
    b.setClienteNombre("Juan").setObservaciones("sin sal");
    expect(b.pedido.clienteNombre).toBe("Juan");
    expect(b.pedido.observaciones).toBe("sin sal");
  });

  it("expone setCliente y setMesero y setDatosEntrega", () => {
    const b = new PedidoBuilder();
    b.setCliente({ id: "c1" }).setMesero("u1").setDatosEntrega("555", "calle 1");
    expect(b.pedido.cliente).toEqual({ id: "c1" });
    expect(b.pedido.mesero).toBe("u1");
    expect(b.pedido.telefonoEntrega).toBe("555");
    expect(b.pedido.direccionEntrega).toBe("calle 1");
  });

  it("calcularTotal redondea a 2 decimales", () => {
    const b = new PedidoBuilder();
    b.agregarProducto(prod({ precio: 0.1 }), 3);
    b.calcularTotal();
    expect(b.pedido.total).toBe(0.3);
  });

  it("build() retorna una copia y reinicia el estado", () => {
    const b = new PedidoBuilder();
    b.setMesa("M1").agregarProducto(prod(), 1);
    const out = b.build();
    expect(out).toMatchObject({ canal: "MESA", mesa: "M1" });
    expect(out.items).toHaveLength(1);
    expect(b.pedido.items).toHaveLength(0);
  });

  it("QR no requiere mesa (corrección V3.0)", () => {
    const b = new PedidoBuilder();
    b.setCanal("QR").setClienteNombre("Ana").agregarProducto(prod(), 1);
    const out = b.build();
    expect(out.canal).toBe("QR");
    expect(out.mesa).toBeNull();
    expect(out.clienteNombre).toBe("Ana");
  });
});

describe("DirectorPedido", () => {
  it("construye un pedido completo a partir de datos crudos (incluye clienteNombre y observaciones)", () => {
    const out = DirectorPedido.construirPedido({
      canal: "MESA",
      mesa: "M9",
      cliente: null,
      clienteNombre: "Maria",
      mesero: "u1",
      observaciones: "llevar",
      items: [{ producto: prod(), cantidad: 3 }],
    });
    expect(out).toMatchObject({
      canal: "MESA",
      mesa: "M9",
      total: 7.5,
      clienteNombre: "Maria",
      observaciones: "llevar",
    });
    expect(out.items[0].subtotal).toBeCloseTo(7.5);
  });

  it("aplica un descuento cuando se proporciona una promoción", () => {
    const out = DirectorPedido.construirPedido({
      canal: "MESA",
      mesa: "M9",
      items: [{ producto: prod(), cantidad: 2 }],
      promocion: { descuento: 25 },
    });
    expect(out.total).toBeCloseTo(2.5 * 2 * 0.75, 2);
  });

  it("propaga errores del builder (canal TELEFONO sin teléfono)", () => {
    expect(() =>
      DirectorPedido.construirPedido({
        canal: "TELEFONO",
        items: [{ producto: prod(), cantidad: 1 }],
        clienteNombre: "X",
        direccionEntrega: "x",
      })
    ).toThrow(/teléfono/);
  });
});