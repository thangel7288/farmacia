// frontend/js/app.js

import { renderProductosView } from './productosUI.js';
import { renderVentasView } from './ventasUI.js';
import { renderHistorialVentasView } from './historialVentasUI.js'; // <-- 1. Importa la nueva función

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  app.innerHTML = `
    <nav class="menu">
      <button id="btnVentas">💵 Punto de Venta</button>
      <button id="btnProductos">📦 Productos</button>
      <button id="btnHistorial">🧾 Historial</button>  
    </nav>
    <section id="vista"></section>
  `;

  const vista = document.getElementById("vista");

  document.getElementById("btnVentas").addEventListener("click", () => {
    renderVentasView(vista);
  });

  document.getElementById("btnProductos").addEventListener("click", () => {
    renderProductosView(vista);
  });
  
  // 👇 3. Llama a renderHistorialVentasView cuando se hace clic
  document.getElementById("btnHistorial").addEventListener("click", () => {
    renderHistorialVentasView(vista);
  });

  // Carga la vista de ventas por defecto al iniciar
  renderVentasView(vista); 
});