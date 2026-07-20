import { describe, it, expect } from "@jest/globals";
import ApiError from "./ApiError.js";

describe("ApiError", () => {
  it("extiende Error y expone status 500 por defecto", () => {
    const e = new ApiError("boom");
    expect(e).toBeInstanceOf(Error);
    expect(e).toBeInstanceOf(ApiError);
    expect(e.message).toBe("boom");
    expect(e.status).toBe(500);
  });

  it("usa el código de estado proporcionado", () => {
    const e = new ApiError("bad", 400);
    expect(e.status).toBe(400);
  });

  it("preserva el nombre de la clase en el stack", () => {
    const e = new ApiError("x");
    expect(e.name).toBe("Error");
  });
});