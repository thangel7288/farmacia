const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Obtener todos los productos
router.get("/", (req, res) => {
  const sql = "SELECT * FROM productos";
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Crear producto nuevo
router.post("/", (req, res) => {
  const { nombre, codigo_barras, precio, stock } = req.body;
  const sql =
    "INSERT INTO productos (nombre, codigo_barras, precio, stock) VALUES (?, ?, ?, ?)";
  db.run(sql, [nombre, codigo_barras, precio, stock], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, nombre, codigo_barras, precio, stock });
  });
});

// Actualizar stock por código de barras
router.put("/:codigo_barras/stock", (req, res) => {
  const { codigo_barras } = req.params;
  const { stock } = req.body;

  const sql = "UPDATE productos SET stock = ? WHERE codigo_barras = ?";
  db.run(sql, [stock, codigo_barras], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ mensaje: "Stock actualizado correctamente" });
  });
});

module.exports = router;
