import { describe, it, expect } from "@jest/globals";
import MesaDTO from "./MesaDTO.js";

describe("MesaDTO", () => {
  it("mapea una entidad tipo Mongoose a su forma pública", () => {
    const d = new MesaDTO({ _id: "x1", numero: 7, capacidad: 4, estado: "LIBRE", extra: "ignored" });
    expect(d).toEqual({ id: "x1", numero: 7, capacidad: 4, estado: "LIBRE" });
  });

  it("no expone campos privados (extra)", () => {
    const d = new MesaDTO({ _id: "x", numero: 1, capacidad: 2, estado: "LIBRE", __v: 3 });
    expect(d).not.toHaveProperty("__v");
    expect(d).not.toHaveProperty("extra");
  });
});