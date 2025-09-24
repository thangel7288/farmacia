// backend/controllers/ventaController.js
const db = require("../config/db");

// 🔹 Crear una venta
exports.createSale = (req, res) => {
  const { items } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Se requieren items de venta" });
  }

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    // Insertar cabecera de venta
    const insertVenta = `INSERT INTO ventas (fecha) VALUES (datetime('now'))`;
    db.run(insertVenta, function (err) {
      if (err) {
        db.run("ROLLBACK");
        return res.status(500).json({ error: err.message });
      }

      const ventaId = this.lastID;
      let total = 0;
      let processed = 0;

      items.forEach((item) => {
        const { codigo_barras, cantidad } = item;

        // Buscar producto por código de barras
        db.get(
          "SELECT * FROM productos WHERE codigo_barras = ?",
          [codigo_barras],
          (err, producto) => {
            if (err) {
              db.run("ROLLBACK");
              return res.status(500).json({ error: err.message });
            }

            if (!producto || producto.stock < cantidad) {
              db.run("ROLLBACK");
              return res
                .status(400)
                .json({ error: `Stock insuficiente para ${codigo_barras}` });
            }

            const subtotal = producto.precio * cantidad;
            total += subtotal;

            // Insertar item en venta_items
            db.run(
              "INSERT INTO venta_items (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
              [ventaId, producto.id, cantidad, producto.precio],
              (err) => {
                if (err) {
                  db.run("ROLLBACK");
                  return res.status(500).json({ error: err.message });
                }

                // Actualizar stock del producto
                db.run(
                  "UPDATE productos SET stock = stock - ? WHERE id = ?",
                  [cantidad, producto.id],
                  (err) => {
                    if (err) {
                      db.run("ROLLBACK");
                      return res.status(500).json({ error: err.message });
                    }

                    processed++;
                    if (processed === items.length) {
                      // Actualizar total en la cabecera de la venta
                      db.run(
                        "UPDATE ventas SET total = ? WHERE id = ?",
                        [total, ventaId],
                        (err) => {
                          if (err) {
                            db.run("ROLLBACK");
                            return res
                              .status(500)
                              .json({ error: err.message });
                          }

                          db.run("COMMIT");
                          res.status(201).json({
                            ventaId,
                            itemsInserted: items.length,
                            total,
                          });
                        }
                      );
                    }
                  }
                );
              }
            );
          }
        );
      });
    });
  });
};

// 🔹 Obtener todas las ventas (agrupadas con sus productos)
exports.getSales = (req, res) => {
  const sql = `
    SELECT v.id as venta_id, v.fecha, v.total,
           p.nombre, vi.cantidad, vi.precio_unitario
    FROM ventas v
    JOIN venta_items vi ON v.id = vi.venta_id
    JOIN productos p ON vi.producto_id = p.id
    ORDER BY v.id DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // Agrupar ventas con sus productos
    const ventasMap = {};
    rows.forEach((row) => {
      if (!ventasMap[row.venta_id]) {
        ventasMap[row.venta_id] = {
          venta_id: row.venta_id,
          fecha: row.fecha,
          total: row.total,
          productos: [],
        };
      }
      ventasMap[row.venta_id].productos.push({
        nombre: row.nombre,
        cantidad: row.cantidad,
        precio_unitario: row.precio_unitario,
        subtotal: row.cantidad * row.precio_unitario,
      });
    });

    res.json(Object.values(ventasMap));
  });
};
