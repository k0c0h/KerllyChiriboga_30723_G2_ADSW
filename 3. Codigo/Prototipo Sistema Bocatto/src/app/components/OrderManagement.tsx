import { useState } from "react";
import { Clock, ChevronLeft, Filter, RefreshCw, CheckCircle, ChefHat, Bell, Smartphone, TableIcon } from "lucide-react";
import {
  Order, OrderStatus, SessionUser,
  STATUS_LABELS, STATUS_COLORS, ORIGIN_LABELS
} from "../types";

interface Props {
  orders: Order[];
  user: SessionUser;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onBack: () => void;
}

const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
  pendiente: "en_preparacion",
  en_preparacion: "listo",
  listo: "entregado",
  entregado: null,
};

const STATUS_NEXT_LABEL: Record<OrderStatus, string> = {
  pendiente: "Iniciar Preparación",
  en_preparacion: "Marcar como Listo",
  listo: "Marcar Entregado",
  entregado: "",
};

const ORIGIN_ICON = {
  mesa: TableIcon,
  qr: Smartphone,
  operador: Bell,
};

export function OrderManagement({ orders, user, onUpdateStatus, onBack }: Props) {
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter((o) => filterStatus === "all" || o.status === filterStatus);
  const sortedOrders = [...filtered].sort((a, b) => {
    const statusOrder: OrderStatus[] = ["pendiente", "en_preparacion", "listo", "entregado"];
    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status) || b.createdAt.getTime() - a.createdAt.getTime();
  });

  const counts: Record<string, number> = {
    all: orders.length,
    pendiente: orders.filter((o) => o.status === "pendiente").length,
    en_preparacion: orders.filter((o) => o.status === "en_preparacion").length,
    listo: orders.filter((o) => o.status === "listo").length,
    entregado: orders.filter((o) => o.status === "entregado").length,
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" });
  };

  const handleUpdateStatus = (order: Order) => {
    const next = STATUS_FLOW[order.status];
    if (next) {
      onUpdateStatus(order.id, next);
      if (selectedOrder?.id === order.id) {
        setSelectedOrder({ ...order, status: next });
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col">
      {/* Header */}
      <div className="bg-stone-800 border-b border-stone-700 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-stone-400 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-white">Gestión de Pedidos</h1>
          <p className="text-amber-400/70 text-xs">RF-03 · {user.name} · {user.role}</p>
        </div>
        <div className="flex items-center gap-2">
          {counts.pendiente > 0 && (
            <span className="bg-yellow-500 text-stone-900 text-xs px-2 py-0.5 rounded-full">
              {counts.pendiente} pendiente{counts.pendiente > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Orders list */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Filter tabs */}
          <div className="flex overflow-x-auto gap-2 px-4 py-3 border-b border-stone-700 bg-stone-800/50 flex-shrink-0">
            {([
              { key: "all", label: "Todos" },
              { key: "pendiente", label: "Pendiente" },
              { key: "en_preparacion", label: "En Preparación" },
              { key: "listo", label: "Listos" },
              { key: "entregado", label: "Entregados" },
            ] as const).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-colors ${
                  filterStatus === f.key
                    ? "bg-amber-500 text-stone-900"
                    : "bg-stone-700 text-stone-300 hover:bg-stone-600"
                }`}
              >
                <Filter size={12} />
                {f.label}
                <span className={`text-xs rounded-full px-1.5 ${filterStatus === f.key ? "bg-stone-900/30" : "bg-stone-600"}`}>
                  {counts[f.key]}
                </span>
              </button>
            ))}
          </div>

          {/* Orders grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {sortedOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <ChefHat size={48} className="text-stone-600 mb-4" />
                <p className="text-stone-400">No hay pedidos {filterStatus !== "all" ? `en estado "${STATUS_LABELS[filterStatus as OrderStatus]}"` : "registrados"}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedOrders.map((order) => {
                  const OriginIcon = ORIGIN_ICON[order.origin];
                  const nextStatus = STATUS_FLOW[order.status];
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`bg-stone-800 border rounded-xl p-4 cursor-pointer transition-all hover:border-amber-500/50 ${
                        selectedOrder?.id === order.id ? "border-amber-500" : "border-stone-700"
                      }`}
                    >
                      {/* Order header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <TableIcon size={14} className="text-amber-400" />
                          </div>
                          <div>
                            <p className="text-white">{order.tableNumber > 0 ? `Mesa ${order.tableNumber}` : order.clientName || "Pedido"}</p>
                            <p className="text-stone-500 text-xs">#{order.id.slice(-6)}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>

                      {/* Items preview */}
                      <div className="space-y-1 mb-3">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-stone-400">{item.quantity}× {item.menuItem.name}</span>
                            <span className="text-stone-500">${(item.quantity * item.menuItem.price).toFixed(2)}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-stone-500 text-xs">+{order.items.length - 3} más...</p>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-stone-700">
                        <div className="flex items-center gap-1.5 text-stone-500 text-xs">
                          <OriginIcon size={12} />
                          <span>{ORIGIN_LABELS[order.origin]}</span>
                          <span>·</span>
                          <Clock size={12} />
                          <span>{formatTime(order.createdAt)}</span>
                        </div>
                        <span className="text-amber-400 text-sm">${order.total.toFixed(2)}</span>
                      </div>

                      {/* Action button */}
                      {nextStatus && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order); }}
                          className="mt-3 w-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 rounded-lg py-1.5 text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <RefreshCw size={12} />
                          {STATUS_NEXT_LABEL[order.status]}
                        </button>
                      )}
                      {order.status === "entregado" && (
                        <div className="mt-3 flex items-center justify-center gap-1.5 text-stone-500 text-xs">
                          <CheckCircle size={12} />
                          <span>Pedido completado</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selectedOrder && (
          <div className="w-80 bg-stone-800 border-l border-stone-700 flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-stone-700 flex items-center justify-between">
              <div>
                <h3 className="text-white">Detalle del Pedido</h3>
                <p className="text-stone-400 text-xs">{selectedOrder.tableNumber > 0 ? `Mesa ${selectedOrder.tableNumber}` : selectedOrder.clientName || "Pedido"} · #{selectedOrder.id.slice(-6)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-500 hover:text-white text-xs transition-colors">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Status indicator */}
              <div className={`rounded-lg p-3 border mb-4 text-center ${STATUS_COLORS[selectedOrder.status]}`}>
                <p className="text-sm">Estado: {STATUS_LABELS[selectedOrder.status]}</p>
              </div>

              {/* Origin & Time */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-stone-700/50 rounded-lg p-3 text-center">
                  <p className="text-stone-400 text-xs mb-1">Origen</p>
                  <p className="text-white text-sm">{ORIGIN_LABELS[selectedOrder.origin]}</p>
                </div>
                <div className="bg-stone-700/50 rounded-lg p-3 text-center">
                  <p className="text-stone-400 text-xs mb-1">Hora</p>
                  <p className="text-white text-sm">{formatTime(selectedOrder.createdAt)}</p>
                </div>
              </div>

              {/* Client name */}
              {selectedOrder.clientName && (
                <div className="bg-stone-700/50 rounded-lg p-3 mb-4">
                  <p className="text-stone-400 text-xs mb-1">Cliente</p>
                  <p className="text-white text-sm">{selectedOrder.clientName}</p>
                </div>
              )}

              {/* Items */}
              <div className="space-y-2 mb-4">
                <p className="text-stone-400 text-xs uppercase tracking-wider mb-2">Ítems del pedido</p>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="bg-stone-700/50 rounded-lg p-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-white text-sm">{item.menuItem.name}</span>
                      <span className="text-amber-400 text-sm">${(item.quantity * item.menuItem.price).toFixed(2)}</span>
                    </div>
                    <p className="text-stone-400 text-xs">
                      {item.quantity} × ${item.menuItem.price.toFixed(2)}
                      {item.menuItem.category && ` · ${item.menuItem.category}`}
                    </p>
                    {item.notes && <p className="text-amber-300/70 text-xs mt-1 italic">"{item.notes}"</p>}
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                <span className="text-stone-300">Total del pedido</span>
                <span className="text-amber-400">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action */}
            <div className="p-4 border-t border-stone-700">
              {STATUS_FLOW[selectedOrder.status] ? (
                <button
                  onClick={() => handleUpdateStatus(selectedOrder)}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-lg py-2.5 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} />
                  {STATUS_NEXT_LABEL[selectedOrder.status]}
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                  <CheckCircle size={16} />
                  <span>Pedido completado</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
