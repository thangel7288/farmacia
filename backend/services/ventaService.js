// backend/services/ventaService.js
const db = require("../config/db");

function dbRun(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function dbGet(query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

const createSale = async (items) => {
  await dbRun("BEGIN TRANSACTION");
  try {
    const ventaResult = await dbRun("INSERT INTO ventas (total, fecha) VALUES (0, datetime('now'))");
    const ventaId = ventaResult.lastID;
    let totalCalculado = 0;

    // Este bucle 'for...of' procesa un item a la vez, esperando que termine cada uno
    for (const item of items) {
      const producto = await dbGet("SELECT * FROM productos WHERE id = ?", [item.id]);

      if (!producto || producto.stock < item.cantidad) {
        // Si hay un error, 'throw' lo envía directamente al 'catch' y detiene el bucle
        throw new Error(`Stock insuficiente para "${producto?.nombre || 'desconocido'}"`);
      }

      const subtotal = producto.precio * item.cantidad;
      totalCalculado += subtotal;

      await dbRun(
        "INSERT INTO venta_items (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
        [ventaId, producto.id, item.cantidad, producto.precio]
      );

      await dbRun(
        "UPDATE productos SET stock = stock - ? WHERE id = ?",
        [item.cantidad, producto.id]
      );
    }

    await dbRun("UPDATE ventas SET total = ? WHERE id = ?", [totalCalculado, ventaId]);
    await dbRun("COMMIT");

    return {
      ventaId,
      total: totalCalculado,
      mensaje: "Venta registrada exitosamente."
    };
  } catch (error) {
    // Si cualquier paso falla, se revierte toda la transacción
    await dbRun("ROLLBACK");
    throw error; // Lanza el error para que el controlador lo atrape
  }
};

module.exports = { createSale };