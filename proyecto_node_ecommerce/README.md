E-commerce Backend Project
Este es el backend de un proyecto de e-commerce desarrollado en Node.js utilizando tecnologías como Express, MongoDB y WebSockets.

Estructura del proyecto:

├── src
│   ├── public
│   ├── routes
│   ├── service
│        ├── models
│   ├── views
│   └── app.js
├── 
├── package.json
└── README.md

   - public: Archivos de cara al cliente, manejo de css, imagenes y logica js
   - routes: Define las rutas de la API y vistas al cliente.
   - service: Clases donde se gestionarán: carrito, productos y usuarios
   - models: esquema de carrito, productos y usuarios.
   - views: Archivo de vistas para renderizar
   - app.js: Entrada principal al servidor

Características:
  - Autenticación de usuarios con sesiones.
  - Gestión de productos y carritos de compra.
  - WebSockets para la actualización en tiempo real del carrito.
  - Integración con MongoDB para la persistencia de datos.
  - Rutas protegidas por middleware de autenticación.

Requisitos:
Para ejecutar este proyecto localmente, asegúrate de tener instalado lo siguiente:
  - Node.js (versión 14 o superior)
  - MongoDB

Uso:
Registro de Usuario.
  - Los usuarios pueden registrarse a través de la ruta /register. Después de registrarse, pueden iniciar sesión en /login y comenzar a agregar productos a su carrito.

Carrito de Compras
  - Los usuarios autenticados pueden agregar productos a su carrito utilizando la ruta /products.
  - En la ruta /realTimeProducts se puede agregar productos nuevos en tiempo real con el uso de websocket.

Rutas de la API:
Método - Ruta - Descripción
GET -	/api/users -  Obtener usuarios 
POST -	/api/users -	Registrar un nuevo usuario
DELETE - /api/users/:uid -  Eliminar usuario por id

GET -	/api/products -	Obtener todos los productos disponibles
POST -	/api/products -	Crear productos nuevos
PUT -	/api/products/:uid -	Actualizar los productos por ID
DELETE -	/api/products/:uid -	Eliminar los productos por ID

GET -	/api/carts/:cid -	Obtener carrito por ID
POST -	/api/carts -	Crear un nuevo carrito
POST -	/api/carts/:cid/product/:pid -	Agregar un producto al carrito
PUT -	/api/carts/:cid -	Actualizar carrito con productos nuevos
PUT - /api/carts/:cid -	Actualizar solo el quantity del producto dentro de un carrito
DELETE -	/api/carts/:cid -	ELiminar todos los productos del carrito
DELETE -	/api/carts/:cid/product/:pid -	ELiminar solo un producto del carrito