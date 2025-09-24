// backend/routes/productRouter.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// =======================
// Obtener todos los productos
// =======================
router.get("/", (req, res) => {
  const sql = "SELECT * FROM productos";
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// =======================
// Crear producto nuevo
// =======================
router.post("/", (req, res) => {
  const { nombre, codigo_barras, precio, stock } = req.body;

  if (!nombre || !codigo_barras || !precio) {
    return res
      .status(400)
      .json({ error: "Faltan datos obligatorios: nombre, código o precio." });
  }

  // Verificar si ya existe el producto con ese código
  const checkSql = "SELECT * FROM productos WHERE codigo_barras = ?";
  db.get(checkSql, [codigo_barras], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (row) {
      return res
        .status(400)
        .json({ error: "El código de barras ya está registrado." });
    }

    // Insertar nuevo producto
    const sql =
      "INSERT INTO productos (nombre, codigo_barras, precio, stock) VALUES (?, ?, ?, ?)";
    db.run(sql, [nombre, codigo_barras, precio, stock || 0], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, nombre, codigo_barras, precio, stock });
    });
  });
});

// =======================
// Actualizar stock por código de barras
// =======================
router.put("/:codigo_barras/stock", (req, res) => {
  const { codigo_barras } = req.params;
  const { stock } = req.body;

  if (stock == null) {
    return res.status(400).json({ error: "Debes enviar un valor para stock." });
  }

  const sql = "UPDATE productos SET stock = ? WHERE codigo_barras = ?";
  db.run(sql, [stock, codigo_barras], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    res.json({ mensaje: "Stock actualizado correctamente" });
  });
});

// =======================
// Eliminar producto por código de barras
// =======================
router.delete("/:codigo_barras", (req, res) => {
  const { codigo_barras } = req.params;

  const sql = "DELETE FROM productos WHERE codigo_barras = ?";
  db.run(sql, [codigo_barras], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    res.json({ mensaje: "Producto eliminado correctamente" });
  });
});

module.exports = router;
