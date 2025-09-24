// backend/routes/saleRouter.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Registrar una venta
router.post("/", (req, res) => {
  const { codigo_barras, cantidad } = req.body;

  if (!codigo_barras || !cantidad) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  // 1. Buscar el producto
  db.get(
    "SELECT * FROM productos WHERE codigo_barras = ?",
    [codigo_barras],
    (err, producto) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      // 2. Validar stock
      if (producto.stock < cantidad) {
        return res
          .status(400)
          .json({ error: "Stock insuficiente para realizar la venta" });
      }

      const total = producto.precio * cantidad;

      // 3. Registrar venta y actualizar stock
      db.run(
        "INSERT INTO ventas (producto_id, cantidad, total) VALUES (?, ?, ?)",
        [producto.id, cantidad, total],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });

          db.run(
            "UPDATE productos SET stock = stock - ? WHERE id = ?",
            [cantidad, producto.id],
            (err2) => {
              if (err2) return res.status(500).json({ error: err2.message });

              res.json({
                mensaje: "Venta registrada con éxito",
                venta: {
                  id: this.lastID,
                  producto: producto.nombre,
                  cantidad,
                  total,
                },
              });
            }
          );
        }
      );
    }
  );
});

module.exports = router;
