import { describe, it, expect, beforeEach, vi } from "vitest";
import MenuService from "./menuService.js";
import Storage from "../utils/storage.js";

const jsonResponse = (body) => ({ ok: true, status: 200, json: () => Promise.resolve(body) });

describe("MenuService (RF 3.2.21)", () => {
  let fetchMock;
  beforeEach(() => {
    localStorage.clear();
    Storage.guardarToken("T0K3N");
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("listar llama a GET /menu", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, data: [] }));
    await MenuService.listar();
    expect(fetchMock.mock.calls[0][0]).toBe("https://bocatto-2gaz.onrender.com/api/v1/menu");
  });

  it("obtener llama a GET /menu/:id", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await MenuService.obtener("m1");
    expect(fetchMock.mock.calls[0][0]).toContain("/menu/m1");
  });

  it("crear envía POST /menu con cuerpo JSON", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await MenuService.crear({ nombre: "Café", precio: 2.5 });
    const [url, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ nombre: "Café", precio: 2.5 }));
  });

  it("actualizar envía PUT /menu/:id", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await MenuService.actualizar("m1", { precio: 3 });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/menu/m1");
    expect(init.method).toBe("PUT");
  });

  it("eliminar envía DELETE /menu/:id", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await MenuService.eliminar("m1");
    expect(fetchMock.mock.calls[0][0]).toContain("/menu/m1");
    expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
  });

  it("omite Authorization cuando no hay token", async () => {
    Storage.eliminarToken();
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await MenuService.listar();
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });
});