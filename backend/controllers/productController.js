const productService = require("../services/productService");

exports.getProductos = (req, res) => {
  productService.getAll((err, rows) => {
    if (err) {
      res.status(500).json({ error: "Error al obtener productos" });
    } else {
      res.json(rows);
    }
  });
};

exports.addProducto = (req, res) => {
  const { nombre, codigo_barras, precio, stock } = req.body;

  productService.create({ nombre, codigo_barras, precio, stock }, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: "Producto agregado", id: result.id });
    }
  });
};
