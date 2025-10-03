// backend/config/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
// 1. Importamos 'app' desde Electron para acceder a rutas del sistema
const { app } = require("electron");

// 2. Obtenemos la ruta segura para guardar datos de la aplicación
// Esto será una carpeta como: C:\Users\TuUsuario\AppData\Roaming\farmacia-app
const userDataPath = app.getPath("userData");

// 3. Creamos la ruta completa al archivo de la base de datos
// El archivo 'farmacia.db' ahora vivirá dentro de esa carpeta segura.
const dbPath = path.join(userDataPath, "farmacia.db");

console.log("Ruta de la base de datos:", dbPath); // Muy útil para saber dónde se guarda

// Conexión a SQLite (el resto del código es igual)
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    // Si hay un error aquí, la aplicación instalada no funcionará
    console.error("❌ Error CRÍTICO al conectar con SQLite:", err.message);
  } else {
    console.log("✅ Conectado a la base de datos SQLite en:", dbPath);
  }
});

// Crear tablas si no existen
db.serialize(() => {
  // Productos
  db.run(`
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      codigo_barras TEXT UNIQUE,
      precio REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Ventas (cabecera)
  db.run(`
    CREATE TABLE IF NOT EXISTS ventas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total REAL NOT NULL DEFAULT 0,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Detalle de ventas (items)
  db.run(`
    CREATE TABLE IF NOT EXISTS venta_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      venta_id INTEGER NOT NULL,
      producto_id INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      precio_unitario REAL NOT NULL,
      FOREIGN KEY (venta_id) REFERENCES ventas (id),
      FOREIGN KEY (producto_id) REFERENCES productos (id)
    )
  `);

  // Usuarios (para login/token)
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Índice para que las búsquedas por fecha sean rápidas
  db.run(`CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha)`);
});

module.exports = db;