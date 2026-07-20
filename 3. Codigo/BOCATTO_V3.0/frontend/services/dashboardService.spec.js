import { describe, it, expect, beforeEach, vi } from "vitest";
import DashboardService from "./dashboardService.js";
import Storage from "../utils/storage.js";

const jsonResponse = (body) => ({ ok: true, status: 200, json: () => Promise.resolve(body) });

describe("DashboardService (RF 3.2.20)", () => {
  let fetchMock;
  beforeEach(() => {
    localStorage.clear();
    Storage.guardarToken("T0K3N");
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("obtenerResumen llama a GET /dashboard/resumen con token", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, data: {} }));
    await DashboardService.obtenerResumen();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://bocatto-2gaz.onrender.com/api/v1/dashboard/resumen");
    expect(init.headers.Authorization).toBe("Bearer T0K3N");
  });

  it("omite Authorization cuando no hay token", async () => {
    Storage.eliminarToken();
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    await DashboardService.obtenerResumen();
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });
});