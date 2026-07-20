import { describe, it, expect, beforeEach, vi } from "vitest";
import ReporteService from "./reporteService.js";
import Storage from "../utils/storage.js";

const jsonResponse = (body) => ({ ok: true, status: 200, json: () => Promise.resolve(body) });

describe("ReporteService (RF 3.2.24)", () => {
  let fetchMock;
  beforeEach(() => {
    localStorage.clear();
    Storage.guardarToken("T0K3N");
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("listar llama a GET /reportes con query params inicio y fin", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, data: [] }));
    await ReporteService.listar("2026-01-01", "2026-01-31");
    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain("/reportes");
    expect(url).toContain("inicio=2026-01-01");
    expect(url).toContain("fin=2026-01-31");
  });

  it("omite Authorization cuando no hay token", async () => {
    Storage.eliminarToken();
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await ReporteService.listar("a", "b");
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });
});