import { describe, it, expect, beforeEach, vi } from "vitest";
import CajaService from "./cajaService.js";
import Storage from "../utils/storage.js";

const jsonResponse = (body) => ({ ok: true, status: 200, json: () => Promise.resolve(body) });

describe("CajaService (RF 3.2.14/15/16/17/18)", () => {
  let fetchMock;
  beforeEach(() => {
    localStorage.clear();
    Storage.guardarToken("T0K3N");
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("listar llama a GET /pedidos (RF 3.2.15)", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, data: [] }));
    await CajaService.listar();
    expect(fetchMock.mock.calls[0][0]).toBe("https://bocatto-2gaz.onrender.com/api/v1/pedidos");
  });

  it("cobrar envía PUT /pedidos/:id/pagar con body {metodoPago} (RF 3.2.16/17)", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await CajaService.cobrar("p1", "TARJETA");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/pedidos/p1/pagar");
    expect(init.method).toBe("PUT");
    expect(init.body).toBe(JSON.stringify({ metodoPago: "TARJETA" }));
  });

  it("cobrar usa EFECTIVO por defecto", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await CajaService.cobrar("p1");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).metodoPago).toBe("EFECTIVO");
  });

  it("entregar envía PUT /pedidos/:id con body {estado:ENTREGADO} (RF 3.2.18)", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await CajaService.entregar("p1");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/pedidos/p1");
    expect(init.method).toBe("PUT");
    expect(init.body).toBe(JSON.stringify({ estado: "ENTREGADO" }));
  });

  it("omite Authorization cuando no hay token", async () => {
    Storage.eliminarToken();
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await CajaService.listar();
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });
});