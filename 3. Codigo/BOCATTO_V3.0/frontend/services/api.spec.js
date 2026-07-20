import { describe, it, expect } from "vitest";
import API from "./api.js";

describe("api", () => {
  it("expone la URL base v3 (render)", () => {
    expect(API).toBe("https://bocatto-2gaz.onrender.com/api/v1");
  });
});