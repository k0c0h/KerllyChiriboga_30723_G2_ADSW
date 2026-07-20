import { describe, it, expect, jest } from "@jest/globals";
import ApiResponse from "./ApiResponse.js";

const fakeRes = () => {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json = jest.fn().mockReturnValue(r);
  return r;
};

describe("ApiResponse.success", () => {
  it("retorna el sobre de éxito con 200 por defecto y data null", () => {
    const r = fakeRes();
    ApiResponse.success(r, "ok");
    expect(r.status).toHaveBeenCalledWith(200);
    expect(r.json).toHaveBeenCalledWith({ success: true, message: "ok", data: null });
  });

  it("incluye data cuando se proporciona", () => {
    const r = fakeRes();
    ApiResponse.success(r, "ok", { a: 1 });
    expect(r.json).toHaveBeenCalledWith({ success: true, message: "ok", data: { a: 1 } });
  });

  it("respeta un código de estado personalizado", () => {
    const r = fakeRes();
    ApiResponse.success(r, "created", null, 201);
    expect(r.status).toHaveBeenCalledWith(201);
  });

  it("retorna el resultado de res.json() para encadenar", () => {
    const r = fakeRes();
    const out = ApiResponse.success(r, "ok");
    expect(out).toBe(r);
  });
});