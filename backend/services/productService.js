const db = require("../config/db");

const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM productos", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const addProduct = (producto) => {
  return new Promise((resolve, reject) => {
    const { nombre, codigo_barras, precio, stock } = producto;
    db.run(
      `INSERT INTO productos (nombre, codigo_barras, precio, stock) VALUES (?, ?, ?, ?)`,
      [nombre, codigo_barras, precio, stock],
      function (err) {
        if (err) {
          console.error("⚠️ Error SQLite:", err); // 👈 veremos el error real en consola
          if (err.message.includes("UNIQUE constraint failed")) {
            return reject({
              code: "DUPLICATE_CODE",
              message: "El producto con este código de barras ya existe. Usa PUT para actualizarlo."
            });
          }
          return reject(err);
        }
        resolve({ id: this.lastID, ...producto });
      }
    );
  });
};
module.exports = { getAllProducts, addProduct };
