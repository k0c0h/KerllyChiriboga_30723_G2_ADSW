import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["**/*.spec.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: [
        "utils/storage.js",
        "utils/Auth.js",
        "utils/EstadoPedido.js",
        "utils/Toast.js",
        "utils/Modal.js",
        "utils/EventBus.js",
        "validators/**/*.js",
        "services/**/*.js",
        "assets/js/qr-order-helpers.js",
      ],
      exclude: ["**/*.spec.js"],
      thresholds: {
        statements: 90,
        branches: 85,
        functions: 90,
        lines: 90,
      },
    },
  },
});