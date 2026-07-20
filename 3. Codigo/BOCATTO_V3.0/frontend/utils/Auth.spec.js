import { describe, it, expect, beforeEach, vi } from "vitest";
import Auth from "./Auth.js";
import Storage from "./storage.js";

describe("Auth", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("autenticado delega en Storage", () => {
    expect(Auth.autenticado()).toBe(false);
    Storage.guardarToken("t");
    expect(Auth.autenticado()).toBe(true);
  });

  it("usuario retorna el usuario guardado", () => {
    Storage.guardarUsuario({ rol: "CAJA" });
    expect(Auth.usuario()).toEqual({ rol: "CAJA" });
  });

  it("rol retorna el rol del usuario actual", () => {
    Storage.guardarUsuario({ rol: "CAJA" });
    expect(Auth.rol()).toBe("CAJA");
  });

  it("rol retorna null cuando no hay usuario", () => {
    expect(Auth.rol()).toBeNull();
  });

  it("tieneRol coincide con uno de los roles listados", () => {
    Storage.guardarUsuario({ rol: "MESERO" });
    expect(Auth.tieneRol("ADMIN", "MESERO")).toBe(true);
    expect(Auth.tieneRol("ADMIN", "CAJA")).toBe(false);
  });

  it("tieneRol retorna false cuando no hay usuario", () => {
    expect(Auth.tieneRol("ADMIN")).toBe(false);
  });

  it("verificarSesion redirige a login.html cuando no autenticado y retorna false", () => {
    delete window.location;
    window.location = { href: "" };
    const r = Auth.verificarSesion();
    expect(r).toBe(false);
    expect(window.location.href).toBe("login.html");
  });

  it("verificarSesion retorna true cuando está autenticado", () => {
    Storage.guardarToken("t");
    expect(Auth.verificarSesion()).toBe(true);
  });

  it("cerrarSesion limpia el almacenamiento y redirige a login.html", () => {
    Storage.guardarToken("t");
    Storage.guardarUsuario({ id: 1 });
    delete window.location;
    window.location = { href: "" };
    Auth.cerrarSesion();
    expect(Storage.obtenerToken()).toBeNull();
    expect(Storage.obtenerUsuario()).toBeNull();
    expect(window.location.href).toBe("login.html");
  });
});