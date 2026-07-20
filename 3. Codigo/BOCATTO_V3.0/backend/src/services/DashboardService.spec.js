import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.unstable_mockModule("../models/Pedido.js", () => ({
  default: { find: jest.fn() },
}));
jest.unstable_mockModule("../models/Mesa.js", () => ({
  default: { find: jest.fn() },
}));
jest.unstable_mockModule("../models/Cliente.js", () => ({
  default: { find: jest.fn() },
}));

const Pedido = (await import("../models/Pedido.js")).default;
const Mesa = (await import("../models/Mesa.js")).default;
const Cliente = (await import("../models/Cliente.js")).default;
const { default: DashboardService } = await import("./DashboardService.js");

const chainable = (resolved) => {
  const obj = {
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    then: (onFulfilled) => Promise.resolve(resolved).then(onFulfilled),
  };
  return obj;
};

describe("DashboardService.obtenerGrafico (pure, RF 3.2.20)", () => {
  it("mapea los pedidos PAGADO al día de la semana correcto", () => {
    const lunes = new Date("2026-07-13T12:00:00Z");
    const domingo = new Date("2026-07-19T12:00:00Z");
    const pedidos = [
      { estado: "PAGADO", total: 10, createdAt: lunes },
      { estado: "PAGADO", total: 20, createdAt: domingo },
    ];
    const g = DashboardService.obtenerGrafico(pedidos);
    expect(g.labels).toEqual(["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]);
    expect(g.valores).toEqual([10, 0, 0, 0, 0, 0, 20]);
  });

  it("ignora pedidos no PAGADO", () => {
    const lunes = new Date("2026-07-13T12:00:00Z");
    const pedidos = [
      { estado: "PENDIENTE", total: 100, createdAt: lunes },
      { estado: "LISTO", total: 50, createdAt: lunes },
    ];
    const g = DashboardService.obtenerGrafico(pedidos);
    expect(g.valores.every(v => v === 0)).toBe(true);
  });

  it("devuelve 7 ceros para un arreglo vacío", () => {
    const g = DashboardService.obtenerGrafico([]);
    expect(g.valores).toEqual([0, 0, 0, 0, 0, 0, 0]);
  });
});

describe("DashboardService.productosMasVendidos (pure, RF 3.2.20)", () => {
  it("agrega cantidades por nombre de producto", () => {
    const pedidos = [
      { items: [{ nombre: "Café", cantidad: 2 }, { nombre: "Té", cantidad: 1 }] },
      { items: [{ nombre: "Café", cantidad: 3 }] },
    ];
    const r = DashboardService.productosMasVendidos(pedidos);
    const cafe = r.find(p => p.nombre === "Café");
    expect(cafe.cantidad).toBe(5);
  });

  it("ordena descendentemente por cantidad", () => {
    const pedidos = [
      { items: [{ nombre: "A", cantidad: 1 }, { nombre: "B", cantidad: 5 }] },
      { items: [{ nombre: "C", cantidad: 3 }] },
    ];
    const r = DashboardService.productosMasVendidos(pedidos);
    expect(r.map(p => p.nombre)).toEqual(["B", "C", "A"]);
  });

  it("limita a 5 productos", () => {
    const pedidos = [{
      items: [
        { nombre: "A", cantidad: 1 }, { nombre: "B", cantidad: 2 }, { nombre: "C", cantidad: 3 },
        { nombre: "D", cantidad: 4 }, { nombre: "E", cantidad: 5 }, { nombre: "F", cantidad: 6 },
      ],
    }];
    const r = DashboardService.productosMasVendidos(pedidos);
    expect(r).toHaveLength(5);
    expect(r[0].nombre).toBe("F");
  });

  it("maneja pedidos sin items", () => {
    const r = DashboardService.productosMasVendidos([{ items: [] }, { items: [] }]);
    expect(r).toEqual([]);
  });
});

describe("DashboardService.resumen (RF 3.2.20)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("agrega ventas, pedidos activos, mesas ocupadas y clientes", async () => {
    const pedidosTodos = [
      { estado: "PAGADO", total: 10, items: [{ nombre: "Café", cantidad: 2 }], createdAt: new Date("2026-07-13") },
      { estado: "PENDIENTE", total: 5, items: [], createdAt: new Date("2026-07-13") },
    ];
    let callCount = 0;
    Pedido.find.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return Promise.resolve(pedidosTodos);
      return chainable([]);
    });
    Mesa.find.mockResolvedValue([{ estado: "OCUPADA" }, { estado: "LIBRE" }]);
    Cliente.find.mockResolvedValue([{ _id: "c1" }, { _id: "c2" }]);

    const r = await DashboardService.resumen();
    expect(r.ventas).toBe(10);
    expect(r.pedidos).toBe(1);
    expect(r.mesas).toBe(1);
    expect(r.clientes).toBe(2);
    expect(r.grafico.valores).toHaveLength(7);
    expect(r.productos).toHaveLength(1);
  });
});