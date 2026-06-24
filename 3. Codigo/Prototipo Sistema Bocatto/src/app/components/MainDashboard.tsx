import { ChefHat, LogOut, ClipboardList, QrCode, TableIcon, Settings, BarChart3, User, Smartphone } from "lucide-react";
import { SessionUser, Order, OrderStatus, STATUS_LABELS, STATUS_COLORS } from "../types";

type Screen = "dashboard" | "rf01_mesa" | "rf01b_operador" | "rf02_qr" | "rf03_gestion";

interface Props {
  user: SessionUser;
  orders: Order[];
  onNavigate: (screen: Screen | "rf02_qr_public") => void;
  onLogout: () => void;
}

const ROLE_COLORS = {
  mesero: "text-blue-400",
  operador: "text-green-400",
  // administrador: "text-purple-400",
};

const ROLE_BADGE = {
  mesero: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  operador: "bg-green-500/20 text-green-300 border-green-500/30",
  // administrador: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const ROLE_LABEL = {
  mesero: "Mesero",
  operador: "Operador",
  // administrador: "Administrador",
};

export function MainDashboard({ user, orders, onNavigate, onLogout }: Props) {
  const pendingOrders = orders.filter((o) => o.status === "pendiente").length;
  const activeOrders = orders.filter((o) => o.status === "en_preparacion").length;
  const readyOrders = orders.filter((o) => o.status === "listo").length;
  const todayTotal = orders.reduce((sum, o) => sum + o.total, 0);

  // Role-based available functions
  const canTakeOrdersMesa = user.role === "mesero"; // || user.role === "administrador";
  const canTakeOrdersOperador = user.role === "operador"; // || user.role === "administrador";
  const canQROrders = false; // user.role === "administrador";
  const canManageOrders = true; // Todos los roles pueden gestionar pedidos

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col">
      {/* Header */}
      <div className="bg-stone-800 border-b border-stone-700 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
              <ChefHat size={20} className="text-stone-900" />
            </div>
            <div>
              <h1 className="text-amber-400" style={{ fontFamily: "Georgia, serif" }}>Bocatto Valley</h1>
              <p className="text-stone-500 text-xs">Sistema de Gestión · Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-white text-sm">{user.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${ROLE_BADGE[user.role]}`}>
                {ROLE_LABEL[user.role]}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="text-stone-400 hover:text-red-400 transition-colors flex items-center gap-1.5 text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-white mb-1">Bienvenido, {user.name.split(" ")[0]}</h2>
          <p className="text-stone-400 text-sm">
            Rol: <span className={ROLE_COLORS[user.role]}>{ROLE_LABEL[user.role]}</span> ·
            {new Date().toLocaleDateString("es-EC", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pendientes", value: pendingOrders, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
            { label: "En Cocina", value: activeOrders, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
            { label: "Listos", value: readyOrders, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
            { label: "Total del Día", value: `$${todayTotal.toFixed(2)}`, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl border p-4 ${stat.bg}`}>
              <p className="text-stone-400 text-xs mb-1">{stat.label}</p>
              <p className={`text-2xl ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* RF Functions */}
        <div className="mb-6">
          <h3 className="text-stone-300 text-sm uppercase tracking-wider mb-4">Funciones del Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* RF-01 - Pedido por Mesa (Mesero) */}
            <button
              onClick={() => canTakeOrdersMesa && onNavigate("rf01_mesa")}
              disabled={!canTakeOrdersMesa}
              className={`bg-stone-800 border rounded-xl p-6 text-left transition-all ${
                canTakeOrdersMesa
                  ? "border-stone-700 hover:border-amber-500/50 hover:bg-stone-700/50 cursor-pointer"
                  : "border-stone-700/50 opacity-40 cursor-not-allowed"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
                <TableIcon size={24} className="text-amber-400" />
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white text-sm">Pedido por Mesa</h3>
                <span className="text-xs text-stone-500 bg-stone-700 px-2 py-0.5 rounded">RF-01</span>
              </div>
              <p className="text-stone-400 text-xs">Mesero registra pedidos en mesa. Seleccione la mesa y envíe a cocina.</p>
              {!canTakeOrdersMesa && <p className="text-red-400/70 text-xs mt-2">Solo Mesero</p>}
            </button>

            {/* RF-01b - Pedido Operador (a nombre de cliente) */}
            <button
              onClick={() => canTakeOrdersOperador && onNavigate("rf01b_operador")}
              disabled={!canTakeOrdersOperador}
              className={`bg-stone-800 border rounded-xl p-6 text-left transition-all ${
                canTakeOrdersOperador
                  ? "border-stone-700 hover:border-green-500/50 hover:bg-stone-700/50 cursor-pointer"
                  : "border-stone-700/50 opacity-40 cursor-not-allowed"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
                <User size={24} className="text-green-400" />
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white text-sm">Pedido Operador</h3>
              </div>
              <p className="text-stone-400 text-xs">Operador registra pedidos a nombre de un cliente.</p>
              {!canTakeOrdersOperador && <p className="text-red-400/70 text-xs mt-2">Solo Operador</p>}
            </button>

            {/* RF-02 - Pedido por QR (acceso al generador) - OCULTO PARA ADMIN */}
            {/* <button
              onClick={() => canQROrders && onNavigate("rf02_qr")}
              disabled={!canQROrders}
              className={`bg-stone-800 border rounded-xl p-6 text-left transition-all ${
                canQROrders
                  ? "border-stone-700 hover:border-blue-500/50 hover:bg-stone-700/50 cursor-pointer"
                  : "border-stone-700/50 opacity-40 cursor-not-allowed"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                <QrCode size={24} className="text-blue-400" />
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white text-sm">Generar QR</h3>
              </div>
              <p className="text-stone-400 text-xs">Genere código QR para que cliente realice su pedido desde celular.</p>
              {!canQROrders && <p className="text-red-400/70 text-xs mt-2">Solo Admin</p>}
            </button> */}

            {/* RF-03 - Gestión de Pedidos */}
            <button
              onClick={() => canManageOrders && onNavigate("rf03_gestion")}
              disabled={!canManageOrders}
              className={`bg-stone-800 border rounded-xl p-6 text-left transition-all ${
                canManageOrders
                  ? "border-stone-700 hover:border-purple-500/50 hover:bg-stone-700/50 cursor-pointer"
                  : "border-stone-700/50 opacity-40 cursor-not-allowed"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 relative">
                <ClipboardList size={24} className="text-purple-400" />
                {pendingOrders > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-stone-900 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {pendingOrders}
                  </span>
                )}
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white text-sm">Gestión Pedidos</h3>
              </div>
              <p className="text-stone-400 text-xs">Visualice y actualice el estado de pedidos activos.</p>
              {!canManageOrders && <p className="text-red-400/70 text-xs mt-2">Sin permisos</p>}
            </button>
          </div>
        </div>

        {/* Cliente - Acceso Público - OCULTO */}
        {/* <div className="mb-6">
          <h3 className="text-stone-300 text-sm uppercase tracking-wider mb-4">Acceso Cliente (sin login)</h3>
          <div className="bg-stone-800 border border-stone-700 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <Smartphone size={24} className="text-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white">Pedido Cliente por QR</h3>
                </div>
                <p className="text-stone-400 text-sm mb-4">
                  Los clientes escanean el código QR en su mesa y realizan pedidos directamente desde su celular sin necesidad de autenticación.
                </p>
                <button
                  onClick={() => onNavigate("rf02_qr_public")}
                  className="bg-cyan-500 hover:bg-cyan-400 text-stone-900 rounded-lg px-4 py-2 text-sm transition-colors flex items-center gap-2"
                >
                  <Smartphone size={16} />
                  Simular Escaneo QR (Cliente)
                </button>
              </div>
            </div>
          </div>
        </div> */}

        {/* Recent orders */}
        {orders.length > 0 && (
          <div>
            <h3 className="text-stone-300 text-sm uppercase tracking-wider mb-4">Pedidos Recientes</h3>
            <div className="bg-stone-800 border border-stone-700 rounded-xl overflow-hidden">
              <div className="divide-y divide-stone-700">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-stone-700 flex items-center justify-center">
                        <span className="text-stone-300 text-xs">{order.tableNumber}</span>
                      </div>
                      <div>
                        <p className="text-white text-sm">Mesa {order.tableNumber} · {order.items.length} ítem(s)</p>
                        <p className="text-stone-500 text-xs">{order.origin === "qr" ? "Pedido QR" : "Pedido Mesa"} · {order.createdAt.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-amber-400 text-sm">${order.total.toFixed(2)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {orders.length > 5 && (
                <button
                  onClick={() => onNavigate("rf03_gestion")}
                  className="w-full py-3 text-center text-stone-400 hover:text-amber-400 text-sm transition-colors border-t border-stone-700"
                >
                  Ver todos los pedidos ({orders.length}) →
                </button>
              )}
            </div>
          </div>
        )}

        {/* RF info bar */}
        <div className="mt-8 bg-stone-800/50 border border-stone-700/50 rounded-xl p-4">
          <p className="text-stone-500 text-xs text-center">
            Sistema Bocatto · Pedido Mesa (Mesero) · Pedido Operador · Pedido QR (Cliente) · Gestión de Pedidos
          </p>
        </div>
      </div>
    </div>
  );
}
