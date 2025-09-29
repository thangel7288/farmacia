// backend/controllers/ventaController.js

const ventaService = require('../services/ventaService');
const db = require("../config/db");

/**
 * 🔹 Crear una nueva venta.
 * Llama al servicio de ventas para procesar la lógica de la transacción.
 */
exports.createSale = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Se requieren items para la venta" });
    }

    // Llama al servicio y espera a que la transacción se complete o falle.
    const resultado = await ventaService.createSale(items);
    
    // Si todo fue exitoso, envía una única respuesta de éxito.
    res.status(201).json(resultado);

  } catch (error) {
    // Si algo falló en el servicio, envía una única respuesta de error.
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🔹 Obtener todas las ventas con sus productos.
 * Esta función ya estaba bien estructurada.
 */
exports.getSales = (req, res) => {
  const sql = `
    SELECT 
      v.id as venta_id, 
      datetime(v.fecha, '-5 hours') as fecha,
      v.total,
      p.nombre, 
      vi.cantidad, 
      vi.precio_unitario
    FROM ventas v
    JOIN venta_items vi ON v.id = vi.venta_id
    JOIN productos p ON vi.producto_id = p.id
    WHERE strftime('%Y-%m', datetime(v.fecha, '-5 hours')) = strftime('%Y-%m', 'now', '-5 hours')
    ORDER BY v.id DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

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
    
    const ventas = Object.values(ventasMap);
    const totalMes = ventas.reduce((sum, venta) => sum + venta.total, 0);

    res.json({
      ventas: ventas,
      totalMes: totalMes,
    });
  });
};