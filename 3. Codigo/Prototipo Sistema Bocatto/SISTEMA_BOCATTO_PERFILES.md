# Sistema Bocatto - Organización por Perfiles

## Estructura de Requisitos Funcionales

El sistema ha sido reorganizado para separar claramente las funcionalidades por perfil de usuario:

### RF-00: Autenticación al Sistema
**Todos los perfiles internos**
- Credenciales de prueba (contraseña: `1234`):
  - `mesero` - Carlos Méndez
  - `operador` - Ana Torres
  - `admin` - Diego Ramírez

---

### Perfil: **MESERO**

#### RF-01: Pedido por Mesa
- **Acceso**: Solo Mesero y Administrador
- **Funcionalidad**: 
  - Selecciona una mesa específica (1-12)
  - Toma el pedido del cliente presencialmente
  - Registra ítems del menú con cantidades y notas opcionales
  - Envía el pedido a cocina con estado "Pendiente"
- **Origen del pedido**: `mesa`
- **Componente**: `WaiterDashboard.tsx`

---

### Perfil: **OPERADOR**

#### RF-01b: Pedido a Nombre de Cliente
- **Acceso**: Solo Operador y Administrador
- **Funcionalidad**:
  - Solicita el nombre del cliente
  - Registra pedidos sin asignar mesa específica
  - Útil para pedidos por teléfono, delivery o mostrador
  - Envía el pedido a cocina con estado "Pendiente"
- **Origen del pedido**: `operador`
- **Datos adicionales**: `clientName` (obligatorio)
- **Componente**: `OperatorDashboard.tsx`

---

### Perfil: **CLIENTE** (Sin autenticación)

#### RF-02: Pedido por QR
- **Acceso**: Público, sin necesidad de login
- **Flujo**:
  1. Cliente hace click en "Acceso Cliente (sin login)" en pantalla de login
  2. Selecciona su número de mesa para simular escaneo del QR
  3. **Si la mesa tiene pedidos activos**: Visualiza el estado de sus pedidos existentes
     - Ve todos los pedidos no entregados de su mesa
     - Puede agregar más ítems o regresar al login
  4. **Si no hay pedidos o elige "Agregar Más Ítems"**: Accede al menú digital
  5. Ingresa su nombre (opcional)
  6. Selecciona ítems del menú
  7. Confirma el pedido que se envía a cocina automáticamente
- **Origen del pedido**: `qr`
- **Datos adicionales**: `clientName` (opcional), `tableNumber` (seleccionado por cliente)
- **Componente**: `QROrderScreen.tsx`
- **Características especiales**:
  - Mesas con pedidos activos se marcan visualmente con indicador amarillo
  - Cliente solo ve pedidos de su mesa específica
  - Puede hacer múltiples pedidos en la misma sesión
- **Nota**: Los empleados con rol Administrador pueden acceder al generador de códigos QR desde el dashboard

---

### Todos los Perfiles Autenticados

#### RF-03: Gestión de Pedidos
- **Acceso**: Mesero, Operador y Administrador
- **Funcionalidad**:
  - Visualiza todos los pedidos del sistema
  - Filtra por estado: Pendiente, En Preparación, Listo, Entregado
  - Actualiza el estado de los pedidos siguiendo el flujo:
    - Pendiente → En Preparación
    - En Preparación → Listo
    - Listo → Entregado
  - Ve detalles completos de cada pedido (ítems, total, origen, cliente)
- **Componente**: `OrderManagement.tsx`

---

## Estructura de Datos

### Order (Pedido)
```typescript
{
  id: string;              // Generado automáticamente (BV-####-ID)
  tableNumber: number;     // Mesa (0 para pedidos de operador)
  items: OrderItem[];      // Ítems del pedido
  status: OrderStatus;     // pendiente | en_preparacion | listo | entregado
  origin: OrderOrigin;     // mesa | qr | operador
  createdAt: Date;         // Fecha y hora de creación
  total: number;           // Total calculado
  clientName?: string;     // Nombre del cliente (opcional para mesa, obligatorio para operador, opcional para QR)
}
```

