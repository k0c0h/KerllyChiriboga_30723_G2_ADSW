import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.unstable_mockModule("../repositories/PromocionRepository.js", () => ({
  default: {
    obtenerTodas: jest.fn(),
    obtenerActivas: jest.fn(),
    obtenerPorId: jest.fn(),
    crear: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(),
  },
}));

const PromocionRepository = (await import("../repositories/PromocionRepository.js")).default;
const { default: PromocionService } = await import("./PromocionService.js");

describe("PromocionService (RF 3.2.23)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("listarPromociones delega en obtenerTodas", async () => {
    PromocionRepository.obtenerTodas.mockResolvedValue([{ _id: "pr1" }]);
    const r = await PromocionService.listarPromociones();
    expect(r).toEqual([{ _id: "pr1" }]);
  });

  it("listarActivas delega en obtenerActivas", async () => {
    PromocionRepository.obtenerActivas.mockResolvedValue([{ _id: "pr1", activa: true }]);
    const r = await PromocionService.listarActivas();
    expect(r).toHaveLength(1);
  });

  it("crearPromocion delega en crear", async () => {
    PromocionRepository.crear.mockResolvedValue({ _id: "pr2", nombre: "X", descuento: 10 });
    const r = await PromocionService.crearPromocion({ nombre: "X", descuento: 10 });
    expect(r).toMatchObject({ nombre: "X" });
  });

  it("actualizarPromocion delega en actualizar", async () => {
    PromocionRepository.actualizar.mockResolvedValue({ _id: "pr1", descuento: 20 });
    await PromocionService.actualizarPromocion("pr1", { descuento: 20 });
    expect(PromocionRepository.actualizar).toHaveBeenCalledWith("pr1", { descuento: 20 });
  });

  it("eliminarPromocion delega en eliminar", async () => {
    PromocionRepository.eliminar.mockResolvedValue({ _id: "pr1" });
    await PromocionService.eliminarPromocion("pr1");
    expect(PromocionRepository.eliminar).toHaveBeenCalledWith("pr1");
  });
});