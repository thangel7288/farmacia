import { getProductos } from './productos.js';
import { createVentaApi } from '../api.js';
import { showSuccess, showError } from './utils/alerts.js';

let carrito = [];
let todosLosProductos = [];

// --- MANEJO DE CANTIDADES ---

function incrementarCantidad(productoId) {
  const item = carrito.find(p => p.id === productoId);
  const productoInfo = todosLosProductos.find(p => p.id === productoId);

  if (item && productoInfo.stock > item.cantidad) {
    item.cantidad++;
    renderCarrito();
  } else {
    showError('No hay más stock disponible.');
  }
}

function decrementarCantidad(productoId) {
  const item = carrito.find(p => p.id === productoId);
  if (item) {
    item.cantidad--;
    if (item.cantidad === 0) {
      carrito = carrito.filter(p => p.id !== productoId);
    }
    renderCarrito();
  }
}

// --- LÓGICA DEL CARRITO Y VENTA ---

function renderCarrito() {
  const carritoItemsContainer = document.getElementById('carrito-items');
  const totalValorSpan = document.getElementById('carrito-total-valor');
  const btnFinalizarVenta = document.getElementById('btn-finalizar-venta');

  if (!carritoItemsContainer) return;

  if (carrito.length === 0) {
    carritoItemsContainer.innerHTML = '<p>El carrito está vacío.</p>';
    btnFinalizarVenta.disabled = true;
  } else {
    carritoItemsContainer.innerHTML = `
      <ul class="lista-carrito">
        ${carrito.map(item => `
          <li>
            <span>${item.nombre}</span>
            <div class="carrito-controles">
              <button data-id="${item.id}" data-action="decrementar" class="btn-cantidad">-</button>
              <span>${item.cantidad}</span>
              <button data-id="${item.id}" data-action="incrementar" class="btn-cantidad">+</button>
            </div>
            <span><strong>$${(item.cantidad * item.precio).toFixed(2)}</strong></span>
          </li>
        `).join('')}
      </ul>
    `;
    btnFinalizarVenta.disabled = false;
  }

  const total = carrito.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);
  totalValorSpan.textContent = total.toFixed(2);
}

function agregarAlCarrito(productoId) {
  const itemExistente = carrito.find(item => item.id === productoId);
  if (itemExistente) {
    incrementarCantidad(productoId);
    return;
  }
  const productoAAgregar = todosLosProductos.find(p => p.id === productoId);
  if (!productoAAgregar) return;
  if (productoAAgregar.stock > 0) {
    carrito.push({ ...productoAAgregar, cantidad: 1 });
    renderCarrito();
  } else {
    showError('Este producto no tiene stock disponible.');
  }
}

function renderResultadosBusqueda(resultados) {
  const contenedorResultados = document.getElementById('resultados-busqueda');
  if (!resultados || resultados.length === 0) {
    contenedorResultados.innerHTML = '';
    return;
  }
  contenedorResultados.innerHTML = `
    <ul class="lista-resultados">
      ${resultados.map(p => `
        <li data-id="${p.id}">
          <strong>${p.nombre}</strong> - $${p.precio.toFixed(2)} (Stock: ${p.stock})
        </li>
      `).join('')}
    </ul>
  `;
}

async function finalizarVenta() {
  if (carrito.length === 0) {
    return showError("El carrito está vacío.");
  }
  const itemsParaVenta = carrito.map(item => ({ id: item.id, cantidad: item.cantidad }));
  try {
    const resultado = await createVentaApi({ items: itemsParaVenta });
    showSuccess(resultado.mensaje || "¡Venta realizada con éxito!");
    carrito = [];
    renderCarrito();
    todosLosProductos = await getProductos();
  } catch (error) {
    showError(error.message);
  }
}

// --- FUNCIÓN PRINCIPAL DE LA VISTA ---

export async function renderVentasView(container) {
  // Limpia listeners antiguos para evitar duplicados
  if (container.handleVentasClick) {
    container.removeEventListener('click', container.handleVentasClick);
  }
  if (container.handleVentasSubmit) {
    container.removeEventListener('submit', container.handleVentasSubmit);
  }
  if (container.handleVentasInput) {
    const oldInput = container.querySelector('#input-busqueda');
    if (oldInput) {
        oldInput.removeEventListener('input', container.handleVentasInput);
    }
  }

  todosLosProductos = await getProductos();

  container.innerHTML = `
    <div class="vista-ventas">
      <div class="panel-busqueda">
        <h2>Punto de Venta</h2>
        <form id="form-busqueda-producto" novalidate>
          <input type="text" id="input-busqueda" placeholder="Buscar por nombre o escanear código..." autofocus />
        </form>
        <div id="resultados-busqueda"></div>
      </div>
      <div class="panel-carrito">
        <h3>Carrito de Compras</h3>
        <div id="carrito-items"><p>El carrito está vacío.</p></div>
        <div class="carrito-total"><strong>Total: $<span id="carrito-total-valor">0.00</span></strong></div>
        <button id="btn-finalizar-venta" disabled>Finalizar Venta</button>
      </div>
    </div>
  `;

  renderCarrito();

  const inputBusqueda = document.getElementById('input-busqueda');

  // --- MANEJADORES DE EVENTOS ---

  container.handleVentasClick = (e) => {
    const target = e.target;
    const itemBusqueda = target.closest('.lista-resultados li');
    if (itemBusqueda) {
      const productoId = parseInt(itemBusqueda.dataset.id, 10);
      agregarAlCarrito(productoId);
      inputBusqueda.value = '';
      document.getElementById('resultados-busqueda').innerHTML = '';
      inputBusqueda.focus();
      return;
    }
    const btnCantidad = target.closest('.btn-cantidad');
    if (btnCantidad) {
      const productoId = parseInt(btnCantidad.dataset.id, 10);
      const action = btnCantidad.dataset.action;
      if (action === 'incrementar') incrementarCantidad(productoId);
      if (action === 'decrementar') decrementarCantidad(productoId);
      return;
    }
    if (target.id === 'btn-finalizar-venta') {
      finalizarVenta();
    }
  };

  container.handleVentasSubmit = (e) => {
    if (e.target.id === 'form-busqueda-producto') {
      e.preventDefault();
      const codigo = inputBusqueda.value.trim();
      if (codigo === '') return;
      const productoEncontrado = todosLosProductos.find(p => p.codigo_barras === codigo);
      if (productoEncontrado) {
        agregarAlCarrito(productoEncontrado.id);
      } else {
        showError('Producto no encontrado con ese código.');
        inputBusqueda.select();
      }
    }
  };
  
  container.handleVentasInput = (e) => {
    const termino = e.target.value.toLowerCase().trim();
    if (termino.length < 2) {
      document.getElementById('resultados-busqueda').innerHTML = '';
      return;
    }
    const resultados = todosLosProductos.filter(p => 
      p.nombre.toLowerCase().includes(termino) ||
      (p.codigo_barras && p.codigo_barras.toLowerCase().includes(termino))
    );
    renderResultadosBusqueda(resultados);
  };

  container.addEventListener('click', container.handleVentasClick);
  container.addEventListener('submit', container.handleVentasSubmit);
  inputBusqueda.addEventListener('input', container.handleVentasInput);
}