import { getProductos, addProducto, updateProducto, deleteProducto } from "./productos.js";
import { showError, showConfirm } from "./utils/alerts.js";

// Render principal
export function renderProductosUI() {
  document.getElementById("app").innerHTML = `
    <h1>Gestión de Productos</h1>

    <form id="form-producto">
      <input type="text" name="nombre" placeholder="Nombre" required />
      <input type="number" name="precio" placeholder="Precio" required />
      <input type="number" name="stock" placeholder="Stock" required />
      <button type="submit">Agregar Producto</button>
    </form>

    <div id="productos-lista"></div>
  `;

  // Cargar productos
  renderProductos();

  // Listener del formulario
  document.getElementById("form-producto").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;

    const data = {
      nombre: form.nombre.value,
      precio: parseFloat(form.precio.value),
      stock: parseInt(form.stock.value),
    };

    try {
      await addProducto(data);
      form.reset();
      renderProductos();
    } catch (err) {
      showError("Error al agregar producto");
    }
  });
}

// Renderizar lista de productos
async function renderProductos() {
  const container = document.getElementById("productos-lista");
  container.innerHTML = "";
  const productos = await getProductos();

  if (productos.length === 0) {
    container.innerHTML = "<p>No hay productos registrados.</p>";
    return;
  }

  productos.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("producto-item");
    div.innerHTML = `
      <strong>${p.nombre}</strong>  
      <span>💰 $${p.precio}</span>  
      <span>📦 Stock: ${p.stock}</span>
      <button class="editar">✏️ Editar</button>
      <button class="eliminar">🗑️ Eliminar</button>
    `;

    // Editar
    div.querySelector(".editar").addEventListener("click", async () => {
      const nuevoNombre = prompt("Nuevo nombre:", p.nombre);
      const nuevoPrecio = prompt("Nuevo precio:", p.precio);
      const nuevoStock = prompt("Nuevo stock:", p.stock);

      if (nuevoNombre && nuevoPrecio && nuevoStock) {
        await updateProducto(p.id, {
          nombre: nuevoNombre,
          precio: parseFloat(nuevoPrecio),
          stock: parseInt(nuevoStock),
        });
        renderProductos();
      }
    });

    // Eliminar con confirmación
    div.querySelector(".eliminar").addEventListener("click", async () => {
      const confirmar = await showConfirm("¿Seguro que deseas eliminar este producto?");
      if (confirmar) {
        await deleteProducto(p.id);
        renderProductos();
      }
    });

    container.appendChild(div);
  });
}
