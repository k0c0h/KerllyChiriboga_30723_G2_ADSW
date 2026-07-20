import { describe, it, expect, beforeEach, vi } from "vitest";
import PromocionesService from "./promocionesService.js";
import Storage from "../utils/storage.js";

const jsonResponse = (body) => ({ ok: true, status: 200, json: () => Promise.resolve(body) });

describe("PromocionesService (RF 3.2.23)", () => {
  let fetchMock;
  beforeEach(() => {
    localStorage.clear();
    Storage.guardarToken("T0K3N");
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("listar llama a GET /promociones", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, data: [] }));
    await PromocionesService.listar();
    expect(fetchMock.mock.calls[0][0]).toBe("https://bocatto-2gaz.onrender.com/api/v1/promociones");
  });

  it("obtener llama a GET /promociones/:id", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await PromocionesService.obtener("pr1");
    expect(fetchMock.mock.calls[0][0]).toContain("/promociones/pr1");
  });

  it("crear envía POST /promociones", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await PromocionesService.crear({ nombre: "X", descuento: 10 });
    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ nombre: "X", descuento: 10 }));
  });

  it("actualizar envía PUT /promociones/:id", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await PromocionesService.actualizar("pr1", { descuento: 20 });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/promociones/pr1");
    expect(init.method).toBe("PUT");
  });

  it("eliminar envía DELETE /promociones/:id", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await PromocionesService.eliminar("pr1");
    expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
  });

  it("omite Authorization cuando no hay token", async () => {
    Storage.eliminarToken();
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await PromocionesService.listar();
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });
});