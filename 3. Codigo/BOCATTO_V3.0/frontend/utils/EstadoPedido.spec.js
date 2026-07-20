import { describe, it, expect } from "vitest";
import EstadoPedido from "./EstadoPedido.js";

describe("EstadoPedido", () => {
  it("expone las constantes canónicas de estado", () => {
    expect(EstadoPedido.PENDIENTE).toBe("PENDIENTE");
    expect(EstadoPedido.COCINA).toBe("COCINA");
    expect(EstadoPedido.LISTO).toBe("LISTO");
    expect(EstadoPedido.ENTREGADO).toBe("ENTREGADO");
    expect(EstadoPedido.PAGADO).toBe("PAGADO");
  });
});