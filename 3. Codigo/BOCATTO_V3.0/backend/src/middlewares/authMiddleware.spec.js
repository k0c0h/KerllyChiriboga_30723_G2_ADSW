import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: { verify: jest.fn() },
}));

const jwt = (await import("jsonwebtoken")).default;
const { default: authMiddleware } = await import("./authMiddleware.js");

const fakeRes = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() });

describe("authMiddleware", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "secret";
    jest.clearAllMocks();
  });

  it("retorna 401 cuando no hay encabezado Authorization", () => {
    const res = fakeRes();
    authMiddleware({ headers: {} }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: expect.stringMatching(/Token no enviado/) }));
  });

  it("retorna 401 cuando el token es inválido", () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("bad token");
    });
    const res = fakeRes();
    authMiddleware({ headers: { authorization: "Bearer xyz" } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/Token inválido/) }));
  });

  it("puebla req.usuario y llama next() con un token válido", () => {
    const decoded = { id: "u1", rol: "ADMIN", username: "admin" };
    jwt.verify.mockReturnValue(decoded);
    const next = jest.fn();
    const req = { headers: { authorization: "Bearer good" } };
    authMiddleware(req, fakeRes(), next);
    expect(req.usuario).toEqual(decoded);
    expect(next).toHaveBeenCalled();
  });
});