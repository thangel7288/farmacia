// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const productRouter = require("./routes/productRouter");
const ventaRouter = require("./routes/ventaRouter");
const saleRouter = require("./routes/saleRouter");


const app = express();
const PORT = 3000;

// 🔑 Token único para todo el sistema
const FIXED_TOKEN = "mi-token-supersecreto";

app.use(cors());
app.use(bodyParser.json());

// Middleware para validar token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token !== FIXED_TOKEN) {
    return res.status(403).json({ error: "Token inválido o faltante" });
  }

  next();
}

// Rutas protegidas
app.use("/api/productos", productRouter);
app.use("/api/ventas", ventaRouter);
app.use("/api/ventas", saleRouter);
app.use("/api/productos", productRouter);



// Endpoint para obtener el token (solo para pruebas)
app.get("/api/token", (req, res) => {
  res.json({ token: FIXED_TOKEN });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${3000}`);
});
