import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.unstable_mockModule("../repositories/PedidoRepository.js", () => ({
  default: {
    obtenerTodos: jest.fn(),
    obtenerPorId: jest.fn(),
    obtenerPorMesaActiva: jest.fn(),
    obtenerPorCodigoSeguimiento: jest.fn(),
    crear: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(),
  },
}));
jest.unstable_mockModule("../repositories/MenuRepository.js", () => ({
  default: { obtenerPorId: jest.fn(), obtenerTodos: jest.fn(), obtenerDisponibles: jest.fn() },
}));
jest.unstable_mockModule("../repositories/PromocionRepository.js", () => ({
  default: { obtenerPorId: jest.fn(), obtenerTodas: jest.fn(), obtenerActivas: jest.fn() },
}));
jest.unstable_mockModule("../models/Mesa.js", () => ({
  default: { findById: jest.fn(), findByIdAndUpdate: jest.fn() },
}));

const PedidoRepository = (await import("../repositories/PedidoRepository.js")).default;
const MenuRepository = (await import("../repositories/MenuRepository.js")).default;
const PromocionRepository = (await import("../repositories/PromocionRepository.js")).default;
const Mesa = (await import("../models/Mesa.js")).default;
const { default: PedidoService } = await import("./PedidoService.js");

const prod = (id = "p1", over = {}) => ({ _id: id, nombre: "Café", precio: 2.5, ...over });

const datosMesa = (over = {}) => ({
  canal: "MESA",
  mesa: "m1",
  items: [{ producto: "p1", cantidad: 2 }],
  ...over,
});

describe("PedidoService.generarCodigoSeguimiento (pure)", () => {
  it("genera un código con prefijo BC-", () => {
    expect(PedidoService.generarCodigoSeguimiento()).toMatch(/^BC-/);
  });

  it("genera códigos únicos en llamadas sucesivas", () => {
    const codigos = new Set();
    for (let i = 0; i < 100; i++) {
      codigos.add(PedidoService.generarCodigoSeguimiento());
    }
    expect(codigos.size).toBe(100);
  });

  it("tiene 3 partes separadas por guion", () => {
    const partes = PedidoService.generarCodigoSeguimiento().split("-");
    expect(partes).toHaveLength(3);
    expect(partes[0]).toBe("BC");
    expect(partes[1].length).toBeGreaterThan(0);
    expect(partes[2].length).toBeGreaterThan(0);
  });
});

describe("PedidoService.listarPedidos (RF 3.2.12)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("delega en PedidoRepository.obtenerTodos", async () => {
    PedidoRepository.obtenerTodos.mockResolvedValue([{ _id: "ped1" }]);
    const r = await PedidoService.listarPedidos();
    expect(r).toEqual([{ _id: "ped1" }]);
    expect(PedidoRepository.obtenerTodos).toHaveBeenCalled();
  });
});

describe("PedidoService.buscarPorMesa (RF 3.2.15)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("delega en obtenerPorMesaActiva", async () => {
    PedidoRepository.obtenerPorMesaActiva.mockResolvedValue({ _id: "ped1", mesa: "m1" });
    const r = await PedidoService.buscarPorMesa("m1");
    expect(r).toMatchObject({ mesa: "m1" });
    expect(PedidoRepository.obtenerPorMesaActiva).toHaveBeenCalledWith("m1");
  });
});

describe("PedidoService.obtenerPedido (RF 3.2.19)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retorna el pedido si existe", async () => {
    PedidoRepository.obtenerPorId.mockResolvedValue({ _id: "ped1" });
    await expect(PedidoService.obtenerPedido("ped1")).resolves.toMatchObject({ _id: "ped1" });
  });

  it("lanza 404 si no existe", async () => {
    PedidoRepository.obtenerPorId.mockResolvedValue(null);
    await expect(PedidoService.obtenerPedido("x")).rejects.toMatchObject({ status: 404 });
  });
});

