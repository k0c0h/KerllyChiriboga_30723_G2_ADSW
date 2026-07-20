import { describe, it, expect, jest } from "@jest/globals";
import roleMiddleware from "./roleMiddleware.js";

const fakeRes = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() });

describe("roleMiddleware", () => {
  it("retorna 401 cuando falta req.usuario", () => {
    const mw = roleMiddleware("ADMIN");
    const res = fakeRes();
    mw({}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  it("retorna 403 cuando el rol no está permitido", () => {
    const mw = roleMiddleware("ADMIN");
    const res = fakeRes();
    mw({ usuario: { rol: "MESERO" } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("llama a next() cuando el rol está permitido (uno de varios)", () => {
    const mw = roleMiddleware("ADMIN", "CAJA");
    const next = jest.fn();
    mw({ usuario: { rol: "CAJA" } }, fakeRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it("no llama a next() cuando el rol no está permitido", () => {
    const mw = roleMiddleware("ADMIN");
    const next = jest.fn();
    mw({ usuario: { rol: "MESERO" } }, fakeRes(), next);
    expect(next).not.toHaveBeenCalled();
  });
});