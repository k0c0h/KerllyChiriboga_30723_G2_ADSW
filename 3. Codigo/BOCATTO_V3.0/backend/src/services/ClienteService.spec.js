import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.unstable_mockModule("../repositories/ClienteRepository.js", () => ({
  default: {
    obtenerTodos: jest.fn(),
    obtenerPorId: jest.fn(),
    crear: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(),
  },
}));

const ClienteRepository = (await import("../repositories/ClienteRepository.js")).default;
const { default: ClienteService } = await import("./ClienteService.js");

describe("ClienteService", () => {
  beforeEach(() => jest.clearAllMocks());

  it("listarClientes delega en obtenerTodos", async () => {
    ClienteRepository.obtenerTodos.mockResolvedValue([{ _id: "c1" }]);
    const r = await ClienteService.listarClientes();
    expect(r).toEqual([{ _id: "c1" }]);
  });

  it("obtenerCliente delega en obtenerPorId", async () => {
    ClienteRepository.obtenerPorId.mockResolvedValue({ _id: "c1", nombre: "Ana" });
    const r = await ClienteService.obtenerCliente("c1");
    expect(r).toMatchObject({ nombre: "Ana" });
  });

  it("crearCliente delega en crear", async () => {
    ClienteRepository.crear.mockResolvedValue({ _id: "c2", nombre: "Bo" });
    const r = await ClienteService.crearCliente({ nombre: "Bo" });
    expect(ClienteRepository.crear).toHaveBeenCalledWith({ nombre: "Bo" });
    expect(r).toMatchObject({ nombre: "Bo" });
  });

  it("actualizarCliente delega en actualizar", async () => {
    ClienteRepository.actualizar.mockResolvedValue({ _id: "c1", nombre: "X" });
    await ClienteService.actualizarCliente("c1", { nombre: "X" });
    expect(ClienteRepository.actualizar).toHaveBeenCalledWith("c1", { nombre: "X" });
  });

  it("eliminarCliente delega en eliminar", async () => {
    ClienteRepository.eliminar.mockResolvedValue({ _id: "c1" });
    await ClienteService.eliminarCliente("c1");
    expect(ClienteRepository.eliminar).toHaveBeenCalledWith("c1");
  });
});