describe("PedidoService.crearPedido (RF 3.2.2/3/5/6/7/9)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("crea un pedido MESA válido y marca la mesa OCUPADA (RF 3.2.2/3)", async () => {
    Mesa.findById.mockResolvedValue({ _id: "m1", numero: 1, estado: "LIBRE" });
    MenuRepository.obtenerPorId.mockResolvedValue(prod("p1"));
    PedidoRepository.crear.mockResolvedValue({ _id: "ped1", mesa: "m1", canal: "MESA", total: 5 });
    PedidoRepository.obtenerPorId.mockResolvedValue({ _id: "ped1", mesa: "m1" });
    Mesa.findByIdAndUpdate.mockResolvedValue();

    const r = await PedidoService.crearPedido(datosMesa());
    expect(r).toMatchObject({ canal: "MESA" });
    expect(Mesa.findByIdAndUpdate).toHaveBeenCalledWith("m1", { estado: "OCUPADA" });
  });

  it("rechaza mesa inexistente (RF 3.2.2 excepción)", async () => {
    Mesa.findById.mockResolvedValue(null);
    await expect(PedidoService.crearPedido(datosMesa({ mesa: "mX" }))).rejects.toMatchObject({ status: 404 });
  });

  it("rechaza si un producto no existe (RF 3.2.2 excepción)", async () => {
    Mesa.findById.mockResolvedValue({ _id: "m1", estado: "LIBRE" });
    MenuRepository.obtenerPorId.mockResolvedValue(null);
    await expect(PedidoService.crearPedido(datosMesa())).rejects.toMatchObject({ status: 400, message: /no existe/ });
  });

  it("crea un pedido TELEFONO sin mesa (RF 3.2.5/6)", async () => {
    MenuRepository.obtenerPorId.mockResolvedValue(prod("p1"));
    PedidoRepository.crear.mockResolvedValue({ _id: "pedT", canal: "TELEFONO", total: 5 });
    PedidoRepository.obtenerPorId.mockResolvedValue({ _id: "pedT" });
    const r = await PedidoService.crearPedido({
      canal: "TELEFONO",
      clienteNombre: "Ana",
      telefonoEntrega: "555",
      direccionEntrega: "calle 1",
      items: [{ producto: "p1", cantidad: 2 }],
    });
    expect(r.canal).toBe("TELEFONO");
    expect(Mesa.findById).not.toHaveBeenCalled();
  });

  it("crea un pedido QR sin mesa y genera codigoSeguimiento (RF 3.2.7/9)", async () => {
    MenuRepository.obtenerPorId.mockResolvedValue(prod("p1"));
    PedidoRepository.crear.mockImplementation(async (p) => ({ _id: "pedQ", ...p }));
    PedidoRepository.obtenerPorId.mockResolvedValue({ _id: "pedQ" });
    const r = await PedidoService.crearPedido({
      canal: "QR",
      clienteNombre: "Ana",
      items: [{ producto: "p1", cantidad: 1 }],
    });
    expect(r.canal).toBe("QR");
    expect(r.codigoSeguimiento).toMatch(/^BC-/);
    expect(Mesa.findById).not.toHaveBeenCalled();
  });

  it("crea un pedido QR aplicando promoción (RF 3.2.9 + 3.2.23)", async () => {
    MenuRepository.obtenerPorId.mockResolvedValue(prod("p1"));
    PromocionRepository.obtenerPorId.mockResolvedValue({ _id: "promo1", descuento: 10 });
    PedidoRepository.crear.mockImplementation(async (p) => ({ _id: "pedQ", ...p }));
    PedidoRepository.obtenerPorId.mockResolvedValue({ _id: "pedQ" });
    const r = await PedidoService.crearPedido({
      canal: "QR",
      clienteNombre: "Ana",
      items: [{ producto: "p1", cantidad: 2 }],
      promocion: "promo1",
    });
    expect(r.total).toBeCloseTo(2.5 * 2 * 0.9, 2);
  });

  it("crearPedidoQR fuerza canal=QR y la mesa desde el parámetro (RF 3.2.7)", async () => {
    Mesa.findById.mockResolvedValue({ _id: "mQ", estado: "LIBRE" });
    MenuRepository.obtenerPorId.mockResolvedValue(prod("p1"));
    PedidoRepository.crear.mockImplementation(async (p) => ({ _id: "pedQ", ...p }));
    PedidoRepository.obtenerPorId.mockResolvedValue({ _id: "pedQ" });
    Mesa.findByIdAndUpdate.mockResolvedValue();
    const r = await PedidoService.crearPedidoQR("mQ", {
      clienteNombre: "Ana",
      items: [{ producto: "p1", cantidad: 1 }],
    });
    expect(r.canal).toBe("QR");
    expect(r.mesa).toBe("mQ");
  });

  it("propaga la validación del PedidoValidator (sin items)", async () => {
    await expect(PedidoService.crearPedido({ canal: "MESA", mesa: "m1", items: [] })).rejects.toThrow();
    expect(PedidoRepository.crear).not.toHaveBeenCalled();
  });
});

