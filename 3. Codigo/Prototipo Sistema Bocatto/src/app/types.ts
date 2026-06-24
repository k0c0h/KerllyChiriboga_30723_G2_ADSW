export type Role = "mesero" | "operador"; // | "administrador";

export type OrderStatus = "pendiente" | "en_preparacion" | "listo" | "entregado";
export type OrderOrigin = "mesa" | "qr" | "operador";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  notes: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  origin: OrderOrigin;
  createdAt: Date;
  total: number;
  clientName?: string;
}

export interface SessionUser {
  username: string;
  name: string;
  role: Role;
}

export const MENU_ITEMS: MenuItem[] = [
  // Entradas
  { id: "e1", name: "Bruschetta al Tomate", price: 5.50, category: "Entradas", description: "Pan tostado con tomate y albahaca" },
  { id: "e2", name: "Tabla de Quesos", price: 8.00, category: "Entradas", description: "Selección de quesos artesanales" },
  { id: "e3", name: "Calamares a la Romana", price: 7.50, category: "Entradas", description: "Calamares fritos con alioli" },
  // Platos Fuertes
  { id: "p1", name: "Lasagna Boloñesa", price: 12.00, category: "Platos Fuertes", description: "Lasagna con carne y bechamel" },
  { id: "p2", name: "Pollo al Limón", price: 11.50, category: "Platos Fuertes", description: "Pechuga de pollo con salsa de limón" },
  { id: "p3", name: "Salmón a la Plancha", price: 15.00, category: "Platos Fuertes", description: "Filete de salmón con vegetales" },
  { id: "p4", name: "Risotto de Hongos", price: 10.00, category: "Platos Fuertes", description: "Risotto cremoso con hongos frescos" },
  { id: "p5", name: "Filete Mignon", price: 18.00, category: "Platos Fuertes", description: "Filete de res con guarnición" },
  // Pizzas
  { id: "z1", name: "Pizza Margherita", price: 9.00, category: "Pizzas", description: "Tomate, mozzarella y albahaca" },
  { id: "z2", name: "Pizza Cuatro Quesos", price: 11.00, category: "Pizzas", description: "Mozzarella, gorgonzola, parmesano y brie" },
  { id: "z3", name: "Pizza Pepperoni", price: 10.50, category: "Pizzas", description: "Pepperoni y mozzarella" },
  // Postres
  { id: "d1", name: "Tiramisú", price: 5.00, category: "Postres", description: "Clásico italiano con café y mascarpone" },
  { id: "d2", name: "Panna Cotta", price: 4.50, category: "Postres", description: "Con coulis de frutos rojos" },
  { id: "d3", name: "Gelato Artesanal", price: 3.50, category: "Postres", description: "3 bolas a elección" },
  // Bebidas
  { id: "b1", name: "Agua Mineral", price: 1.50, category: "Bebidas", description: "500ml con o sin gas" },
  { id: "b2", name: "Jugo Natural", price: 3.00, category: "Bebidas", description: "Naranja, mora o maracuyá" },
  { id: "b3", name: "Café Espresso", price: 2.00, category: "Bebidas", description: "Doble shot de espresso" },
  { id: "b4", name: "Vino de la Casa", price: 6.00, category: "Bebidas", description: "Copa de vino tinto o blanco" },
];

export const TABLES = Array.from({ length: 12 }, (_, i) => i + 1);

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: "Pendiente",
  en_preparacion: "En Preparación",
  listo: "Listo",
  entregado: "Entregado",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pendiente: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  en_preparacion: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  listo: "bg-green-500/20 text-green-300 border-green-500/30",
  entregado: "bg-stone-500/20 text-stone-400 border-stone-500/30",
};

export const ORIGIN_LABELS: Record<OrderOrigin, string> = {
  mesa: "Mesa",
  qr: "QR",
  operador: "Operador",
};
