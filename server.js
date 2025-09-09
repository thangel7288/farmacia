const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Conexión a la base de datos (SQLite)
const dbPath = path.resolve(__dirname, "main", "database", "farmacia.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err.message);
  } else {
    console.log("✅ Conectado a la base de datos SQLite.");
  }
});

// Ejemplo de endpoint
app.get("/products", (req, res) => {
  db.all("SELECT * FROM Product", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ products: rows });
  });
});

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
