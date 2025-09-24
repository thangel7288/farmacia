const productService = require("../services/productService");

const getProducts = async (req, res) => {
  try {
    const productos = await productService.getAllProducts();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message || "Error al obtener productos" });
  }
};

const createProduct = async (req, res) => {
  try {
    const nuevo = await productService.addProduct(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error("Error en createProduct:", error); // 👈 para debug en consola

    if (error.code === "DUPLICATE_CODE") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || "Error al crear producto" });
    }
  }
};

module.exports = { getProducts, createProduct };
