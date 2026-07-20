import { describe, it, expect, vi, beforeEach } from "vitest";
import Toast from "./Toast.js";

describe("Toast", () => {
  let toastInstance;

  beforeEach(() => {
    document.body.innerHTML = "";
    toastInstance = { show: vi.fn() };
    const ctor = vi.fn(() => toastInstance);
    vi.stubGlobal("bootstrap", { Toast: ctor });
  });

  it("success crea un elemento .toast con clase text-bg-success y mensaje", () => {
    Toast.success("ok-msg");
    const el = document.querySelector(".toast");
    expect(el).not.toBeNull();
    expect(el.classList.contains("text-bg-success")).toBe(true);
    expect(el.textContent).toContain("ok-msg");
    expect(toastInstance.show).toHaveBeenCalled();
  });

  it("error usa text-bg-danger", () => {
    Toast.error("bad");
    const el = document.querySelector(".toast");
    expect(el.classList.contains("text-bg-danger")).toBe(true);
    expect(el.textContent).toContain("bad");
  });

  it("warning usa text-bg-warning", () => {
    Toast.warning("warn");
    expect(document.querySelector(".toast").classList.contains("text-bg-warning")).toBe(true);
  });

  it("info usa text-bg-primary", () => {
    Toast.info("info");
    expect(document.querySelector(".toast").classList.contains("text-bg-primary")).toBe(true);
  });

  it("retira el elemento del DOM tras hidden.bs.toast", () => {
    Toast.success("x");
    const el = document.querySelector(".toast");
    expect(el).not.toBeNull();
    el.dispatchEvent(new Event("hidden.bs.toast"));
    expect(document.querySelector(".toast")).toBeNull();
  });
});