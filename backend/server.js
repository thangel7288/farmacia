// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// Routers
const productRouter = require("./routes/productRouter");
const ventaRouter = require("./routes/ventaRouter");
const saleRouter = require("./routes/saleRouter");

const app = express();
const PORT = 3000;

// 🔑 Token fijo (local)
const FIXED_TOKEN = "mi-token-supersecreto";

app.use(cors());
app.use(bodyParser.json());

// Middleware de autenticación
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token !== FIXED_TOKEN) {
    return res.status(403).json({ error: "Token inválido o faltante" });
  }
  next();
}

// ✅ Rutas API (protegidas)
app.use("/api/productos", authenticateToken, productRouter);
app.use("/api/ventas", authenticateToken, ventaRouter);
app.use("/api/ventas", authenticateToken, saleRouter);

// Endpoint para obtener el token (solo pruebas)
app.get("/api/token", (req, res) => {
  res.json({ token: FIXED_TOKEN });
});

// Servir el frontend (HTML, CSS, JS) de la carpeta frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Si alguien entra a "/" → carga el index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor local corriendo en http://localhost:${PORT}`);
});
