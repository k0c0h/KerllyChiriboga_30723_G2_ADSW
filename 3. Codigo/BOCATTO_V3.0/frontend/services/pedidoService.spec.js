import { describe, it, expect, beforeEach, vi } from "vitest";
import PedidoService from "./pedidoService.js";
import Storage from "../utils/storage.js";

const jsonResponse = (body, status = 200) => ({ ok: true, status, json: () => Promise.resolve(body) });

describe("PedidoService (RF 3.2.2/3/4/19)", () => {
  let fetchMock;
  beforeEach(() => {
    localStorage.clear();
    Storage.guardarToken("T0K3N");
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("listar llama a GET /pedidos con token", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, data: [] }));
    await PedidoService.listar();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://bocatto-2gaz.onrender.com/api/v1/pedidos");
    expect(init.headers.Authorization).toBe("Bearer T0K3N");
  });

  it("crear envía POST con cuerpo JSON", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await PedidoService.crear({ canal: "MESA", mesa: "m1", items: [] });
    const [url, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ canal: "MESA", mesa: "m1", items: [] }));
  });

  it("actualizar envía PUT /pedidos/:id", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await PedidoService.actualizar("p1", { estado: "LISTO" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/pedidos/p1");
    expect(init.method).toBe("PUT");
    expect(init.body).toBe(JSON.stringify({ estado: "LISTO" }));
  });

  it("buscarPorMesa llama a GET /pedidos/mesa/:idMesa (RF 3.2.15 FE)", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, data: { _id: "p1" } }));
    await PedidoService.buscarPorMesa("m1");
    expect(fetchMock.mock.calls[0][0]).toContain("/pedidos/mesa/m1");
  });

  it("omite Authorization cuando no hay token (corrección V3.0)", async () => {
    Storage.eliminarToken();
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await PedidoService.listar();
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBeUndefined();
  });
});