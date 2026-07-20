import { describe, it, expect } from "@jest/globals";
import MenuValidator from "./MenuValidator.js";
import ApiError from "../utils/ApiError.js";

describe("MenuValidator", () => {
  it("acepta un producto válido", () => {
    expect(() => MenuValidator.validar({ nombre: "Café", precio: 2.5 })).not.toThrow();
  });

  it("rechaza nombre vacío", () => {
    expect(() => MenuValidator.validar({ nombre: "  ", precio: 2.5 })).toThrow(ApiError);
  });

  it("rechaza precio no positivo (BVA: 0, negativo)", () => {
    expect(() => MenuValidator.validar({ nombre: "x", precio: 0 })).toThrow(/precio/i);
    expect(() => MenuValidator.validar({ nombre: "x", precio: -1 })).toThrow(/precio/i);
  });
});