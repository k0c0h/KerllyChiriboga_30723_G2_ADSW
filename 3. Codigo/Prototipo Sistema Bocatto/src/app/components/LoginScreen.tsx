import { useState, useEffect } from "react";
import { Lock, User, ChefHat, AlertCircle, Smartphone, ShieldAlert, Clock } from "lucide-react";

type Role = "mesero" | "operador"; // | "administrador";

interface LoginUser {
  username: string;
  password: string;
  role: Role;
  name: string;
}

const USUARIOS: LoginUser[] = [
  { username: "mesero", password: "1234", role: "mesero", name: "Carlos Méndez" },
  { username: "operador", password: "1234", role: "operador", name: "Ana Torres" },
  // { username: "admin", password: "1234", role: "administrador", name: "Diego Ramírez" },
];

interface Props {
  onLogin: (user: { username: string; name: string; role: Role }) => void;
  onClientAccess: () => void;
}

const MAX_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 30;

export function LoginScreen({ onLogin, onClientAccess }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  useEffect(() => {
    if (!isLocked) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockedUntil! - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockedUntil(null);
        setFailedAttempts(0);
        setSecondsLeft(0);
        setError("");
        clearInterval(interval);
      } else {
        setSecondsLeft(remaining);
      }
    }, 500);
    setSecondsLeft(Math.ceil((lockedUntil! - Date.now()) / 1000));
    return () => clearInterval(interval);
  }, [lockedUntil, isLocked]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setError("");
    setLoading(true);

    setTimeout(() => {
      const user = USUARIOS.find(
        (u) => u.username === username.toLowerCase().trim() && u.password === password
      );

      if (user) {
        setFailedAttempts(0);
        onLogin({ username: user.username, name: user.name, role: user.role });
      } else {
        const newCount = failedAttempts + 1;
        setFailedAttempts(newCount);
        if (newCount >= MAX_ATTEMPTS) {
          setLockedUntil(Date.now() + LOCKOUT_SECONDS * 1000);
          setError("");
        } else {
          const remaining = MAX_ATTEMPTS - newCount;
          setError(
            `Credenciales incorrectas. ${remaining} intento${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""} antes del bloqueo.`
          );
        }
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500 shadow-lg mb-4">
            <ChefHat size={40} className="text-white" />
          </div>
          <h1 className="text-4xl text-amber-400 mb-1" style={{ fontFamily: "Georgia, serif" }}>
            Bocatto
          </h1>
          <p className="text-amber-200/70 text-sm tracking-widest uppercase">Valley · Sistema de Gestión</p>
        </div>

        {/* Card */}
        <div className="bg-stone-800/80 backdrop-blur border border-stone-700/50 rounded-2xl shadow-2xl p-8">
          <h2 className="text-white text-center mb-6">Iniciar Sesión</h2>
          <p className="text-stone-400 text-center text-sm mb-6">
            RF-00 · Autenticación al Sistema
          </p>

          {/* Locked state */}
          {isLocked ? (
            <div className="space-y-4">
              <div className="bg-red-950/60 border border-red-700/60 rounded-xl p-5 text-center">
                <ShieldAlert size={36} className="text-red-400 mx-auto mb-3" />
                <p className="text-red-300 mb-1">Acceso bloqueado temporalmente</p>
                <p className="text-stone-400 text-sm mb-4">
                  Se detectaron {MAX_ATTEMPTS} intentos fallidos consecutivos.
                </p>
                <div className="inline-flex items-center gap-2 bg-stone-900/60 border border-stone-700 rounded-lg px-4 py-2">
                  <Clock size={16} className="text-amber-400" />
                  <span className="text-amber-300">Puede reintentar en </span>
                  <span className="text-amber-400 tabular-nums">{secondsLeft}s</span>
                </div>
              </div>
              <div className="w-full bg-stone-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${(secondsLeft / LOCKOUT_SECONDS) * 100}%` }}
                />
              </div>
              <p className="text-stone-500 text-xs text-center">
                Por seguridad, el acceso se restablece automáticamente.
              </p>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-stone-300 text-sm mb-2">Usuario</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingrese su usuario"
                  className="w-full bg-stone-700/60 border border-stone-600 text-white placeholder-stone-500 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-300 text-sm mb-2">Contraseña</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  className="w-full bg-stone-700/60 border border-stone-600 text-white placeholder-stone-500 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            {failedAttempts > 0 && !isLocked && (
              <div className="flex items-center gap-1.5 justify-center">
                {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      i < failedAttempts ? "bg-red-500" : "bg-stone-600"
                    }`}
                  />
                ))}
                <span className="text-stone-400 text-xs ml-1">
                  {MAX_ATTEMPTS - failedAttempts} intento{MAX_ATTEMPTS - failedAttempts !== 1 ? "s" : ""} restante{MAX_ATTEMPTS - failedAttempts !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-lg p-3">
                <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-700 text-stone-900 rounded-lg py-3 transition-colors font-medium"
            >
              {loading ? "Verificando..." : "Ingresar al Sistema"}
            </button>
          </form>
          )}

          {/* Client Access Button */}
          <div className="mt-4">
            <button
              onClick={onClientAccess}
              className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 rounded-lg py-3 transition-colors flex items-center justify-center gap-2"
            >
              <Smartphone size={18} />
              <span>Acceso Cliente (sin login)</span>
            </button>
            <p className="text-stone-500 text-xs text-center mt-2">Escanee el código QR de su mesa para realizar un pedido</p>
          </div>

          {/* Credentials hint */}
          <div className="mt-6 pt-6 border-t border-stone-700">
            <p className="text-stone-500 text-xs text-center mb-3">Credenciales de prueba (contraseña: 1234)</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { role: "Mesero", user: "mesero", color: "text-blue-400" },
                { role: "Operador", user: "operador", color: "text-green-400" },
                // { role: "Admin", user: "admin", color: "text-purple-400" },
              ].map((u) => (
                <button
                  key={u.user}
                  disabled={isLocked}
                  onClick={() => { setUsername(u.user); setPassword("1234"); setError(""); }}
                  className="bg-stone-700/50 hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg p-2 text-center transition-colors cursor-pointer"
                >
                  <p className={`text-xs ${u.color}`}>{u.role}</p>
                  <p className="text-stone-400 text-xs">{u.user}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
