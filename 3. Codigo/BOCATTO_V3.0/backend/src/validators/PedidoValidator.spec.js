import { describe, it, expect } from "@jest/globals";
import PedidoValidator from "./PedidoValidator.js";
import ApiError from "../utils/ApiError.js";

const item = (cantidad = 1) => ({ cantidad });

describe("PedidoValidator — tabla de decisión por canal", () => {
  it("MESA con mesa e items → ok", () => {
    expect(() => PedidoValidator.validar({ canal: "MESA", mesa: 1, items: [item()] })).not.toThrow();
  });

  it("MESA sin mesa → lanza 'mesa'", () => {
    expect(() => PedidoValidator.validar({ canal: "MESA", items: [item()] })).toThrow(/mesa/);
  });

  it("TELEFONO con clienteNombre, telefonoEntrega y direccionEntrega → ok", () => {
    expect(() =>
      PedidoValidator.validar({
        canal: "TELEFONO",
        items: [item()],
        clienteNombre: "Ana",
        telefonoEntrega: "555",
        direccionEntrega: "calle 1",
      })
    ).not.toThrow();
  });

  it("TELEFONO sin clienteNombre → lanza 'nombre del cliente'", () => {
    expect(() =>
      PedidoValidator.validar({ canal: "TELEFONO", items: [item()], telefonoEntrega: "555", direccionEntrega: "x" })
    ).toThrow(/nombre del cliente/);
  });

  it("TELEFONO sin telefonoEntrega → lanza 'teléfono'", () => {
    expect(() =>
      PedidoValidator.validar({ canal: "TELEFONO", items: [item()], clienteNombre: "Ana", direccionEntrega: "x" })
    ).toThrow(/teléfono/);
  });

  it("TELEFONO sin direccionEntrega → lanza 'dirección'", () => {
    expect(() =>
      PedidoValidator.validar({ canal: "TELEFONO", items: [item()], clienteNombre: "Ana", telefonoEntrega: "555" })
    ).toThrow(/dirección/);
  });

  it("QR con clienteNombre → ok (sin mesa, corrección V3.0)", () => {
    expect(() => PedidoValidator.validar({ canal: "QR", items: [item()], clienteNombre: "Ana" })).not.toThrow();
  });

  it("QR sin clienteNombre → lanza 'QR requiere'", () => {
    expect(() => PedidoValidator.validar({ canal: "QR", items: [item()] })).toThrow(/QR requiere/);
  });

  it("canal por defecto MESA sin mesa → lanza 'mesa'", () => {
    expect(() => PedidoValidator.validar({ items: [item()] })).toThrow(/mesa/);
  });
});

describe("PedidoValidator — items y cantidades", () => {
  it("items vacío → lanza 'al menos un producto'", () => {
    expect(() => PedidoValidator.validar({ canal: "MESA", mesa: 1, items: [] })).toThrow(/al menos un producto/);
  });

  it("items undefined → lanza 'al menos un producto'", () => {
    expect(() => PedidoValidator.validar({ canal: "MESA", mesa: 1 })).toThrow(/al menos un producto/);
  });

  it("cantidad <= 0 → lanza 'Cantidad inválida' (BVA: 0, negativo)", () => {
    expect(() => PedidoValidator.validar({ canal: "MESA", mesa: 1, items: [item(0)] })).toThrow(/Cantidad inválida/);
    expect(() => PedidoValidator.validar({ canal: "MESA", mesa: 1, items: [item(-2)] })).toThrow(/Cantidad inválida/);
  });

  it("normaliza canal a mayúsculas", () => {
    expect(() => PedidoValidator.validar({ canal: "mesa", items: [item()] })).toThrow(/mesa/);
  });
});