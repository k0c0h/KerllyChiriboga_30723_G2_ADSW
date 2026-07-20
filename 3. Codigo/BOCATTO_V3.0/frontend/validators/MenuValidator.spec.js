import { describe, it, expect } from "vitest";
import MenuValidator from "./MenuValidator.js";

describe("MenuValidator", () => {
  it("rechaza nombre vacío", () => {
    expect(MenuValidator.validar({ nombre: "  ", precio: 2 })).toMatchObject({ ok: false });
  });
  it("rechaza precio no positivo (BVA: 0, -1)", () => {
    expect(MenuValidator.validar({ nombre: "x", precio: 0 })).toMatchObject({ ok: false });
    expect(MenuValidator.validar({ nombre: "x", precio: -1 })).toMatchObject({ ok: false });
  });
  it("acepta un producto válido", () => {
    expect(MenuValidator.validar({ nombre: "Café", precio: 2.5 })).toEqual({ ok: true });
  });
  it("mensaje describe el fallo de nombre", () => {
    expect(MenuValidator.validar({ nombre: "", precio: 1 }).mensaje).toMatch(/nombre/i);
  });
  it("mensaje describe el fallo de precio", () => {
    expect(MenuValidator.validar({ nombre: "x", precio: 0 }).mensaje).toMatch(/precio/i);
  });
});