// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Routers
const productRouter = require("./routes/productRouter");
const ventaRouter = require("./routes/ventaRouter");
// Tienes dos routers para ventas, usaré solo uno. Asegúrate de que sea el correcto.
// const saleRouter = require("./routes/saleRouter"); 

const app = express();

// Token fijo (local)
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

// Rutas API (protegidas)
app.use("/api/productos", authenticateToken, productRouter);
app.use("/api/ventas", authenticateToken, ventaRouter);
// app.use("/api/ventas", authenticateToken, saleRouter); // Esta línea es redundante

// Hemos quitado las líneas `app.use(express.static(...))` y `app.get("*", ...)`
// porque Electron ya se encarga de mostrar tu frontend con el comando `mainWindow.loadFile()`.

// 👇 CAMBIO CLAVE: Exportamos la app en lugar de iniciarla aquí.
module.exports = app;