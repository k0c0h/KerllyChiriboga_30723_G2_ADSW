# PROYECTO_ADSFW - Sistema Bocatto

Base de desarrollo Java con arquitectura MVC, repositorio en memoria y patrones de diseño.

## Estructura

```
src/main/java/com/bocatto/
├── view/                        # VISTAS (Boundaries / Fronteras)
│   └── FormularioLogin.java     # Pantalla de acceso [REQ001-1]
│
├── controller/                  # CONTROLADORES (Logic / Controls)
│   ├── AuthController.java      # Gestión de autenticación
│   └── PedidoController.java    # Gestión de pedidos
│
├── model/                       # MODELO (Entities / Entidades)
│   ├── Usuario.java             # Atributos de usuario y rol
│   ├── Pedido.java              # Estructura del pedido
│   ├── Menu.java                # Catálogo de productos
│   └── Cliente.java             # Datos del cliente
│
├── repository/                  # REPOSITORIOS (Persistencia)
│   ├── UsuarioRepository.java    # Interfaz de gestión de usuarios
│   ├── UsuarioRepositoryMemoria.java # Implementación en memoria
│   ├── PedidoRepository.java     # Interfaz de gestión de pedidos
│   └── PedidoRepositoryMemoria.java # Implementación en memoria
│
├── service/                     # Capa de Servicio (Lógica de negocio)
│   └── ValidacionService.java   # Validación de datos
│
├── patterns/                    # PATRONES DE DISEÑO FUTUROS
│   ├── factory/                 # Factory Pattern para crear objetos
│   ├── strategy/                # Strategy Pattern para métodos de pago
│   └── singleton/               # Singleton Pattern para DB
│
└── Main.java                    # Punto de entrada
```

## Ejecución

```powershell
.\build.ps1
```

## Credenciales de prueba

- **mesero** / `1234` (Rol: MESERO)
- **operador** / `1234` (Rol: OPERADOR)
- **admin** / `1234` (Rol: ADMIN)

## Características implementadas

- ✅ Autenticación de usuarios (REQ001-1)
- ✅ Validación de credenciales
- ✅ Interfaz gráfica con Swing
- ✅ Repositorio en memoria
- ✅ Estructura MVC
- ⏳ Control de seguridad (REQ001-3)
- ⏳ Registro de pedidos (pendiente)
- ⏳ Patrones de diseño (Factory, Strategy, Singleton)
