import { describe, it, expect } from "vitest";
import UsuarioValidator from "./UsuarioValidator.js";

describe("UsuarioValidator", () => {
  it("rechaza nombre vacío", () => {
    expect(UsuarioValidator.validar({ nombre: "  ", apellido: "b", username: "u", id: "" }).ok).toBe(false);
  });
  it("rechaza apellido vacío", () => {
    expect(UsuarioValidator.validar({ nombre: "a", apellido: "  ", username: "u", id: "" }).ok).toBe(false);
  });
  it("rechaza username vacío", () => {
    expect(UsuarioValidator.validar({ nombre: "a", apellido: "b", username: "  ", id: "" }).ok).toBe(false);
  });
  it("rechaza contraseña vacía en alta (id vacío)", () => {
    expect(UsuarioValidator.validar({ nombre: "a", apellido: "b", username: "u", id: "", password: "  " }).ok).toBe(false);
  });
  it("acepta edición sin contraseña (id presente)", () => {
    expect(UsuarioValidator.validar({ nombre: "a", apellido: "b", username: "u", id: "1", password: "" }).ok).toBe(true);
  });
  it("acepta alta con contraseña", () => {
    expect(UsuarioValidator.validar({ nombre: "a", apellido: "b", username: "u", id: "", password: "123456" }).ok).toBe(true);
  });
});