describe("PedidoService.cambiarEstado (RF 3.2.11/13/18)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("actualiza a LISTO y libera la mesa solo si PAGADO (RF 3.2.13)", async () => {
    PedidoRepository.actualizar.mockResolvedValue({ _id: "p1", estado: "LISTO", mesa: "m1" });
    PedidoRepository.obtenerPorId.mockResolvedValue({ _id: "p1", estado: "LISTO", mesa: "m1" });
    const r = await PedidoService.cambiarEstado("p1", "LISTO");
    expect(r.estado).toBe("LISTO");
    expect(Mesa.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("al PAGAR libera la mesa (RF 3.2.17 + 3.2.14)", async () => {
    PedidoRepository.actualizar.mockResolvedValue({ _id: "p1", estado: "PAGADO", mesa: "m1" });
    PedidoRepository.obtenerPorId.mockResolvedValue({ _id: "p1", estado: "PAGADO", mesa: "m1" });
    await PedidoService.cambiarEstado("p1", "PAGADO", { metodoPago: "EFECTIVO" });
    expect(Mesa.findByIdAndUpdate).toHaveBeenCalledWith("m1", { estado: "LIBRE" });
  });

  it("ENTREGADO no libera la mesa (RF 3.2.18)", async () => {
    PedidoRepository.actualizar.mockResolvedValue({ _id: "p1", estado: "ENTREGADO", mesa: "m1" });
    PedidoRepository.obtenerPorId.mockResolvedValue({ _id: "p1", estado: "ENTREGADO", mesa: "m1" });
    await PedidoService.cambiarEstado("p1", "ENTREGADO");
    expect(Mesa.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("lanza 404 si el pedido no existe", async () => {
    PedidoRepository.actualizar.mockResolvedValue(null);
    await expect(PedidoService.cambiarEstado("x", "LISTO")).rejects.toMatchObject({ status: 404 });
  });
});

describe("PedidoService.pagarPedido (RF 3.2.16/17)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("paga un pedido pendiente (RF 3.2.16/17)", async () => {
    PedidoRepository.obtenerPorId
      .mockResolvedValueOnce({ _id: "p1", estado: "LISTO", mesa: "m1" })
      .mockResolvedValueOnce({ _id: "p1", estado: "PAGADO", mesa: "m1" });
    PedidoRepository.actualizar.mockResolvedValue({ _id: "p1", estado: "PAGADO", mesa: "m1" });
    Mesa.findByIdAndUpdate.mockResolvedValue();
    const r = await PedidoService.pagarPedido("p1", "EFECTIVO");
    expect(r.estado).toBe("PAGADO");
    expect(PedidoRepository.actualizar).toHaveBeenCalledWith("p1", { estado: "PAGADO", metodoPago: "EFECTIVO" });
    expect(Mesa.findByIdAndUpdate).toHaveBeenCalledWith("m1", { estado: "LIBRE" });
  });

  it("rechaza pagar un pedido ya pagado (RF 3.2.17 excepción)", async () => {
    PedidoRepository.obtenerPorId.mockResolvedValue({ _id: "p1", estado: "PAGADO" });
    await expect(PedidoService.pagarPedido("p1")).rejects.toMatchObject({ status: 400, message: /ya fue pagado/ });
  });

  it("lanza 404 si el pedido no existe", async () => {
    PedidoRepository.obtenerPorId.mockResolvedValue(null);
    await expect(PedidoService.pagarPedido("x")).rejects.toMatchObject({ status: 404 });
  });

  it("usa EFECTIVO por defecto", async () => {
    PedidoRepository.obtenerPorId
      .mockResolvedValueOnce({ _id: "p1", estado: "LISTO" })
      .mockResolvedValueOnce({ _id: "p1", estado: "PAGADO" });
    PedidoRepository.actualizar.mockResolvedValue({ _id: "p1", estado: "PAGADO" });
    await PedidoService.pagarPedido("p1");
    expect(PedidoRepository.actualizar).toHaveBeenCalledWith("p1", expect.objectContaining({ metodoPago: "EFECTIVO" }));
  });
});

describe("PedidoService.obtenerSeguimientoPorCodigo (RF 3.2.19)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retorna la forma pública del pedido cuando existe", async () => {
    PedidoRepository.obtenerPorCodigoSeguimiento.mockResolvedValue({
      _id: "p1",
      codigoSeguimiento: "BC-abc-XYZ",
      canal: "QR",
      estado: "LISTO",
      total: 5,
      clienteNombre: "Ana",
      mesa: "m1",
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const r = await PedidoService.obtenerSeguimientoPorCodigo("BC-abc-XYZ");
    expect(r).toMatchObject({ id: "p1", codigoSeguimiento: "BC-abc-XYZ", canal: "QR", estado: "LISTO" });
    expect(r).not.toHaveProperty("_id");
  });

  it("lanza 404 si no existe el código", async () => {
    PedidoRepository.obtenerPorCodigoSeguimiento.mockResolvedValue(null);
    await expect(PedidoService.obtenerSeguimientoPorCodigo("NOPE")).rejects.toMatchObject({ status: 404 });
  });
});

describe("PedidoService.eliminarPedido", () => {
  beforeEach(() => jest.clearAllMocks());

  it("delega en el repositorio", async () => {
    PedidoRepository.eliminar.mockResolvedValue({ _id: "p1" });
    await PedidoService.eliminarPedido("p1");
    expect(PedidoRepository.eliminar).toHaveBeenCalledWith("p1");
  });
});