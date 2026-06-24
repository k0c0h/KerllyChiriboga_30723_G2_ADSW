import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { MainDashboard } from "./components/MainDashboard";
import { WaiterDashboard } from "./components/WaiterDashboard";
import { OperatorDashboard } from "./components/OperatorDashboard";
import { QROrderScreen } from "./components/QROrderScreen";
import { OrderManagement } from "./components/OrderManagement";
import { SessionUser, Order, OrderStatus } from "./types";

type Screen = "login" | "dashboard" | "rf01_mesa" | "rf01b_operador" | "rf02_qr" | "rf02_qr_public" | "rf03_gestion";

let orderCounter = 1;

function generateOrderId() {
  return `BV-${String(orderCounter++).padStart(4, "0")}-${Date.now().toString(36).toUpperCase()}`;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const handleLogin = (u: SessionUser) => {
    setUser(u);
    setScreen("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setScreen("login");
  };

  const handleSubmitOrder = (orderData: Omit<Order, "id" | "createdAt">) => {
    const newOrder: Order = {
      ...orderData,
      id: generateOrderId(),
      createdAt: new Date(),
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const navigate = (s: Screen) => setScreen(s);

  if (screen === "login") {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onClientAccess={() => setScreen("rf02_qr_public")}
      />
    );
  }

  if (screen === "rf02_qr_public") {
    return (
      <QROrderScreen
        onSubmitOrder={handleSubmitOrder}
        onBack={() => setScreen("login")}
        isPublicAccess={true}
        existingOrders={orders}
      />
    );
  }

  if (!user) return null;

  if (screen === "dashboard") {
    return (
      <MainDashboard
        user={user}
        orders={orders}
        onNavigate={(s) => navigate(s as Screen)}
        onLogout={handleLogout}
      />
    );
  }

  if (screen === "rf01_mesa") {
    return (
      <WaiterDashboard
        user={user}
        onSubmitOrder={handleSubmitOrder}
        onBack={() => setScreen("dashboard")}
      />
    );
  }

  if (screen === "rf01b_operador") {
    return (
      <OperatorDashboard
        user={user}
        onSubmitOrder={handleSubmitOrder}
        onBack={() => setScreen("dashboard")}
      />
    );
  }

  if (screen === "rf02_qr") {
    return (
      <QROrderScreen
        onSubmitOrder={handleSubmitOrder}
        onBack={() => setScreen("dashboard")}
      />
    );
  }

  if (screen === "rf03_gestion") {
    return (
      <OrderManagement
        orders={orders}
        user={user}
        onUpdateStatus={handleUpdateStatus}
        onBack={() => setScreen("dashboard")}
      />
    );
  }

  return null;
}
