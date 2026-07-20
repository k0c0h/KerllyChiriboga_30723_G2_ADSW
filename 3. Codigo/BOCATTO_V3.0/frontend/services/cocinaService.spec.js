import { describe, it, expect, beforeEach, vi } from "vitest";
import CocinaService from "./cocinaService.js";
import Storage from "../utils/storage.js";

const jsonResponse = (body) => ({ ok: true, status: 200, json: () => Promise.resolve(body) });

describe("CocinaService (RF 3.2.11/12/13)", () => {
  let fetchMock;
  beforeEach(() => {
    localStorage.clear();
    Storage.guardarToken("T0K3N");
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("listar llama a GET /pedidos (RF 3.2.12)", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, data: [] }));
    await CocinaService.listar();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://bocatto-2gaz.onrender.com/api/v1/pedidos");
    expect(init.headers.Authorization).toBe("Bearer T0K3N");
  });

  it("actualizarEstado envía PUT /pedidos/:id con body {estado} (RF 3.2.13)", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await CocinaService.actualizarEstado("p1", "COCINA");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/pedidos/p1");
    expect(init.method).toBe("PUT");
    expect(init.body).toBe(JSON.stringify({ estado: "COCINA" }));
  });

  it("omite Authorization cuando no hay token", async () => {
    Storage.eliminarToken();
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await CocinaService.listar();
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });
});