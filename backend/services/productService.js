// backend/services/productService.js
const db = require("../config/db");

const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM productos ORDER BY nombre ASC", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const addProduct = (producto) => {
  return new Promise((resolve, reject) => {
    const { nombre, codigo_barras, precio, stock } = producto;
    const query = `INSERT INTO productos (nombre, codigo_barras, precio, stock) VALUES (?, ?, ?, ?)`;
    
    db.run(query, [nombre, codigo_barras, precio, stock], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return reject({
            code: "DUPLICATE_CODE",
            message: "El producto con este código de barras ya existe."
          });
        }
        return reject(err);
      }
      resolve({ id: this.lastID, ...producto });
    });
  });
};

// NUEVA FUNCIÓN
const updateProduct = (id, producto) => {
    return new Promise((resolve, reject) => {
        const { nombre, codigo_barras, precio, stock } = producto;
        const query = `UPDATE productos SET nombre = ?, codigo_barras = ?, precio = ?, stock = ? WHERE id = ?`;

        db.run(query, [nombre, codigo_barras, precio, stock, id], function(err) {
            if (err) return reject(err);
            if (this.changes === 0) return resolve(null); // No se encontró el producto
            resolve({ id, ...producto });
        });
    });
};

// NUEVA FUNCIÓN
const deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM productos WHERE id = ?`;
        db.run(query, [id], function(err) {
            if (err) return reject(err);
            if (this.changes === 0) return resolve(null); // No se encontró el producto
            resolve(true); // Éxito
        });
    });
};


module.exports = { getAllProducts, addProduct, updateProduct, deleteProduct };