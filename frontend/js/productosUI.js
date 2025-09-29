import { addProduct, deleteProducto, getProductos, updateProducto } from './productos.js';
import { showConfirm, showSuccess, showError } from './utils/alerts.js';

// Formulario de SweetAlert para editar
async function mostrarFormularioEdicion(productoActual = {}) {
  const { value: formValues } = await Swal.fire({
    title: 'Editar Producto',
    html: `
      <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${productoActual.nombre || ''}">
      <input id="swal-codigo" class="swal2-input" placeholder="Código de Barras" value="${productoActual.codigo_barras || ''}">
      <input id="swal-precio" class="swal2-input" placeholder="Precio" type="number" min="0" step="0.01" value="${productoActual.precio || ''}">
      <input id="swal-stock" class="swal2-input" placeholder="Stock" type="number" min="0" value="${productoActual.stock || ''}">
    `,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const nombre = document.getElementById('swal-nombre').value.trim();
      const codigo_barras = document.getElementById('swal-codigo').value.trim();
      const precio = parseFloat(document.getElementById('swal-precio').value);
      const stock = parseInt(document.getElementById('swal-stock').value, 10);

      if (!nombre || !codigo_barras || isNaN(precio) || isNaN(stock)) {
        Swal.showValidationMessage('Por favor, completa todos los campos.');
        return false;
      }
      if (precio < 0 || stock < 0) {
        Swal.showValidationMessage('El precio y el stock no pueden ser negativos.');
        return false;
      }
      return { nombre, codigo_barras, precio, stock };
    }
  });
  return formValues;
}

// Función principal para renderizar toda la vista de productos
export async function renderProductosView(container) {
  // Limpia listeners antiguos para evitar duplicados
  if (container.handleProductosClick) container.removeEventListener('click', container.handleProductosClick);
  if (container.handleProductosSubmit) container.removeEventListener('submit', container.handleProductosSubmit);

  container.innerHTML = `
    <h2>Gestión de Productos</h2>
    <form id="form-producto">
      <input name="codigo_barras" placeholder="Código de Barras" />
      <input name="nombre" placeholder="Nombre" />
      <input name="precio" placeholder="Precio" type="number" min="0" step="0.01" />
      <input name="stock" placeholder="Stock" type="number" min="0" />
      <button type="submit">➕ Agregar</button>
    </form>
    <div id="productos-lista-container">Cargando productos...</div>
  `;

  const listaContainer = document.getElementById('productos-lista-container');
  
  const dibujarTabla = (productos) => {
    if (!productos || productos.length === 0) {
      listaContainer.innerHTML = '<p>No hay productos registrados.</p>';
      return;
    }
    listaContainer.innerHTML = `
      <table class="tabla-productos">
        <thead> <tr> <th>Código</th> <th>Nombre</th> <th>Precio</th> <th>Stock</th> <th>Acciones</th> </tr> </thead>
        <tbody>
          ${productos.map(p => `
            <tr>
              <td>${p.codigo_barras || 'N/A'}</td>
              <td>${p.nombre}</td>
              <td>$${p.precio.toFixed(2)}</td>
              <td>${p.stock}</td>
              <td>
                <button data-id="${p.id}" data-action="editar" title="Editar">✏️</button>
                <button data-id="${p.id}" data-action="eliminar" title="Eliminar">🗑️</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  };

  let productos = [];
  
  // --- CARGA INICIAL DE DATOS CON MANEJO DE ERRORES ---
  try {
    productos = await getProductos();
    dibujarTabla(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    listaContainer.innerHTML = `<p style="color: red;">Error al cargar los productos. Revisa la consola del backend (terminal).</p>`;
  }

  // --- MANEJADORES DE EVENTOS ---

  container.handleProductosClick = async (e) => {
    const button = e.target.closest('button[data-action]');
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === 'eliminar') {
      const confirm = await showConfirm('¿Estás seguro?', 'Esta acción no se puede revertir.');
      if (confirm && confirm.isConfirmed) {
        await deleteProducto(id);
        showSuccess('Producto eliminado');
        productos = await getProductos();
        dibujarTabla(productos);
      }
    }

    if (action === 'editar') {
      const productoActual = productos.find(p => p.id === parseInt(id));
      const datosEditados = await mostrarFormularioEdicion(productoActual);
      if (datosEditados) {
        await updateProducto(id, datosEditados);
        showSuccess('Producto actualizado');
        productos = await getProductos();
        dibujarTabla(productos);
      }
    }
  };

  container.handleProductosSubmit = async (e) => {
    if (e.target.id === 'form-producto') {
      e.preventDefault();
      const form = e.target;
      const botonAgregar = form.querySelector('button[type="submit"]');
      const formData = new FormData(form);
      const stockValue = formData.get('stock').trim();
      
      const nuevoProducto = {
        codigo_barras: formData.get('codigo_barras').trim(),
        nombre: formData.get('nombre').trim(),
        precio: Number(formData.get('precio')),
        stock: Number(stockValue),
      };

      if (!nuevoProducto.codigo_barras || !nuevoProducto.nombre || isNaN(nuevoProducto.precio) || stockValue === '') {
        return showError('Todos los campos son obligatorios.');
      }
      if (nuevoProducto.precio < 0 || nuevoProducto.stock < 0) {
        return showError('El precio y el stock no pueden ser negativos.');
      }

      botonAgregar.disabled = true;
      botonAgregar.textContent = 'Agregando...';

      const fueExitoso = await addProduct(nuevoProducto);

      if (fueExitoso) {
        productos = await getProductos();
        dibujarTabla(productos);
        form.reset();
      }

      botonAgregar.disabled = false;
      botonAgregar.textContent = '➕ Agregar';
    }
  };
  
  container.addEventListener('click', container.handleProductosClick);
  container.addEventListener('submit', container.handleProductosSubmit);
}