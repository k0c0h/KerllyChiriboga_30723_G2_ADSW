import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.unstable_mockModule("bcryptjs", () => ({ default: { hash: jest.fn() } }));
jest.unstable_mockModule("../repositories/UsuarioRepository.js", () => ({
  default: {
    obtenerTodos: jest.fn(),
    obtenerPorId: jest.fn(),
    obtenerPorUsername: jest.fn(),
    crear: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(),
  },
}));

const bcrypt = (await import("bcryptjs")).default;
const UsuarioRepository = (await import("../repositories/UsuarioRepository.js")).default;
const { default: UsuarioService } = await import("./UsuarioService.js");

describe("UsuarioService", () => {
  beforeEach(() => jest.clearAllMocks());

  it("listarUsuarios delega en obtenerTodos", async () => {
    UsuarioRepository.obtenerTodos.mockResolvedValue([{ _id: "u1" }]);
    const r = await UsuarioService.listarUsuarios();
    expect(r).toEqual([{ _id: "u1" }]);
  });

  it("obtenerUsuario delega en obtenerPorId", async () => {
    UsuarioRepository.obtenerPorId.mockResolvedValue({ _id: "u1", username: "x" });
    const r = await UsuarioService.obtenerUsuario("u1");
    expect(r).toMatchObject({ username: "x" });
  });

  it("crearUsuario rechaza username duplicado (ApiError 400)", async () => {
    UsuarioRepository.obtenerPorUsername.mockResolvedValue({ _id: "u1", username: "admin" });
    await expect(UsuarioService.crearUsuario({ username: "admin", password: "123" })).rejects.toMatchObject({
      status: 400,
      message: /ya existe/,
    });
    expect(UsuarioRepository.crear).not.toHaveBeenCalled();
  });

  it("crearUsuario hashea la contraseña y delega en crear", async () => {
    UsuarioRepository.obtenerPorUsername.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("HASHED");
    UsuarioRepository.crear.mockResolvedValue({ _id: "u2", username: "nuevo" });
    const r = await UsuarioService.crearUsuario({ username: "nuevo", password: "123456", rol: "ADMIN" });
    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
    expect(UsuarioRepository.crear).toHaveBeenCalledWith(expect.objectContaining({ password: "HASHED" }));
    expect(r).toMatchObject({ username: "nuevo" });
  });

  it("actualizarUsuario hashea la contraseña si viene", async () => {
    bcrypt.hash.mockResolvedValue("HASHED2");
    UsuarioRepository.actualizar.mockResolvedValue({ _id: "u1" });
    await UsuarioService.actualizarUsuario("u1", { password: "nueva" });
    expect(bcrypt.hash).toHaveBeenCalledWith("nueva", 10);
    expect(UsuarioRepository.actualizar).toHaveBeenCalledWith("u1", expect.objectContaining({ password: "HASHED2" }));
  });

  it("actualizarUsuario no hashea si no viene contraseña", async () => {
    UsuarioRepository.actualizar.mockResolvedValue({ _id: "u1" });
    await UsuarioService.actualizarUsuario("u1", { nombre: "X" });
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it("eliminarUsuario delega en eliminar", async () => {
    UsuarioRepository.eliminar.mockResolvedValue({ _id: "u1" });
    await UsuarioService.eliminarUsuario("u1");
    expect(UsuarioRepository.eliminar).toHaveBeenCalledWith("u1");
  });
});