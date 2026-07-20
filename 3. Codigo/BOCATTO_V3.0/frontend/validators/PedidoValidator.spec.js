import { describe, it, expect } from "vitest";
import PedidoValidator from "./PedidoValidator.js";

describe("PedidoValidator", () => {
  it("rechaza items vacío o nulo", () => {
    expect(PedidoValidator.validar([], "MESA").ok).toBe(false);
    expect(PedidoValidator.validar(null, "MESA").ok).toBe(false);
  });

  it("mensaje de items vacíos", () => {
    expect(PedidoValidator.validar([], "MESA").mensaje).toMatch(/al menos un producto/);
  });

  it("MESA con items → ok", () => {
    expect(PedidoValidator.validar([{ cantidad: 1 }], "MESA").ok).toBe(true);
  });

  it("TELEFONO sin clienteNombre → ok:false 'nombre del cliente'", () => {
    const r = PedidoValidator.validar([{ cantidad: 1 }], "TELEFONO", "", "555", "calle 1");
    expect(r.ok).toBe(false);
    expect(r.mensaje).toMatch(/nombre del cliente/);
  });

  it("TELEFONO sin telefonoEntrega → ok:false 'teléfono'", () => {
    const r = PedidoValidator.validar([{ cantidad: 1 }], "TELEFONO", "Ana", "", "calle 1");
    expect(r.ok).toBe(false);
    expect(r.mensaje).toMatch(/teléfono/);
  });

  it("TELEFONO sin direccionEntrega → ok:false 'dirección'", () => {
    const r = PedidoValidator.validar([{ cantidad: 1 }], "TELEFONO", "Ana", "555", "");
    expect(r.ok).toBe(false);
    expect(r.mensaje).toMatch(/dirección/);
  });

  it("TELEFONO con todo completo → ok:true", () => {
    expect(PedidoValidator.validar([{ cantidad: 1 }], "TELEFONO", "Ana", "555", "calle 1").ok).toBe(true);
  });
});