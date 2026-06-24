import { useState } from "react";
import { Plus, Minus, Trash2, Send, ChevronLeft, User, ShoppingCart } from "lucide-react";
import { MenuItem, OrderItem, Order, MENU_ITEMS, SessionUser } from "../types";

interface Props {
  user: SessionUser;
  onSubmitOrder: (order: Omit<Order, "id" | "createdAt">) => void;
  onBack: () => void;
}

const CATEGORIES = [...new Set(MENU_ITEMS.map((m) => m.category))];

export function OperatorDashboard({ user, onSubmitOrder, onBack }: Props) {
  const [clientName, setClientName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [nameConfirmed, setNameConfirmed] = useState(false);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { menuItem: item, quantity: 1, notes: "" }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((c) =>
          c.menuItem.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
        );
      }
      return prev.filter((c) => c.menuItem.id !== itemId);
    });
  };

  const deleteFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItem.id !== itemId));
  };

  const getQty = (itemId: string) => cart.find((c) => c.menuItem.id === itemId)?.quantity || 0;

  const total = cart.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0);
  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);

  const handleSubmit = () => {
    if (!nameConfirmed || cart.length === 0) return;
    onSubmitOrder({
      tableNumber: 0,
      items: cart.map((c) => ({ ...c, notes: notes[c.menuItem.id] || "" })),
      status: "pendiente",
      origin: "operador",
      total,
      clientName,
    });
    setSubmitted(true);
  };

  const handleNew = () => {
    setCart([]);
    setClientName("");
    setNotes({});
    setSubmitted(false);
    setShowCart(false);
    setNameConfirmed(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
            <Send size={32} className="text-green-400" />
          </div>
          <h2 className="text-white mb-3">¡Pedido Registrado!</h2>
          <p className="text-stone-400 mb-2">Cliente: <span className="text-amber-400">{clientName}</span></p>
          <p className="text-stone-400 mb-2">{totalItems} ítem(s) · Total: <span className="text-amber-400">${total.toFixed(2)}</span></p>
          <p className="text-stone-500 text-sm mb-8">El pedido ha sido enviado a cocina y está en estado <span className="text-yellow-400">Pendiente</span>.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleNew} className="bg-amber-500 hover:bg-amber-400 text-stone-900 px-6 py-2 rounded-lg transition-colors">
              Nuevo Pedido
            </button>
            <button onClick={onBack} className="bg-stone-700 hover:bg-stone-600 text-white px-6 py-2 rounded-lg transition-colors">
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col">
      {/* Header */}
      <div className="bg-stone-800 border-b border-stone-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-stone-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-white">Registrar Pedido · Operador</h1>
            <p className="text-amber-400/70 text-xs">RF-01b · {user.name}</p>
          </div>
        </div>
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-lg px-3 py-2 flex items-center gap-2 transition-colors"
        >
          <ShoppingCart size={18} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
          <span className="text-sm">${total.toFixed(2)}</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {/* Client name input */}
          {!nameConfirmed ? (
            <div className="p-6">
              <h2 className="text-white mb-2">Datos del Cliente</h2>
              <p className="text-stone-400 text-sm mb-6">Ingrese el nombre del cliente para el pedido</p>
              <div className="bg-stone-800 border border-stone-700 rounded-xl p-6 max-w-md">
                <div className="mb-4">
                  <label className="block text-stone-300 text-sm mb-2">Nombre del Cliente</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      className="w-full bg-stone-700/60 border border-stone-600 text-white placeholder-stone-500 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                      autoFocus
                    />
                  </div>
                </div>
                <button
                  onClick={() => clientName.trim() && setNameConfirmed(true)}
                  disabled={!clientName.trim()}
                  className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-stone-600 disabled:text-stone-400 text-stone-900 rounded-lg py-2.5 transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Client badge */}
              <div className="px-4 py-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2">
                <User size={16} className="text-amber-400" />
                <span className="text-amber-300">Cliente: {clientName}</span>
                <button
                  onClick={() => { setNameConfirmed(false); setCart([]); }}
                  className="ml-auto text-stone-500 hover:text-stone-300 text-sm transition-colors"
                >
                  Cambiar cliente
                </button>
              </div>

              {/* Category tabs */}
              <div className="flex overflow-x-auto gap-2 px-4 py-3 border-b border-stone-700">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm transition-colors ${
                      selectedCategory === cat
                        ? "bg-amber-500 text-stone-900"
                        : "bg-stone-700 text-stone-300 hover:bg-stone-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Menu items */}
              <div className="p-4 grid grid-cols-1 gap-3">
                {MENU_ITEMS.filter((m) => m.category === selectedCategory).map((item) => {
                  const qty = getQty(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`bg-stone-800 border rounded-xl p-4 flex items-center justify-between transition-colors ${
                        qty > 0 ? "border-amber-500/50" : "border-stone-700"
                      }`}
                    >
                      <div className="flex-1 mr-4">
                        <p className="text-white">{item.name}</p>
                        <p className="text-stone-500 text-xs mt-0.5">{item.description}</p>
                        <p className="text-amber-400 text-sm mt-1">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {qty > 0 ? (
                          <>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-8 h-8 rounded-full bg-stone-700 hover:bg-stone-600 flex items-center justify-center text-white transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-white w-6 text-center">{qty}</span>
                          </>
                        ) : null}
                        <button
                          onClick={() => addToCart(item)}
                          className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-stone-900 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Cart sidebar */}
        {showCart && nameConfirmed && (
          <div className="w-80 bg-stone-800 border-l border-stone-700 flex flex-col">
            <div className="p-4 border-b border-stone-700">
              <h3 className="text-white">Pedido · {clientName}</h3>
              <p className="text-stone-400 text-xs">{totalItems} ítem(s)</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <p className="text-stone-500 text-center py-8 text-sm">Sin ítems agregados</p>
              ) : (
                cart.map((c) => (
                  <div key={c.menuItem.id} className="bg-stone-700/50 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-white text-sm">{c.menuItem.name}</p>
                        <p className="text-stone-400 text-xs">
                          {c.quantity} × ${c.menuItem.price.toFixed(2)} = ${(c.quantity * c.menuItem.price).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteFromCart(c.menuItem.id)}
                        className="text-stone-500 hover:text-red-400 transition-colors ml-2"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Notas (opcional)"
                      value={notes[c.menuItem.id] || ""}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [c.menuItem.id]: e.target.value }))}
                      className="w-full bg-stone-600/50 border border-stone-600 text-white placeholder-stone-500 rounded text-xs px-2 py-1 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-stone-700">
              <div className="flex justify-between mb-4">
                <span className="text-stone-300">Total:</span>
                <span className="text-amber-400">${total.toFixed(2)}</span>
              </div>
              {cart.length === 0 && (
                <p className="text-red-400 text-xs text-center mb-3 flex items-center justify-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 leading-none">!</span>
                  Seleccione al menos un platillo para cobrar
                </p>
              )}
              <button
                onClick={handleSubmit}
                disabled={cart.length === 0 || !nameConfirmed}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed text-stone-900 rounded-lg py-2.5 transition-colors flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Enviar a Cocina
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
