const ventaService = require("../services/ventaService");

const createSale = async (req, res) => {
  const { items, total } = req.body;
  // items: [{ codigo_barras, cantidad }, ...]
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Se requieren items de venta" });
  }

  try {
    const result = await ventaService.createSale(items, total);
    res.status(201).json(result); // { ventaId, insertedItems: N, total }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createSale };
