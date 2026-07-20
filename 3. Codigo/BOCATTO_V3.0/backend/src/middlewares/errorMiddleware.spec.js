import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import errorMiddleware from "./errorMiddleware.js";
import ApiError from "../utils/ApiError.js";

const fakeRes = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() });

describe("errorMiddleware", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => console.error.mockRestore());

  it("renderiza el sobre JSON con el status del ApiError", () => {
    const res = fakeRes();
    errorMiddleware(new ApiError("mal", 400), {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "mal", data: null });
  });

  it("usa 500 cuando el error no tiene status", () => {
    const res = fakeRes();
    errorMiddleware(new Error("boom"), {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "boom" }));
  });
});