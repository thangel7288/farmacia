// frontend/js/productosUI.js
import { updateProducto, deleteProducto, getProductos } from "./productos.js";

export function renderProductosUI(productos = []) {
  const lista = document.getElementById("productos-lista");
  if (!lista) return;

  if (productos.length === 0) {
    lista.innerHTML = "<p>No hay productos registrados</p>";
    return;
  }

  lista.innerHTML = `
    <table border="1" cellpadding="5">
      <tr>
        <th>Código</th>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Stock</th>
        <th>Acciones</th>
      </tr>
      ${productos
        .map(
          (p) => `
        <tr>
          <td>${p.codigo}</td>
          <td>${p.nombre}</td>
          <td>${p.precio}</td>
          <td>${p.stock}</td>
          <td>
            <button onclick="editarProducto(${p.id})">✏️</button>
            <button onclick="eliminarProducto(${p.id})">🗑️</button>
          </td>
        </tr>
      `
        )
        .join("")}
    </table>
  `;

  // Globales
  window.editarProducto = async (id) => {
    const producto = productos.find((p) => p.id === id);
    if (producto) {
      await updateProducto(id, producto);
      const productosActualizados = await getProductos();
      renderProductosUI(productosActualizados);
    }
  };

  window.eliminarProducto = async (id) => {
    await deleteProducto(id);
    const productosActualizados = await getProductos();
    renderProductosUI(productosActualizados);
  };
}
