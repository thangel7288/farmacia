const express = require("express");
const router = express.Router();
const ventaController = require("../controllers/ventaController");

router.post("/", ventaController.createSale);
router.get("/", ventaController.getSales); // 👈 aquí está el GET

module.exports = router;
