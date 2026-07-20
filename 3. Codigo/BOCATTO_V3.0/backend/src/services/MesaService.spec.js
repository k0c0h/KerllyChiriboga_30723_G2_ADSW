import { describe, it, expect, jest, beforeEach } from "@jest/globals";

const mock = await jest.unstable_mockModule("../repositories/MesaRepository.js", () => ({
  default: {
    obtenerTodas: jest.fn(),
    obtenerPorNumero: jest.fn(),
    obtenerPorId: jest.fn(),
    actualizarEstado: jest.fn(),
    crear: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(),
  },
}));

const MesaRepository = (await import("../repositories/MesaRepository.js")).default;
const { default: MesaService } = await import("./MesaService.js");

describe("MesaService", () => {
  beforeEach(() => jest.clearAllMocks());

  it("listarMesas delega en el repositorio", async () => {
    MesaRepository.obtenerTodas.mockResolvedValue([{ _id: "m1" }]);
    await expect(MesaService.listarMesas()).resolves.toEqual([{ _id: "m1" }]);
  });

  it("obtenerMesa delega en obtenerPorNumero", async () => {
    MesaRepository.obtenerPorNumero.mockResolvedValue({ _id: "m1", numero: 3 });
    const r = await MesaService.obtenerMesa(3);
    expect(r).toMatchObject({ numero: 3 });
  });

  it("obtenerMesaPorId lanza 404 cuando no existe", async () => {
    MesaRepository.obtenerPorId.mockResolvedValue(null);
    await expect(MesaService.obtenerMesaPorId("x")).rejects.toMatchObject({ status: 404 });
  });

  it("obtenerMesaPorId retorna la mesa cuando existe", async () => {
    MesaRepository.obtenerPorId.mockResolvedValue({ _id: "m1" });
    await expect(MesaService.obtenerMesaPorId("m1")).resolves.toMatchObject({ _id: "m1" });
  });

  it("cambiarEstado lanza 404 cuando no existe", async () => {
    MesaRepository.actualizarEstado.mockResolvedValue(null);
    await expect(MesaService.cambiarEstado("x", "OCUPADA")).rejects.toMatchObject({ status: 404 });
  });

  it("crearMesa rechaza numero duplicado", async () => {
    MesaRepository.obtenerPorNumero.mockResolvedValue({ _id: "m1", numero: 3 });
    await expect(MesaService.crearMesa({ numero: 3 })).rejects.toMatchObject({ status: 400 });
  });

  it("crearMesa crea cuando no hay duplicado", async () => {
    MesaRepository.obtenerPorNumero.mockResolvedValue(null);
    MesaRepository.crear.mockResolvedValue({ _id: "m2", numero: 4 });
    const r = await MesaService.crearMesa({ numero: 4, capacidad: 2 });
    expect(r).toMatchObject({ numero: 4 });
  });

  it("actualizarMesa rechaza numero duplicado de otra mesa", async () => {
    MesaRepository.obtenerPorNumero.mockResolvedValue({ _id: "other", numero: 3 });
    await expect(MesaService.actualizarMesa("m1", { numero: 3 })).rejects.toMatchObject({ status: 400 });
  });

  it("actualizarMesa permite conservar el mismo numero", async () => {
    MesaRepository.obtenerPorNumero.mockResolvedValue({ _id: "m1", numero: 3 });
    MesaRepository.actualizar.mockResolvedValue({ _id: "m1", numero: 3 });
    const r = await MesaService.actualizarMesa("m1", { numero: 3 });
    expect(r).toMatchObject({ _id: "m1" });
  });

  it("actualizarMesa lanza 404 cuando no existe", async () => {
    MesaRepository.actualizar.mockResolvedValue(null);
    await expect(MesaService.actualizarMesa("x", { capacidad: 4 })).rejects.toMatchObject({ status: 404 });
  });

  it("eliminarMesa lanza 404 cuando no existe", async () => {
    MesaRepository.eliminar.mockResolvedValue(null);
    await expect(MesaService.eliminarMesa("x")).rejects.toMatchObject({ status: 404 });
  });
});