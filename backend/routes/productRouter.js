// backend/routes/productRouter.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Define las rutas y las conecta con las funciones del controlador
router.get("/", productController.getProducts);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);       // <-- Añadido
router.delete("/:id", productController.deleteProduct);   // <-- Añadido

module.exports = router;