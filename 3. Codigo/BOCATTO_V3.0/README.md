# 🍽️ Bocatto — Sistema de Gestión de Pedidos

Sistema web de gestión de pedidos para el restaurante **Bocatto Valley**, desarrollado como proyecto de Ingeniería de Software con metodología **Agile Unified Process (AUP)** e implementación de los patrones de diseño creacionales **Builder** y **Prototype**.

---

## 📋 Descripción del sistema

Bocatto digitaliza y automatiza el flujo completo de atención del restaurante: desde la toma del pedido hasta el cobro en caja. El sistema elimina errores manuales, reduce tiempos de comunicación entre salón y cocina, y ofrece trazabilidad en tiempo real de cada orden.

### Canales de venta soportados
| Canal | Descripción |
|-------|-------------|
| **Mesa** | El mesero toma el pedido en la mesa usando la app |
| **QR** | El cliente escanea el código QR de la mesa y crea su propio pedido |
| **Telefónico** | El operador registra el pedido recibido por llamada |

---

## 🧑‍💼 Roles de usuario

| Rol | Acceso | Descripción |
|-----|--------|-------------|
| `ADMIN` | Total | Gestión completa: usuarios, menú, mesas, promociones, reportes |
| `MESERO` | Mesas, Clientes, Pedidos | Toma pedidos **solo de Mesa** (canal Telefónico no disponible) |
| `OPERADOR` | Clientes, Pedidos | Registra pedidos **solo Telefónicos** (canal Mesa no disponible) |
| `COCINA` | Cocina, Menú (vista) | Ve los pedidos entrantes y los actualiza a LISTO |
| `CAJA` | Caja, Reportes | Cobra pedidos y genera reportes |

> **Nota:** Todos los roles usan el mismo `login.html`. Al ingresar, el sistema detecta el rol y restringe automáticamente las opciones disponibles. El OPERADOR es redirigido a Pedidos con el canal fijado en "Telefónico".

**Credenciales de prueba (seeder):**
| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `123456` | ADMIN |
| `mesero` | `123456` | MESERO |
| `operador` | `123456` | OPERADOR |
| `cocina` | `123456` | COCINA |
| `caja` | `123456` | CAJA |


---

## 🏗️ Arquitectura del proyecto

```
BOCATTO/
├── backend/
│   └── src/
│       ├── app.js                    # Configuración Express + middlewares
│       ├── server.js                 # HTTP Server + Socket.io
│       ├── config/                   # Conexión MongoDB
│       ├── models/                   # Esquemas Mongoose
│       │   ├── Pedido.js             # Canal, items, estado, seguimiento
│       │   ├── Menu.js               # Productos del menú
│       │   ├── Promocion.js          # Descuentos y combos
│       │   ├── Mesa.js               # Mesas y su estado
│       │   ├── Cliente.js            # Clientes registrados
│       │   └── Usuario.js            # Usuarios del sistema con bcrypt
│       ├── controllers/              # Lógica de endpoints HTTP
│       ├── services/                 # Lógica de negocio
│       ├── repositories/             # Acceso a datos (MongoDB)
│       ├── routes/                   # Definición de rutas Express
│       ├── middlewares/              # Auth JWT + roles + errores
│       ├── patterns/                 # ⭐ Patrones de diseño
│       │   ├── builder/
│       │   │   ├── PedidoBuilder.js  # Construcción paso a paso
│       │   │   └── DirectorPedido.js # Orquesta el Builder
│       │   └── prototype/
│       │       ├── Prototype.js          # Interfaz base
│       │       ├── MenuPrototype.js      # Clonación de ítems de menú
│       │       ├── PromocionPrototype.js # Clonación de promociones
│       │       └── PrototypeRegistry.js  # Registro central de prototipos
│       ├── dto/                      # Objetos de transferencia de datos
│       ├── mappers/                  # Transformadores DTO ↔ Modelo
│       ├── validators/               # Validaciones de entrada
│       ├── utils/                    # ApiError, ApiResponse
│       └── seeders/                  # Datos iniciales de prueba
│
└── frontend/
    ├── index.html                    # Shell SPA principal
    ├── login.html                    # Login de Mesero / Admin / etc.
    ├── login-operador.html           # Login exclusivo del Operador
    ├── qr.html                       # Vista pública del cliente (QR)
    ├── assets/
    │   ├── css/                      # Estilos globales
    │   └── js/
    │       ├── app.js                # Inicializa Layout + Router
    │       ├── login.js              # Lógica de autenticación mesero
    │       ├── login-operador.js     # Lógica de autenticación operador
    │       └── qr-order.js           # Lógica del pedido QR público
    ├── components/                   # Sidebar y Navbar (HTML parciales)
    ├── templates/                    # Vistas HTML por sección
    ├── modules/                      # Inicializadores de cada módulo
    ├── controllers/                  # Lógica de UI por módulo
    ├── views/                        # Renderizado de HTML dinámico
    ├── services/                     # Llamadas a la API REST
    ├── utils/                        # Auth, Router, Toast, Modal, etc.
    └── validators/                   # Validaciones del lado cliente
```

