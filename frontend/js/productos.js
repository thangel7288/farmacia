import { showSuccess, showError, showConfirm, showEditForm } from "./utils/alerts.js";

export async function addProducto(data) {
  try {
    const res = await fetch("http://localhost:3000/api/productos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer mi-token-supersecreto",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error al crear producto");

    showSuccess("✅ Producto agregado correctamente");
  } catch (err) {
    showError(err.message);
  }
}

export async function updateProducto(id, productoActual) {
  try {
    const data = await showEditForm(productoActual);
    if (!data) return; // canceló

    const res = await fetch(`http://localhost:3000/api/productos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer mi-token-supersecreto",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error al actualizar producto");

    showSuccess("✏️ Producto actualizado correctamente");
  } catch (err) {
    showError(err.message);
  }
}

export async function deleteProducto(id) {
  try {
    const confirm = await showConfirm("Este producto será eliminado permanentemente");
    if (!confirm) return;

    const res = await fetch(`http://localhost:3000/api/productos/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer mi-token-supersecreto",
      },
    });

    if (!res.ok) throw new Error("Error al eliminar producto");

    showSuccess("🗑️ Producto eliminado correctamente");
  } catch (err) {
    showError(err.message);
  }
}

export async function getProductos() {
  try {
    const res = await fetch("http://localhost:3000/api/productos", {
      headers: {
        "Authorization": "Bearer mi-token-supersecreto",
      },
    });

    if (!res.ok) throw new Error("Error al obtener productos");

    return await res.json();
  } catch (err) {
    showError(err.message);
    return [];
  }
}
