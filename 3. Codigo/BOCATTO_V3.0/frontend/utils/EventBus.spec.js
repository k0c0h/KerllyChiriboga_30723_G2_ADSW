import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import EventBus from "./EventBus.js";

describe("EventBus", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("emitir/escuchar despacha eventos vía CustomEvent", () => {
    const cb = vi.fn();
    EventBus.escuchar("pedido:creado", cb);
    EventBus.emitir("pedido:creado", { id: 1 });
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls[0][0].detail).toEqual({ id: 1 });
  });

  it("emitir sin detalle usa null por defecto", () => {
    const cb = vi.fn();
    EventBus.escuchar("x", cb);
    EventBus.emitir("x");
    expect(cb.mock.calls[0][0].detail).toBeNull();
  });

  it("eliminar quita un listener específico", () => {
    const cb = vi.fn();
    EventBus.escuchar("x", cb);
    EventBus.eliminar("x", cb);
    EventBus.emitir("x");
    expect(cb).not.toHaveBeenCalled();
  });
});