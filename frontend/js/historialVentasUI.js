import { getVentasApi } from '../api.js';
import { showError } from './utils/alerts.js';

/**
 * Renderiza la vista del historial de ventas.
 * @param {HTMLElement} container - El elemento donde se dibujará la vista.
 */
export async function renderHistorialVentasView(container) {
  container.innerHTML = `<h2>Cargando historial de ventas...</h2>`;

  try {
    const data = await getVentasApi();

    // VERIFICACIÓN CLAVE:
    // Nos aseguramos de que 'data.ventas' sea una lista (array) antes de usarlo.
    // Si no lo es, usamos una lista vacía para evitar que el programa se rompa.
    const historial = Array.isArray(data.ventas) ? data.ventas : [];
    const totalMes = data.totalMes || 0;

    if (historial.length === 0) {
      container.innerHTML = `
        <h2>Historial de Ventas</h2>
        <p>Aún no se han registrado ventas este mes.</p>
      `;
      return;
    }

    // HTML actualizado para mostrar el total del mes en la parte superior
    container.innerHTML = `
      <div class="historial-header">
        <h2>Historial de Ventas</h2>
        <div class="total-mes-card">
          <strong>Total vendido este mes:</strong>
          <span>$${totalMes.toFixed(2)}</span>
        </div>
      </div>
      <div class="historial-ventas-lista">
        ${historial.map(venta => `
          <div class="venta-card">
            <div class="venta-card-header">
              <strong>Venta #${venta.venta_id}</strong>
              <span>${new Date(venta.fecha).toLocaleString('es-CO', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}</span>
            </div>
            <ul class="venta-card-body">
              ${venta.productos.map(p => `
                <li>
                  <span>${p.cantidad} x ${p.nombre}</span>
                  <span>$${p.subtotal.toFixed(2)}</span>
                </li>
              `).join('')}
            </ul>
            <div class="venta-card-footer">
              <strong>Total: $${venta.total.toFixed(2)}</strong>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    showError(error.message);
    container.innerHTML = `<h2>Error al cargar el historial</h2>`;
  }
}