/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/src/**/*.spec.js"],
  transform: {},
  collectCoverageFrom: [
    "src/utils/ApiError.js",
    "src/utils/ApiResponse.js",
    "src/validators/**/*.js",
    "src/dto/MesaDTO.js",
    "src/mappers/MesaMapper.js",
    "src/patterns/prototype/Prototype.js",
    "src/patterns/prototype/PromocionPrototype.js",
    "src/patterns/prototype/MenuPrototype.js",
    "src/patterns/builder/PedidoBuilder.js",
    "src/patterns/builder/DirectorPedido.js",
    "src/services/**/*.js",
    "src/middlewares/**/*.js",
    "!src/**/*.spec.js",
  ],
  coverageDirectory: "./coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  verbose: true,
};