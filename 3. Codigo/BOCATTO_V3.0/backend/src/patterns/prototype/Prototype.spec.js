import { describe, it, expect } from "@jest/globals";
import Prototype from "./Prototype.js";
import PromocionPrototype from "./PromocionPrototype.js";
import MenuPrototype from "./MenuPrototype.js";

describe("Prototype (abstracta)", () => {
  it("lanza error cuando clone() no está implementado", () => {
    const p = new Prototype();
    expect(() => p.clone()).toThrow(/clone\(\)/);
  });
});

describe("PromocionPrototype", () => {
  it("devuelve una copia profunda y desacoplada", () => {
    const src = { nombre: "X", descuento: 10, nested: { a: 1 } };
    const clone = new PromocionPrototype(src).clone();
    expect(clone).toEqual(src);
    expect(clone).not.toBe(src);
    expect(clone.nested).not.toBe(src.nested);
  });

  it("clone no altera el original al mutar la copia", () => {
    const src = { nombre: "X", tags: ["a"] };
    const clone = new PromocionPrototype(src).clone();
    clone.tags.push("b");
    expect(src.tags).toEqual(["a"]);
  });
});

describe("MenuPrototype", () => {
  it("devuelve una copia profunda y desacoplada", () => {
    const src = { nombre: "M", precio: 1.5, tags: ["a", "b"] };
    const clone = new MenuPrototype(src).clone();
    expect(clone).toEqual(src);
    expect(clone).not.toBe(src);
    expect(clone.tags).not.toBe(src.tags);
  });
});