import { describe, it, expect, beforeEach, vi } from "vitest";
import UsuarioService from "./usuarioService.js";
import Storage from "../utils/storage.js";

const jsonResponse = (body) => ({ ok: true, status: 200, json: () => Promise.resolve(body) });

describe("UsuarioService", () => {
  let fetchMock;
  beforeEach(() => {
    localStorage.clear();
    Storage.guardarToken("T0K3N");
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("listar llama a GET /usuarios con token", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, data: [] }));
    await UsuarioService.listar();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://bocatto-2gaz.onrender.com/api/v1/usuarios");
    expect(init.headers.Authorization).toBe("Bearer T0K3N");
  });

  it("obtener llama a GET /usuarios/:id", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await UsuarioService.obtener("u1");
    expect(fetchMock.mock.calls[0][0]).toContain("/usuarios/u1");
  });

  it("crear envía POST /usuarios", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await UsuarioService.crear({ nombre: "x", username: "y", password: "123456", rol: "ADMIN" });
    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ nombre: "x", username: "y", password: "123456", rol: "ADMIN" }));
  });

  it("actualizar envía PUT /usuarios/:id", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await UsuarioService.actualizar("u1", { nombre: "X" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/usuarios/u1");
    expect(init.method).toBe("PUT");
  });

  it("eliminar envía DELETE /usuarios/:id", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await UsuarioService.eliminar("u1");
    expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
  });

  it("omite Authorization cuando no hay token", async () => {
    Storage.eliminarToken();
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await UsuarioService.listar();
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });
});