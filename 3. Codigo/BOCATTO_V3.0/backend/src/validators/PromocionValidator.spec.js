import { describe, it, expect } from "@jest/globals";
import PromocionValidator from "./PromocionValidator.js";
import ApiError from "../utils/ApiError.js";

describe("PromocionValidator", () => {
  it("acepta promoción válida (BVA: 0 y 100)", () => {
    expect(() => PromocionValidator.validar({ nombre: "X", descuento: 0 })).not.toThrow();
    expect(() => PromocionValidator.validar({ nombre: "X", descuento: 100 })).not.toThrow();
    expect(() => PromocionValidator.validar({ nombre: "X", descuento: 50 })).not.toThrow();
  });

  it("rechaza nombre vacío", () => {
    expect(() => PromocionValidator.validar({ nombre: "  ", descuento: 10 })).toThrow(ApiError);
  });

  it("rechaza descuento fuera de rango (BVA: -1, 101)", () => {
    expect(() => PromocionValidator.validar({ nombre: "X", descuento: -1 })).toThrow(/0 y 100/);
    expect(() => PromocionValidator.validar({ nombre: "X", descuento: 101 })).toThrow(/0 y 100/);
  });
});