import { describe, it, expect } from "vitest";
import ClienteValidator from "./ClienteValidator.js";

describe("ClienteValidator", () => {
  it("rechaza nombre vacío", () => {
    const r = ClienteValidator.validar({ nombre: "  ", telefono: "555" });
    expect(r.ok).toBe(false);
    expect(r.mensaje).toMatch(/nombre/i);
  });
  it("rechaza teléfono vacío", () => {
    const r = ClienteValidator.validar({ nombre: "Ana", telefono: "" });
    expect(r.ok).toBe(false);
    expect(r.mensaje).toMatch(/teléfono/i);
  });
  it("acepta un cliente válido", () => {
    expect(ClienteValidator.validar({ nombre: "Ana", telefono: "555" }).ok).toBe(true);
  });
});