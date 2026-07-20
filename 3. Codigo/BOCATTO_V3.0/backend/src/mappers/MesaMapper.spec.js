import { describe, it, expect } from "@jest/globals";
import MesaMapper from "./MesaMapper.js";
import MesaDTO from "../dto/MesaDTO.js";

describe("MesaMapper", () => {
  it("toDTO envuelve una sola entidad", () => {
    const dto = MesaMapper.toDTO({ _id: "a", numero: 1, capacidad: 2, estado: "LIBRE" });
    expect(dto).toBeInstanceOf(MesaDTO);
    expect(dto).toEqual({ id: "a", numero: 1, capacidad: 2, estado: "LIBRE" });
  });

  it("toDTOList envuelve un arreglo de entidades", () => {
    const list = MesaMapper.toDTOList([
      { _id: "a", numero: 1, capacidad: 2, estado: "LIBRE" },
      { _id: "b", numero: 2, capacidad: 4, estado: "OCUPADA" },
    ]);
    expect(list).toHaveLength(2);
    expect(list[0]).toBeInstanceOf(MesaDTO);
    expect(list[1].numero).toBe(2);
  });

  it("toDTOList maneja un arreglo vacío", () => {
    expect(MesaMapper.toDTOList([])).toEqual([]);
  });
});