import { useState } from "react";
import { QrCode, Smartphone, Plus, Minus, ChefHat, Check, ChevronLeft, LogIn, Clock, CheckCircle } from "lucide-react";
import { MenuItem, OrderItem, Order, MENU_ITEMS, TABLES, STATUS_LABELS, STATUS_COLORS } from "../types";

interface Props {
  onSubmitOrder: (order: Omit<Order, "id" | "createdAt">) => void;
  onBack: () => void;
  isPublicAccess?: boolean;
  existingOrders?: Order[];
}

const CATEGORIES = [...new Set(MENU_ITEMS.map((m) => m.category))];

export function QROrderScreen({ onSubmitOrder, onBack, isPublicAccess = false, existingOrders = [] }: Props) {
  const [phase, setPhase] = useState<"qr_display" | "table_selection" | "scanning" | "order_status" | "menu" | "success">(
    isPublicAccess ? "table_selection" : "qr_display"
  );
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [clientName, setClientName] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing) return prev.map((c) => c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { menuItem: item, quantity: 1, notes: "" }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === itemId);
      if (existing && existing.quantity > 1) return prev.map((c) => c.menuItem.id === itemId ? { ...c, quantity: c.quantity - 1 } : c);
      return prev.filter((c) => c.menuItem.id !== itemId);
    });
  };

  const getQty = (itemId: string) => cart.find((c) => c.menuItem.id === itemId)?.quantity || 0;
  const total = cart.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0);
  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);

  const handleSubmit = () => {
    if (cart.length === 0 || !selectedTable) return;
    onSubmitOrder({
      tableNumber: selectedTable,
      items: cart,
      status: "pendiente",
      origin: "qr",
      total,
      clientName: clientName || "Cliente QR",
    });
    setPhase("success");
  };

  const tableOrders = existingOrders.filter(
    (o) => o.tableNumber === selectedTable && o.status !== "entregado"
  );

  const handleTableSelect = (tableNum: number) => {
    setSelectedTable(tableNum);
    setPhase("scanning");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" });
  };

  // Phase 0: Table Selection (Public Access)
  if (phase === "table_selection") {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col">
        <div className="bg-stone-800 border-b border-stone-700 px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="text-stone-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-white">Escaneo de QR</h1>
            <p className="text-cyan-400/70 text-xs">Seleccione su mesa</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-stone-800 rounded-2xl border border-stone-700 p-8 max-w-2xl w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <QrCode size={32} className="text-cyan-400" />
              </div>
              <h2 className="text-white mb-2">Simulación de Escaneo QR</h2>
              <p className="text-stone-400 text-sm">Seleccione el número de mesa para simular el escaneo del código QR</p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {TABLES.map((t) => {
                const hasActiveOrders = existingOrders.some(
                  (o) => o.tableNumber === t && o.status !== "entregado"
                );
                return (
                  <button
                    key={t}
                    onClick={() => handleTableSelect(t)}
                    className={`relative bg-stone-700 hover:bg-cyan-500/20 hover:border-cyan-500 border border-stone-600 rounded-xl p-4 flex flex-col items-center transition-all ${
                      hasActiveOrders ? "ring-2 ring-amber-500/50" : ""
                    }`}
                  >
                    {hasActiveOrders && (
                      <span className="absolute -top-2 -right-2 bg-amber-500 text-stone-900 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        !
                      </span>
                    )}
                    <QrCode size={20} className="text-stone-400 mb-1" />
                    <span className="text-white">Mesa {t}</span>
                    {hasActiveOrders && (
                      <span className="text-amber-400 text-xs mt-1">Con pedidos</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Phase 1: QR Display (Mesero shows QR to customer)
  if (phase === "qr_display") {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col">
        <div className="bg-stone-800 border-b border-stone-700 px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="text-stone-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-white">Pedido por QR</h1>
            <p className="text-amber-400/70 text-xs">RF-02 · Seleccione la mesa</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-stone-800 rounded-2xl border border-stone-700 p-8 max-w-md w-full text-center">
            <h2 className="text-white mb-2">Generar QR de Mesa</h2>
            <p className="text-stone-400 text-sm mb-6">Seleccione la mesa y muestre el código QR al cliente para que realice su pedido desde el celular.</p>

            {/* Table selector */}
            <div className="mb-6">
              <label className="block text-stone-300 text-sm mb-2">Mesa</label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(Number(e.target.value))}
                className="w-full bg-stone-700 border border-stone-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber-500"
              >
                {TABLES.map((t) => (
                  <option key={t} value={t}>Mesa {t}</option>
                ))}
              </select>
            </div>

            {/* Simulated QR Code */}
            <div className="bg-white rounded-xl p-4 inline-block mb-6">
              <div className="w-40 h-40 relative">
                {/* QR visual simulation */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Corner squares */}
                  <rect x="5" y="5" width="25" height="25" fill="none" stroke="#000" strokeWidth="3"/>
                  <rect x="10" y="10" width="15" height="15" fill="#000"/>
                  <rect x="70" y="5" width="25" height="25" fill="none" stroke="#000" strokeWidth="3"/>
                  <rect x="75" y="10" width="15" height="15" fill="#000"/>
                  <rect x="5" y="70" width="25" height="25" fill="none" stroke="#000" strokeWidth="3"/>
                  <rect x="10" y="75" width="15" height="15" fill="#000"/>
                  {/* Data modules */}
                  {[35,40,45,50,55,60].map(x =>
                    [5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90].filter((_,i) => (x+i*3)%7<3).map(y => (
                      <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" fill="#000" />
                    ))
                  )}
                  {/* Center text */}
                  <text x="50" y="95" textAnchor="middle" fontSize="5" fill="#666">Mesa {selectedTable}</text>
                </svg>
              </div>
            </div>

            <p className="text-stone-500 text-xs mb-6">bocatto-valley.com/order/mesa/{selectedTable}</p>

            <button
              onClick={() => setPhase("scanning")}
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-lg py-3 transition-colors flex items-center justify-center gap-2"
            >
              <Smartphone size={18} />
              Simular Escaneo del Cliente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Phase 2: Scanning animation
  if (phase === "scanning") {
    setTimeout(() => {
      if (tableOrders.length > 0) {
        setPhase("order_status");
      } else {
        setPhase("menu");
      }
    }, 2000);

    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/30 animate-ping" />
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/60 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <QrCode size={48} className="text-cyan-400" />
            </div>
          </div>
          <p className="text-white mb-2">Escaneando QR...</p>
          <p className="text-stone-400 text-sm">Mesa {selectedTable}</p>
        </div>
      </div>
    );
  }

  // Phase 3: Order Status (if table has existing orders)
  if (phase === "order_status") {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col">
        <div className="bg-stone-800 border-b border-stone-700 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setPhase("table_selection")} className="text-stone-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-white">Mesa {selectedTable}</h1>
            <p className="text-cyan-400/70 text-xs">Estado de Pedidos</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto">
            {/* Active orders */}
            <div className="mb-6">
              <h2 className="text-white mb-4 flex items-center gap-2">
                <Clock size={20} className="text-cyan-400" />
                Sus Pedidos Activos
              </h2>
              <div className="space-y-3">
                {tableOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-stone-800 border border-stone-700 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white">Pedido #{order.id.slice(-6)}</p>
                        <p className="text-stone-400 text-xs">{formatTime(order.createdAt)}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>

                    <div className="space-y-1 mb-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-stone-300">{item.quantity}× {item.menuItem.name}</span>
                          <span className="text-stone-400">${(item.quantity * item.menuItem.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between pt-2 border-t border-stone-700">
                      <span className="text-stone-300">Total</span>
                      <span className="text-amber-400">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setPhase("menu")}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-stone-900 rounded-lg py-3 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Agregar Más Ítems
              </button>
              <button
                onClick={onBack}
                className="w-full bg-stone-700 hover:bg-stone-600 text-white rounded-lg py-3 transition-colors flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                Ir al Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Phase 3: Success
  if (phase === "success") {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-400" />
          </div>
          <h2 className="text-white mb-3">¡Pedido Enviado!</h2>
          <p className="text-stone-400 mb-2">Mesa <span className="text-amber-400">{selectedTable}</span> · {totalItems} ítem(s)</p>
          <p className="text-stone-400 mb-2">Total: <span className="text-amber-400">${total.toFixed(2)}</span></p>
          <p className="text-stone-500 text-sm mb-8">Su pedido ha sido recibido y está siendo preparado.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setCart([]);
                setClientName("");
                setPhase(isPublicAccess ? "table_selection" : "qr_display");
                setShowCheckout(false);
                setSelectedTable(null);
              }}
              className="bg-amber-500 hover:bg-amber-400 text-stone-900 px-5 py-2 rounded-lg transition-colors"
            >
              Nuevo Pedido QR
            </button>
            <button onClick={onBack} className="bg-stone-700 hover:bg-stone-600 text-white px-5 py-2 rounded-lg transition-colors flex items-center gap-2">
              {isPublicAccess && <LogIn size={16} />}
              {isPublicAccess ? "Ir al Login" : "Volver"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Phase 4: Digital Menu (Customer's view - simulated mobile)
  return (
    <div className="min-h-screen bg-amber-950 flex items-center justify-center p-4">
      {/* Mobile frame simulation */}
      <div className="w-full max-w-sm bg-stone-900 rounded-3xl shadow-2xl overflow-hidden border-4 border-stone-700" style={{ maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        {/* Mobile header */}
        <div className="bg-amber-900 px-4 py-3 text-center flex-shrink-0">
          <div className="flex items-center justify-center gap-2 mb-1">
            <ChefHat size={16} className="text-amber-300" />
            <span className="text-amber-200 text-sm">Bocatto Valley</span>
          </div>
          <p className="text-amber-400/70 text-xs">Mesa {selectedTable} · Menú Digital (QR)</p>
          {isPublicAccess && (
            <div className="mt-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg px-2 py-1 flex items-center justify-center gap-1.5">
              <Smartphone size={12} className="text-cyan-300" />
              <span className="text-cyan-300 text-xs">Acceso Cliente (sin login)</span>
            </div>
          )}
        </div>

        {/* Name input */}
        {!clientName ? (
          <div className="p-4 flex-shrink-0 border-b border-stone-700">
            <p className="text-stone-300 text-sm mb-2">¿Cuál es su nombre? (opcional)</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Su nombre"
                className="flex-1 bg-stone-700 border border-stone-600 text-white placeholder-stone-500 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-amber-500"
                onKeyDown={(e) => { if (e.key === "Enter") setClientName((e.target as HTMLInputElement).value || "Cliente"); }}
              />
              <button
                onClick={(e) => {
                  const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                  setClientName(input.value || "Cliente");
                }}
                className="bg-amber-500 text-stone-900 px-3 py-1.5 rounded-lg text-sm"
              >
                OK
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 py-2 flex-shrink-0 bg-amber-500/10 border-b border-amber-500/20">
            <p className="text-amber-300 text-xs">Hola, {clientName}! Seleccione sus ítems.</p>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex overflow-x-auto gap-2 px-3 py-2 border-b border-stone-700 flex-shrink-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs transition-colors ${
                selectedCategory === cat ? "bg-amber-500 text-stone-900" : "bg-stone-700 text-stone-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu items - scrollable */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {MENU_ITEMS.filter((m) => m.category === selectedCategory).map((item) => {
            const qty = getQty(item.id);
            return (
              <div key={item.id} className={`bg-stone-800 rounded-xl p-3 flex items-center justify-between border ${qty > 0 ? "border-amber-500/50" : "border-stone-700"}`}>
                <div className="flex-1 mr-3">
                  <p className="text-white text-sm">{item.name}</p>
                  <p className="text-amber-400 text-xs">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {qty > 0 && (
                    <>
                      <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-full bg-stone-700 flex items-center justify-center text-white">
                        <Minus size={12} />
                      </button>
                      <span className="text-white text-sm w-4 text-center">{qty}</span>
                    </>
                  )}
                  <button onClick={() => addToCart(item)} className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-stone-900">
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom bar */}
        {totalItems > 0 && !showCheckout && (
          <div className="p-3 border-t border-stone-700 flex-shrink-0">
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-xl py-2.5 flex items-center justify-between px-4 transition-colors"
            >
              <span className="text-sm">{totalItems} ítem(s)</span>
              <span className="text-sm">Ver Pedido → ${total.toFixed(2)}</span>
            </button>
          </div>
        )}

        {/* Checkout panel */}
        {showCheckout && (
          <div className="border-t border-stone-700 flex-shrink-0">
            <div className="p-3 max-h-40 overflow-y-auto space-y-1">
              {cart.map((c) => (
                <div key={c.menuItem.id} className="flex justify-between text-sm">
                  <span className="text-stone-300">{c.quantity}× {c.menuItem.name}</span>
                  <span className="text-amber-400">${(c.quantity * c.menuItem.price).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-stone-700 pt-1 mt-1">
                <span className="text-white">Total</span>
                <span className="text-amber-400">${total.toFixed(2)}</span>
              </div>
            </div>
            {cart.length === 0 && (
              <p className="text-red-400 text-xs text-center px-3 pb-2 flex items-center justify-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-red-500/20 border border-red-500/40 inline-flex items-center justify-center text-red-400 leading-none text-xs">!</span>
                Seleccione al menos un platillo para cobrar
              </p>
            )}
            <div className="p-3 pt-0 flex gap-2">
              <button onClick={() => setShowCheckout(false)} className="flex-1 bg-stone-700 text-stone-300 rounded-xl py-2 text-sm">
                Editar
              </button>
              <button
                onClick={handleSubmit}
                disabled={cart.length === 0}
                className="flex-1 bg-amber-500 disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed text-stone-900 rounded-xl py-2 text-sm transition-colors"
              >
                Confirmar Pedido
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
