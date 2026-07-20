import { describe, it, expect, beforeEach, vi } from "vitest";
import MesaService from "./mesaService.js";
import Storage from "../utils/storage.js";

const jsonResponse = (body, status = 200) => ({
  ok: true,
  status,
  json: () => Promise.resolve(body),
});

describe("MesaService", () => {
  let fetchMock;

  beforeEach(() => {
    localStorage.clear();
    Storage.guardarToken("T0K3N");
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("listar llama a GET /mesas con token bearer y URL base v3", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, data: [] }));
    await MesaService.listar();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://bocatto-2gaz.onrender.com/api/v1/mesas");
    expect(init.headers.Authorization).toBe("Bearer T0K3N");
  });

  it("obtener usa GET /mesas/:id", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await MesaService.obtener("m1");
    expect(fetchMock.mock.calls[0][0]).toContain("/mesas/m1");
  });

  it("crear envía POST con cuerpo JSON", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await MesaService.crear({ numero: 1, capacidad: 2 });
    const [url, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ numero: 1, capacidad: 2 }));
  });

  it("actualizar usa PUT /mesas/:id", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await MesaService.actualizar("m1", { numero: 2 });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/mesas/m1");
    expect(init.method).toBe("PUT");
  });

  it("eliminar usa DELETE /mesas/:id", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await MesaService.eliminar("m1");
    expect(fetchMock.mock.calls[0][0]).toContain("/mesas/m1");
    expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
  });

  it("cambiarEstado usa PATCH /mesas/:id/estado con body {estado}", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await MesaService.cambiarEstado("m1", "OCUPADA");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/mesas/m1/estado");
    expect(init.method).toBe("PATCH");
    expect(init.body).toBe(JSON.stringify({ estado: "OCUPADA" }));
  });

  it("omite el encabezado Authorization cuando no hay token (corrección V3.0)", async () => {
    Storage.eliminarToken();
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await MesaService.listar();
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBeUndefined();
    expect(init.headers["Content-Type"]).toBe("application/json");
  });
});