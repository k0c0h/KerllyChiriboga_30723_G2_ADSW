import { describe, it, expect, beforeEach, vi } from "vitest";
import AuthService from "./authService.js";

const jsonResponse = (body) => ({ ok: true, status: 200, json: () => Promise.resolve(body) });

describe("AuthService (RF 3.2.1 — FE)", () => {
  let fetchMock;
  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("login envía POST /auth/login con username y password en el body", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, data: { token: "t", usuario: { username: "admin" } } }));
    const r = await AuthService.login("admin", "123456");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://bocatto-2gaz.onrender.com/api/v1/auth/login");
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.headers.Authorization).toBeUndefined();
    expect(JSON.parse(init.body)).toEqual({ username: "admin", password: "123456" });
    expect(r.data.token).toBe("t");
  });

  it("propaga el JSON de respuesta en caso de error", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: false, message: "Credenciales inválidas" }));
    const r = await AuthService.login("x", "y");
    expect(r.success).toBe(false);
    expect(r.message).toMatch(/inválidas/);
  });
});