import { describe, it, expect } from "@jest/globals";
import UsuarioValidator from "./UsuarioValidator.js";
import ApiError from "../utils/ApiError.js";

const baseOk = { nombre: "a", apellido: "b", username: "u", password: "123456", rol: "ADMIN" };

describe("UsuarioValidator", () => {
  it("acepta un usuario válido (todos los roles)", () => {
    for (const rol of ["ADMIN", "MESERO", "COCINA", "CAJA"]) {
      expect(() => UsuarioValidator.validar({ ...baseOk, rol })).not.toThrow();
    }
  });

  it("rechaza nombre vacío", () => {
    expect(() => UsuarioValidator.validar({ ...baseOk, nombre: "  " })).toThrow(ApiError);
  });

  it("rechaza apellido vacío", () => {
    expect(() => UsuarioValidator.validar({ ...baseOk, apellido: "" })).toThrow(/apellido/i);
  });

  it("rechaza username vacío", () => {
    expect(() => UsuarioValidator.validar({ ...baseOk, username: "" })).toThrow(/usuario/i);
  });

  it("rechaza contraseña con menos de 6 caracteres (BVA: 5, 6)", () => {
    expect(() => UsuarioValidator.validar({ ...baseOk, password: "12345" })).toThrow(/6 caracteres/);
    expect(() => UsuarioValidator.validar({ ...baseOk, password: "123456" })).not.toThrow();
  });

  it("rechaza rol inválido", () => {
    expect(() => UsuarioValidator.validar({ ...baseOk, rol: "X" })).toThrow(/Rol inválido/);
  });
});