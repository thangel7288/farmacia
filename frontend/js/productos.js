// frontend/js/productos.js

import { showSuccess, showError } from "./utils/alerts.js";

// Se asegura de importar TODAS las funciones necesarias desde api.js
import { getProductosApi, createProductoApi, updateProductoApi, deleteProductoApi } from '../api.js';
// ✅ La palabra 'export' es la clave
export async function addProduct(data) {
  try {
    await createProductoApi(data);
    showSuccess("✅ Producto agregado correctamente");
    return true; // <-- Clave: Devuelve 'true' si todo salió bien
  } catch (err) {
    showError(err.message);
    return false; // <-- Clave: Devuelve 'false' si hubo un error
  }
}

// ✅ La palabra 'export' es la clave
export async function updateProducto(id, data) {
  try {
    await updateProductoApi(id, data);
    showSuccess("✏️ Producto actualizado correctamente");
  } catch (err) {
    showError(err.message);
  }
}

// ✅ La palabra 'export' es la clave
export async function deleteProducto(id) {
  try {
    await deleteProductoApi(id);
    showSuccess("🗑️ Producto eliminado correctamente");
  } catch (err) {
    showError(err.message);
  }
}

// ✅ La palabra 'export' es la clave
export async function getProductos() {
  try {
    return await getProductosApi();
  } catch (err) {
    showError(err.message);
    return []; 
  }
}