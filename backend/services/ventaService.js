const db = require("../config/db");

/**
 * items = [{ codigo_barras, cantidad }]
 * total = optional (si lo envía el cliente); si no, calculamos sumando precio_unitario*cantidad
 */
const createSale = (items, totalFromClient) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION", (errBegin) => {
        if (errBegin) return reject(errBegin);

        // Insert venta cabecera (total lo calculamos después si es necesario)
        db.run(
          `INSERT INTO ventas (producto_id, cantidad, total) VALUES (?, ?, ?)`,
          [null, 0, totalFromClient || 0],
          function (errInsertVenta) {
            if (errInsertVenta) {
              db.run("ROLLBACK");
              return reject(errInsertVenta);
            }

            const ventaId = this.lastID;
            let computedTotal = 0;
            let idx = 0;

            const next = () => {
              if (idx >= items.length) {
                // Actualizar total real en la tabla ventas
                db.run(
                  "UPDATE ventas SET producto_id = NULL, cantidad = 0, total = ? WHERE id = ?",
                  [computedTotal, ventaId],
                  (errUpdate) => {
                    if (errUpdate) {
                      db.run("ROLLBACK");
                      return reject(errUpdate);
                    }
                    db.run("COMMIT", (errCommit) => {
                      if (errCommit) {
                        db.run("ROLLBACK");
                        return reject(errCommit);
                      }
                      resolve({ ventaId, itemsInserted: items.length, total: computedTotal });
                    });
                  }
                );
                return;
              }

              const it = items[idx++];
              const codigo = it.codigo_barras;
              const cantidad = Number(it.cantidad);
              if (!codigo || !Number.isFinite(cantidad) || cantidad <= 0) {
                db.run("ROLLBACK");
                return reject(new Error("Item inválido: codigo_barras y cantidad > 0"));
              }

              // Buscar producto por barcode
              db.get("SELECT id, stock, precio FROM productos WHERE codigo_barras = ?", [codigo], (errGet, product) => {
                if (errGet) {
                  db.run("ROLLBACK");
                  return reject(errGet);
                }
                if (!product) {
                  db.run("ROLLBACK");
                  return reject(new Error("Producto no encontrado: " + codigo));
                }
                if (product.stock < cantidad) {
                  db.run("ROLLBACK");
                  return reject(new Error(`Stock insuficiente para ${codigo}`));
                }

                const newStock = product.stock - cantidad;
                // 1) actualizar stock
                db.run("UPDATE productos SET stock = ? WHERE id = ?", [newStock, product.id], function (errUpd) {
                  if (errUpd) {
                    db.run("ROLLBACK");
                    return reject(errUpd);
                  }
                  // 2) insertar item de venta
                  const precioUnit = product.precio;
                  const lineTotal = precioUnit * cantidad;
                  computedTotal += lineTotal;

                  db.run(
                    "INSERT INTO venta_items (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
                    [ventaId, product.id, cantidad, precioUnit],
                    function (errInsertItem) {
                      if (errInsertItem) {
                        db.run("ROLLBACK");
                        return reject(errInsertItem);
                      }
                      // continuar con siguiente item
                      next();
                    }
                  );
                });
              });
            }; // end next()

            // Si no hay items -> commit vacío
            next();
          }
        ); // end insert venta
      }); // end begin
    }); // end serialize
  });
};

module.exports = { createSale };
