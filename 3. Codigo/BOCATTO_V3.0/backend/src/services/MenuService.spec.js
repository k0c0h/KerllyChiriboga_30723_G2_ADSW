import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.unstable_mockModule("../repositories/MenuRepository.js", () => ({
  default: {
    obtenerTodos: jest.fn(),
    obtenerDisponibles: jest.fn(),
    obtenerPorId: jest.fn(),
    crear: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(),
  },
}));

const MenuRepository = (await import("../repositories/MenuRepository.js")).default;
const { default: MenuService } = await import("./MenuService.js");

describe("MenuService (RF 3.2.21)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("listarMenu delega en obtenerTodos", async () => {
    MenuRepository.obtenerTodos.mockResolvedValue([{ _id: "p1" }]);
    const r = await MenuService.listarMenu();
    expect(r).toEqual([{ _id: "p1" }]);
  });

  it("listarDisponibles delega en obtenerDisponibles", async () => {
    MenuRepository.obtenerDisponibles.mockResolvedValue([{ _id: "p1", disponible: true }]);
    const r = await MenuService.listarDisponibles();
    expect(r).toHaveLength(1);
    expect(MenuRepository.obtenerDisponibles).toHaveBeenCalled();
  });

  it("obtenerProducto delega en obtenerPorId", async () => {
    MenuRepository.obtenerPorId.mockResolvedValue({ _id: "p1", nombre: "Café" });
    const r = await MenuService.obtenerProducto("p1");
    expect(r).toMatchObject({ nombre: "Café" });
  });

  it("crearProducto delega en crear", async () => {
    MenuRepository.crear.mockResolvedValue({ _id: "p2", nombre: "Té" });
    const r = await MenuService.crearProducto({ nombre: "Té", precio: 1.5 });
    expect(MenuRepository.crear).toHaveBeenCalledWith({ nombre: "Té", precio: 1.5 });
    expect(r).toMatchObject({ nombre: "Té" });
  });

  it("actualizarProducto delega en actualizar", async () => {
    MenuRepository.actualizar.mockResolvedValue({ _id: "p1", precio: 3 });
    await MenuService.actualizarProducto("p1", { precio: 3 });
    expect(MenuRepository.actualizar).toHaveBeenCalledWith("p1", { precio: 3 });
  });

  it("eliminarProducto delega en eliminar", async () => {
    MenuRepository.eliminar.mockResolvedValue({ _id: "p1" });
    await MenuService.eliminarProducto("p1");
    expect(MenuRepository.eliminar).toHaveBeenCalledWith("p1");
  });
});