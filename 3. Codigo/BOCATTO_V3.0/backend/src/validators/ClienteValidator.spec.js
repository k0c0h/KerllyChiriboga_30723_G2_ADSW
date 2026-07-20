import { describe, it, expect } from "@jest/globals";
import ClienteValidator from "./ClienteValidator.js";
import ApiError from "../utils/ApiError.js";

describe("ClienteValidator", () => {
  it("acepta un cliente con solo nombre", () => {
    expect(() => ClienteValidator.validar({ nombre: "Ana" })).not.toThrow();
  });

  it("acepta un cliente con nombre y correo válido", () => {
    expect(() => ClienteValidator.validar({ nombre: "Ana", correo: "a@b.com" })).not.toThrow();
  });

  it("rechaza nombre vacío", () => {
    expect(() => ClienteValidator.validar({ nombre: "  " })).toThrow(ApiError);
  });

  it("rechaza correo mal formado", () => {
    expect(() => ClienteValidator.validar({ nombre: "Ana", correo: "bad-format" })).toThrow(/Correo/);
    expect(() => ClienteValidator.validar({ nombre: "Ana", correo: "a@b" })).toThrow(/Correo/);
    expect(() => ClienteValidator.validar({ nombre: "Ana", correo: "@b.com" })).toThrow(/Correo/);
  });
});