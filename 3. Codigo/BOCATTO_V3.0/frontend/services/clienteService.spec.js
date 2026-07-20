import { describe, it, expect, beforeEach, vi } from "vitest";
import ClienteService from "./clienteService.js";
import Storage from "../utils/storage.js";

const jsonResponse = (body) => ({ ok: true, status: 200, json: () => Promise.resolve(body) });

describe("ClienteService", () => {
  let fetchMock;
  beforeEach(() => {
    localStorage.clear();
    Storage.guardarToken("T0K3N");
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("listar llama a GET /clientes con token", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, data: [] }));
    await ClienteService.listar();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://bocatto-2gaz.onrender.com/api/v1/clientes");
    expect(init.headers.Authorization).toBe("Bearer T0K3N");
  });

  it("obtener llama a GET /clientes/:id", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await ClienteService.obtener("c1");
    expect(fetchMock.mock.calls[0][0]).toContain("/clientes/c1");
  });

  it("crear envía POST /clientes", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await ClienteService.crear({ nombre: "Ana", telefono: "555" });
    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ nombre: "Ana", telefono: "555" }));
  });

  it("actualizar envía PUT /clientes/:id", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await ClienteService.actualizar("c1", { nombre: "X" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/clientes/c1");
    expect(init.method).toBe("PUT");
  });

  it("eliminar envía DELETE /clientes/:id", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await ClienteService.eliminar("c1");
    expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
  });

  it("omite Authorization cuando no hay token", async () => {
    Storage.eliminarToken();
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await ClienteService.listar();
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });
});