import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.unstable_mockModule("../models/Pedido.js", () => {
  const chainable = {
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    then: undefined,
  };
  chainable.then = undefined;
  const mockFind = jest.fn(() => {
    const promise = Promise.resolve([{ _id: "p1" }]);
    promise.populate = jest.fn().mockReturnThis();
    promise.sort = jest.fn().mockReturnThis();
    Object.assign(promise, chainable);
    return promise;
  });
  return { default: { find: mockFind } };
});

const Pedido = (await import("../models/Pedido.js")).default;
const { default: ReporteService } = await import("./ReporteService.js");

describe("ReporteService (RF 3.2.24)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("obtenerVentas construye el filtro por rango de fechas", async () => {
    const chainable = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([{ _id: "p1" }]),
    };
    Pedido.find.mockReturnValueOnce(chainable);

    await ReporteService.obtenerVentas("2026-01-01", "2026-01-31");

    const filtroUsada = Pedido.find.mock.calls[0][0];
    expect(filtroUsada.estado).toEqual({ $in: ["PAGADO", "ENTREGADO"] });
    expect(filtroUsada.createdAt).toBeDefined();
    expect(filtroUsada.createdAt.$gte).toEqual(new Date("2026-01-01"));
    expect(filtroUsada.createdAt.$lte).toEqual(new Date("2026-01-31"));
  });

  it("obtenerVentas sin fechas solo filtra por estado", async () => {
    const chainable = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([]),
    };
    Pedido.find.mockReturnValueOnce(chainable);

    await ReporteService.obtenerVentas();

    const filtroUsada = Pedido.find.mock.calls[0][0];
    expect(filtroUsada.estado).toEqual({ $in: ["PAGADO", "ENTREGADO"] });
    expect(filtroUsada.createdAt).toBeUndefined();
  });

  it("encadena populate(mesa) y populate(cliente) y sort descendente", async () => {
    const chainable = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([{ _id: "p1" }]),
    };
    Pedido.find.mockReturnValueOnce(chainable);

    await ReporteService.obtenerVentas();
    expect(chainable.populate).toHaveBeenCalledWith("mesa");
    expect(chainable.populate).toHaveBeenCalledWith("cliente");
    expect(chainable.sort).toHaveBeenCalledWith({ createdAt: -1 });
  });
});