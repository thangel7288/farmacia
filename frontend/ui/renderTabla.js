// frontend/ui/renderTabla.js
import { renderProductosUI } from "../js/productosUI.js";
import { getProductos, addProducto } from "../js/productos.js";

export async function renderTabla(container) {
  container.innerHTML = `
    <h2>📦 Lista de Productos</h2>
    
    <form id="form-producto" style="margin-bottom: 20px;">
      <input type="text" id="codigo" placeholder="Código de barras" required />
      <input type="text" id="nombre" placeholder="Nombre" required />
      <input type="number" id="precio" placeholder="Precio" required />
      <input type="number" id="stock" placeholder="Stock" required />
      <button type="submit">➕ Agregar Producto</button>
    </form>
    
    <div id="productos-lista"></div>
  `;

  // Render inicial
  try {
    const productos = await getProductos();
    renderProductosUI(productos);
  } catch (error) {
    console.error("Error cargando productos:", error);
    document.getElementById("productos-lista").innerHTML =
      "<p>Error cargando productos</p>";
  }

  // Agregar evento al formulario
  const form = document.getElementById("form-producto");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoProducto = {
      codigo: document.getElementById("codigo").value,
      nombre: document.getElementById("nombre").value,
      precio: Number(document.getElementById("precio").value),
      stock: Number(document.getElementById("stock").value),
    };

    await addProducto(nuevoProducto);

    // Recargar lista después de agregar
    const productos = await getProductos();
    renderProductosUI(productos);

    form.reset();
  });
}