---

## ⭐ Patrones de diseño implementados

### 🔨 Builder — Construcción de Pedidos

**Ubicación:** `backend/src/patterns/builder/`

El patrón Builder se aplica en la creación de pedidos para gestionar su complejidad:

```
PedidoBuilder              ← Define los pasos de construcción
    .reset()               ← Limpia el estado anterior
    .setCanal("MESA")      ← Canal: MESA | TELEFONO | QR
    .setMesa(mesaId)       ← Mesa asignada (si aplica)
    .setCliente(clienteId) ← Cliente vinculado
    .setMesero(userId)     ← Empleado que tomó el pedido
    .setDatosEntrega(...)  ← Teléfono y dirección (pedido telefónico)
    .agregarProducto(p,q)  ← Ítem por ítem con cantidad y observación
    .aplicarPromocion(p)   ← Descuento opcional
    .calcularTotal()       ← Calcula el total final
    .build()               ← Valida y construye el objeto Pedido final

DirectorPedido             ← Orquesta el Builder con datos del request
    .construirPedido(datos)
```

**Beneficios aplicados:**
- ✅ Validación centralizada en `build()`: el pedido nunca llega vacío a la BD
- ✅ Campos opcionales sin "constructores monstruo"
- ✅ Mismo proceso de construcción, diferente resultado según el canal

---

### 🧬 Prototype — Clonación de Menú y Promociones

**Ubicación:** `backend/src/patterns/prototype/`

El patrón Prototype se aplica para clonar configuraciones preexistentes:

```
Prototype (base)
├── MenuPrototype       ← Clona ítems del menú (precio, nombre, descripción)
└── PromocionPrototype  ← Clona promociones/combos configurados por el admin

PrototypeRegistry       ← Registro central
    .registrar(nombre, objeto)  ← Registra un prototipo
    .obtener(nombre)            ← Devuelve una copia clonada (sin modificar el original)
```

**Beneficios aplicados:**
- ✅ Creación de combos sin instanciar desde cero
- ✅ El administrador configura una vez; el sistema clona en runtime
- ✅ Reduce jerarquías de fábricas y subclases

---

## 🔌 API REST — Endpoints principales

