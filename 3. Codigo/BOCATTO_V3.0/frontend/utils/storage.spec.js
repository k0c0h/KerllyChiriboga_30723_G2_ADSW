import { describe, it, expect, beforeEach } from "vitest";
import Storage from "./storage.js";

describe("Storage", () => {
  beforeEach(() => localStorage.clear());

  it("persiste y lee el token", () => {
    Storage.guardarToken("abc");
    expect(Storage.obtenerToken()).toBe("abc");
    expect(Storage.estaAutenticado()).toBe(true);
  });

  it("retorna null cuando no hay token y estaAutenticado false", () => {
    expect(Storage.obtenerToken()).toBeNull();
    expect(Storage.estaAutenticado()).toBe(false);
  });

  it("eliminarToken borra el token", () => {
    Storage.guardarToken("abc");
    Storage.eliminarToken();
    expect(Storage.obtenerToken()).toBeNull();
  });

  it("persiste y lee el usuario", () => {
    Storage.guardarUsuario({ id: 1, rol: "ADMIN" });
    expect(Storage.obtenerUsuario()).toEqual({ id: 1, rol: "ADMIN" });
  });

  it("obtenerUsuario retorna null cuando no existe", () => {
    expect(Storage.obtenerUsuario()).toBeNull();
  });

  it("limpiarSesion elimina token y usuario", () => {
    Storage.guardarToken("abc");
    Storage.guardarUsuario({ id: 1 });
    Storage.limpiarSesion();
    expect(Storage.obtenerToken()).toBeNull();
    expect(Storage.obtenerUsuario()).toBeNull();
  });

  it("eliminarUsuario borra solo el usuario", () => {
    Storage.guardarToken("abc");
    Storage.guardarUsuario({ id: 1 });
    Storage.eliminarUsuario();
    expect(Storage.obtenerToken()).toBe("abc");
    expect(Storage.obtenerUsuario()).toBeNull();
  });
});