---

## Rutas de Acceso

### Pantalla Inicial
- `/` → Pantalla de Login (RF-00)
- Estado inicial de App: `login`
- Desde el login hay dos opciones:
  1. **Login de empleados** - Acceso al sistema con credenciales
  2. **Acceso Cliente (sin login)** - Botón que lleva directo al pedido QR

### Rutas Públicas (sin login)
- `rf02_qr_public` → Pedido QR para clientes (accesible desde botón en login)

### Rutas Privadas (requieren autenticación)
- `/login` → Pantalla de autenticación (RF-00)
- `/dashboard` → Dashboard principal con resumen
- `/rf01_mesa` → Pedido por Mesa (Mesero)
- `/rf01b_operador` → Pedido a Nombre de Cliente (Operador)
- `/rf02_qr` → Generador de QR (Admin)
- `/rf03_gestion` → Gestión de Pedidos (Todos)

---

## Cambios Realizados

### 1. Renombramiento de Roles
- ~~`cajero`~~ → **`operador`**
- Actualizado en: `types.ts`, `LoginScreen.tsx`, `MainDashboard.tsx`

### 2. Nuevo Componente: OperatorDashboard
- Permite registrar pedidos a nombre de un cliente
- No requiere selección de mesa
- Solicita nombre del cliente como primer paso

### 3. Acceso Público para Clientes
- QR funciona sin autenticación (`isPublicAccess` prop)
- Botón en pantalla de login "Acceso Cliente (sin login)" para acceder
- Banner visual en vista QR indica "Acceso Cliente (sin login)"
- Botón "Ir al Login" permite regresar a la pantalla de autenticación

### 4. Permisos Diferenciados en MainDashboard
- **Mesero**: RF-01 (Mesa) + RF-03 (Gestión)
- **Operador**: RF-01b (Operador) + RF-03 (Gestión)
- **Administrador**: Todos los RF incluyendo generador QR
- **Cliente**: RF-02 (QR) sin necesidad de dashboard

### 5. Mejoras en OrderManagement
- Muestra nombre del cliente en lugar de mesa cuando `tableNumber = 0`
- Icono actualizado para origen `operador`
- Display correcto de pedidos sin mesa asignada

---

## Flujo de Uso por Perfil

### Mesero
1. Login con credenciales de mesero
2. Click en "Pedido por Mesa" (RF-01)
3. Selecciona mesa
4. Toma pedido del cliente
5. Envía a cocina
6. Puede gestionar pedidos en RF-03

### Operador
1. Login con credenciales de operador
2. Click en "Pedido Operador" (RF-01b)
3. Ingresa nombre del cliente
4. Registra pedido
5. Envía a cocina
6. Puede gestionar pedidos en RF-03

### Cliente
1. En la pantalla de login, click en "Acceso Cliente (sin login)"
2. Selecciona el número de mesa (simulación de escaneo QR)
   - Mesas con pedidos activos se muestran con indicador amarillo
3. Animación de escaneo (2 segundos)
4. **Si la mesa tiene pedidos no entregados**:
   - Ve el estado actual de todos sus pedidos (Pendiente, En Preparación, Listo)
   - Ve detalles de cada pedido: ítems, cantidades, precios, hora
   - Puede elegir "Agregar Más Ítems" o regresar al login
5. **Al acceder al menú** (nueva mesa o agregar más ítems):
   - Visualiza menú digital en formato móvil
   - Opcionalmente ingresa su nombre
   - Selecciona ítems del menú
   - Confirma pedido
6. Recibe confirmación visual del pedido enviado
7. Puede hacer otro pedido, cambiar de mesa o regresar al login

### Administrador
1. Login con credenciales de admin
2. Acceso a todas las funcionalidades
3. Puede generar códigos QR para mesas
4. Puede simular cualquier flujo
