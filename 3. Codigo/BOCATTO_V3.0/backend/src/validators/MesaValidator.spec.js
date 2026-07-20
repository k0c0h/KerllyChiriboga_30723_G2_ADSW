import { describe, it, expect } from "@jest/globals";
import MesaValidator from "./MesaValidator.js";
import ApiError from "../utils/ApiError.js";

describe("MesaValidator", () => {
  it("acepta una mesa válida", () => {
    expect(() => MesaValidator.validar({ numero: 1, capacidad: 4 })).not.toThrow();
  });

  it("rechaza numero faltante", () => {
    expect(() => MesaValidator.validar({ capacidad: 4 })).toThrow(ApiError);
  });

  it("rechaza numero falsy (0)", () => {
    expect(() => MesaValidator.validar({ numero: 0, capacidad: 4 })).toThrow(ApiError);
  });

  it("rechaza capacidad < 1 (BVA: 0 y negativo)", () => {
    expect(() => MesaValidator.validar({ numero: 1, capacidad: 0 })).toThrow(/Capacidad inválida/);
    expect(() => MesaValidator.validar({ numero: 1, capacidad: -3 })).toThrow(/Capacidad inválida/);
  });
});