// frontend/js/app.js
import { renderTabla } from "../ui/renderTabla.js";
import { renderCards } from "../ui/renderCards.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  // Renderizamos solo el menú principal
  app.innerHTML = `
    <nav class="menu">
      <button id="btnProductos">📦 Productos</button>
      <button id="btnVentas">💵 Ventas</button>
    </nav>
    <section id="vista"></section>
  `;

  const vista = document.getElementById("vista");

  // Eventos del menú
  document.getElementById("btnProductos").addEventListener("click", () => {
    renderTabla(vista);
  });

  document.getElementById("btnVentas").addEventListener("click", () => {
    renderCards(vista);
  });
});
