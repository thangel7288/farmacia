// backend/routes/productRouter.js
const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./farmacia.db");

// ✅ Crear producto
router.post("/", (req, res) => {
  const { codigo, nombre, precio, stock } = req.body;

  if (!codigo || !nombre || !precio || !stock) {
    return res.status(400).json({ error: "Faltan campos" });
  }

  db.run(
    "INSERT INTO productos (codigo, nombre, precio, stock) VALUES (?, ?, ?, ?)",
    [codigo, nombre, precio, stock],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, codigo, nombre, precio, stock });
    }
  );
});

// ✅ Listar productos
router.get("/", (req, res) => {
  db.all("SELECT * FROM productos", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// ✅ Actualizar producto
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { codigo, nombre, precio, stock } = req.body;

  db.run(
    "UPDATE productos SET codigo = ?, nombre = ?, precio = ?, stock = ? WHERE id = ?",
    [codigo, nombre, precio, stock, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json({ id, codigo, nombre, precio, stock });
    }
  );
});

// ✅ Eliminar producto
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM productos WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ mensaje: "Producto eliminado" });
  });
});

module.exports = router;
