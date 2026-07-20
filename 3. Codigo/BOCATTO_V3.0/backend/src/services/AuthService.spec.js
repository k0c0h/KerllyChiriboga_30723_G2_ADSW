import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    compare: jest.fn(),
  },
}));
jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: jest.fn(),
    verify: jest.fn(),
  },
}));
jest.unstable_mockModule("../repositories/UsuarioRepository.js", () => ({
  default: {
    obtenerPorUsername: jest.fn(),
    actualizarIntentos: jest.fn(),
    bloquearUsuario: jest.fn(),
    desbloquearUsuario: jest.fn(),
  },
}));

const bcrypt = (await import("bcryptjs")).default;
const jwt = (await import("jsonwebtoken")).default;
const UsuarioRepository = (await import("../repositories/UsuarioRepository.js")).default;
const { default: AuthService } = await import("./AuthService.js");

const user = (over = {}) => ({
  _id: "u1",
  username: "admin",
  password: "h",
  bloqueado: false,
  intentosFallidos: 0,
  rol: "ADMIN",
  bloqueadoHasta: null,
  ...over,
});

describe("AuthService.login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "secret";
  });

  it("rechaza username desconocido", async () => {
    UsuarioRepository.obtenerPorUsername.mockResolvedValue(null);
    await expect(AuthService.login("x", "y")).rejects.toThrow(/no existe/);
  });

  it("rechaza (403 BLOQUEADO:N) una cuenta bloqueada dentro de la ventana", async () => {
    const futuro = new Date(Date.now() + 120_000);
    UsuarioRepository.obtenerPorUsername.mockResolvedValue(user({ bloqueado: true, bloqueadoHasta: futuro }));
    await expect(AuthService.login("admin", "x")).rejects.toMatchObject({ status: 403, message: /BLOQUEADO/ });
    expect(UsuarioRepository.desbloquearUsuario).not.toHaveBeenCalled();
  });

  it("auto-desbloquea y continúa si la ventana de bloqueo expiró", async () => {
    const pasado = new Date(Date.now() - 60_000);
    UsuarioRepository.obtenerPorUsername.mockResolvedValue(user({ bloqueado: true, bloqueadoHasta: pasado }));
    UsuarioRepository.desbloquearUsuario.mockResolvedValue();
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("tok");
    const r = await AuthService.login("admin", "ok");
    expect(UsuarioRepository.desbloquearUsuario).toHaveBeenCalledWith("u1");
    expect(r.token).toBe("tok");
  });

  it("responde 401 INTENTOS:N ante contraseña incorrecta (intentos 1)", async () => {
    UsuarioRepository.obtenerPorUsername.mockResolvedValue(user());
    bcrypt.compare.mockResolvedValue(false);
    UsuarioRepository.actualizarIntentos.mockResolvedValue();
    await expect(AuthService.login("admin", "bad")).rejects.toMatchObject({ status: 401, message: /INTENTOS:2/ });
    expect(UsuarioRepository.actualizarIntentos).toHaveBeenCalledWith("u1", 1);
  });

  it("responde 401 INTENTOS:N ante contraseña incorrecta (intentos 2)", async () => {
    UsuarioRepository.obtenerPorUsername.mockResolvedValue(user({ intentosFallidos: 1 }));
    bcrypt.compare.mockResolvedValue(false);
    UsuarioRepository.actualizarIntentos.mockResolvedValue();
    await expect(AuthService.login("admin", "bad")).rejects.toMatchObject({ status: 401, message: /INTENTOS:1/ });
    expect(UsuarioRepository.actualizarIntentos).toHaveBeenCalledWith("u1", 2);
  });

  it("bloquea la cuenta (403 BLOQUEADO:300) en el 3er intento fallido", async () => {
    UsuarioRepository.obtenerPorUsername.mockResolvedValue(user({ intentosFallidos: 2 }));
    bcrypt.compare.mockResolvedValue(false);
    UsuarioRepository.bloquearUsuario.mockResolvedValue();
    await expect(AuthService.login("admin", "bad")).rejects.toMatchObject({ status: 403, message: /BLOQUEADO:300/ });
    expect(UsuarioRepository.bloquearUsuario).toHaveBeenCalledWith("u1");
  });

  it("reinicia el estado con desbloquearUsuario y devuelve JWT en caso de éxito", async () => {
    UsuarioRepository.obtenerPorUsername.mockResolvedValue(user({ intentosFallidos: 2 }));
    bcrypt.compare.mockResolvedValue(true);
    UsuarioRepository.desbloquearUsuario.mockResolvedValue();
    jwt.sign.mockReturnValue("token.x.y");
    const r = await AuthService.login("admin", "ok");
    expect(UsuarioRepository.desbloquearUsuario).toHaveBeenCalledWith("u1");
    expect(r.token).toBe("token.x.y");
    expect(r.usuario.username).toBe("admin");
  });
});