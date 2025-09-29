// backend/controllers/productController.js
const productService = require("../services/productService");

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const productos = await productService.getAllProducts();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message || "Error al obtener productos" });
  }
};

// Crear un producto
const createProduct = async (req, res) => {
  try {
    const nuevo = await productService.addProduct(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    if (error.code === "DUPLICATE_CODE") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || "Error al crear producto" });
    }
  }
};

// Actualizar un producto (NUEVO)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await productService.updateProduct(id, req.body);
    if (!actualizado) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message || "Error al actualizar producto" });
  }
};

// Eliminar un producto (NUEVO)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await productService.deleteProduct(id);
        if (!resultado) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message || "Error al eliminar producto" });
    }
};


module.exports = { getProducts, createProduct, updateProduct, deleteProduct };