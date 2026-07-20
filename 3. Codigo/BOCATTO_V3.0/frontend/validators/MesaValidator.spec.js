import { describe, it, expect } from "vitest";
import MesaValidator from "./MesaValidator.js";

describe("MesaValidator", () => {
  it("rechaza numero vacío", () => {
    expect(MesaValidator.validar({ numero: "", capacidad: 2 })).toMatchObject({ ok: false });
  });
  it("rechaza numero no positivo (BVA: 0, -1)", () => {
    expect(MesaValidator.validar({ numero: 0, capacidad: 2 })).toMatchObject({ ok: false });
    expect(MesaValidator.validar({ numero: -1, capacidad: 2 })).toMatchObject({ ok: false });
  });
  it("rechaza capacidad vacía", () => {
    expect(MesaValidator.validar({ numero: 1, capacidad: "" })).toMatchObject({ ok: false });
  });
  it("rechaza capacidad no positiva (BVA: 0, -1)", () => {
    expect(MesaValidator.validar({ numero: 1, capacidad: 0 })).toMatchObject({ ok: false });
    expect(MesaValidator.validar({ numero: 1, capacidad: -1 })).toMatchObject({ ok: false });
  });
  it("acepta una mesa válida", () => {
    expect(MesaValidator.validar({ numero: 1, capacidad: 4 })).toEqual({ ok: true });
  });
  it("mensaje describe el fallo de numero", () => {
    expect(MesaValidator.validar({ numero: "", capacidad: 2 }).mensaje).toMatch(/número/i);
  });
  it("mensaje describe el fallo de capacidad", () => {
    expect(MesaValidator.validar({ numero: 1, capacidad: 0 }).mensaje).toMatch(/capacidad/i);
  });
});