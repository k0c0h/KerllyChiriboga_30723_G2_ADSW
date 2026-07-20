import { describe, it, expect, vi, beforeEach } from "vitest";
import Modal from "./Modal.js";

describe("Modal", () => {
  let modalInstance;
  let getOrCreateSpy;

  beforeEach(() => {
    document.body.innerHTML = '<div id="m1"></div><div id="m2"></div>';
    modalInstance = { show: vi.fn(), hide: vi.fn() };
    const instances = { m1: modalInstance };
    getOrCreateSpy = vi.fn((el) => instances[el.id] || { show: vi.fn(), hide: vi.fn() });
    const getInstanceSpy = vi.fn((el) => instances[el.id] || null);
    vi.stubGlobal("bootstrap", {
      Modal: {
        getOrCreateInstance: getOrCreateSpy,
        getInstance: getInstanceSpy,
      },
    });
  });

  it("abrir llama a bootstrap.Modal.getOrCreateInstance(...).show()", () => {
    Modal.abrir("m1");
    expect(getOrCreateSpy).toHaveBeenCalled();
    expect(modalInstance.show).toHaveBeenCalled();
  });

  it("cerrar llama a bootstrap.Modal.getInstance(...).hide()", () => {
    Modal.cerrar("m1");
    expect(modalInstance.hide).toHaveBeenCalled();
  });

  it("abrir no hace nada si el elemento no existe", () => {
    expect(() => Modal.abrir("no-existe")).not.toThrow();
  });

  it("cerrar no hace nada si la instancia no existe", () => {
    expect(() => Modal.cerrar("m2")).not.toThrow();
  });
});