| Método | Ruta | Rol requerido | Descripción |
|--------|------|---------------|-------------|
| `POST` | `/api/v1/auth/login` | Público | Iniciar sesión |
| `GET` | `/api/v1/menu` | Autenticado | Listar productos del menú |
| `POST` | `/api/v1/pedidos` | MESERO, OPERADOR | Crear pedido |
| `GET` | `/api/v1/pedidos` | ADMIN, MESERO, OPERADOR | Listar pedidos |
| `PUT` | `/api/v1/pedidos/:id/estado` | COCINA, CAJA | Cambiar estado |
| `GET` | `/api/v1/promociones` | ADMIN | Listar promociones |
| `POST` | `/api/v1/promociones` | ADMIN | Crear promoción |
| `PUT` | `/api/v1/promociones/:id` | ADMIN | Editar promoción |
| `DELETE` | `/api/v1/promociones/:id` | ADMIN | Eliminar promoción |
| `GET` | `/api/v1/public/mesas/:id/menu` | Público (QR) | Ver menú de una mesa |
| `POST` | `/api/v1/public/mesas/:id/pedidos` | Público (QR) | Crear pedido QR |
| `GET` | `/api/v1/public/pedidos/seguimiento/:codigo` | Público | Seguimiento por código |

---

## 🚀 Instalación local

### Requisitos
- Node.js ≥ 18
- MongoDB Atlas (o local en `mongodb://127.0.0.1:27017/bocatto`)
- Live Server (extensión VS Code) para el frontend

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

El servidor inicia en `http://localhost:3000`.

Puedes sembrar datos iniciales con:
```bash
npm run seed
```

### 2. Frontend

Abre `frontend/index.html` con **Live Server** (click derecho → "Open with Live Server") en VS Code.

Para el acceso QR, usa `frontend/qr.html?mesa=<ID_MESA>`.

---

## ☁️ Despliegue en Render

### Backend — Web Service (Node.js)

1. Sube el proyecto a un repositorio en GitHub.
2. En [render.com](https://render.com), crea un nuevo **Web Service**.
3. Conecta el repositorio.
4. Configura:
   - **Root directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
5. En **Environment Variables**, agrega:
   ```
   PORT=10000
   MONGO_URI=<tu_string_de_MongoDB_Atlas>
   JWT_SECRET=<secreto_seguro>
   ```
6. Haz clic en **Create Web Service**.

> ⚠️ **Importante:** El plan gratuito de Render "duerme" el servicio después de 15 minutos sin tráfico. Usa **UptimeRobot** (gratis) para hacer ping cada 14 minutos y mantenerlo activo.

---

### Frontend — Static Site

1. En Render, crea un nuevo **Static Site**.
2. Conecta el mismo repositorio.
3. Configura:
   - **Root directory:** `frontend`
   - **Build Command:** *(vacío, no hay build)*
   - **Publish directory:** `.` (raíz de frontend)
4. Render te dará una URL pública tipo `https://bocatto-frontend.onrender.com`.

### Actualizar la URL del backend en el frontend

Después de desplegar el backend, cambia la URL base en el frontend:

**`frontend/services/api.js`**
```js
// Antes (local)
const API = "http://localhost:3000/api/v1";

// Después (Render)
const API = "https://bocatto-backend.onrender.com/api/v1";
```

**`frontend/assets/js/qr-order.js`** (línea 1):
```js
const API_PUBLIC = "https://bocatto-backend.onrender.com/api/v1/public";
```

**`frontend/index.html`** (Socket.io):
```html
<!-- Antes -->
<script src="http://localhost:3000/socket.io/socket.io.js"></script>
<!-- Después -->
<script src="https://bocatto-backend.onrender.com/socket.io/socket.io.js"></script>
```

---

## 📦 Tecnologías utilizadas

| Capa | Tecnología |
|------|------------|
| Backend | Node.js + Express.js v5 |
| Base de datos | MongoDB + Mongoose |
| Autenticación | JWT + bcryptjs |
| Tiempo real | Socket.io |
| Frontend | HTML5 + CSS3 + JavaScript (ES Modules) |
| UI Framework | Bootstrap 5.3 + Bootstrap Icons |
| Fuentes | Google Fonts (Outfit, Playfair Display) |
| Notificaciones | Toast interno + Toastify.js (QR) |
| Metodología | Agile Unified Process (AUP) |
| Patrones | Builder + Prototype |

---

## 👥 Equipo

Proyecto académico — Sexto Semestre, Ingeniería de Software  
Universidad — Grupo ADS
