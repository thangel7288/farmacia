// frontend/js/utils/alerts.js
export function showSuccess(message) {
  Swal.fire({
    icon: "success",
    title: "Éxito",
    text: message,
    confirmButtonColor: "#4CAF50"
  });
}

export function showError(message) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    confirmButtonColor: "#d33"
  });
}

export async function showConfirm(message) {
  const result = await Swal.fire({
    icon: "warning",
    title: "¿Estás seguro?",
    text: message,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar"
  });
  return result.isConfirmed;
}

export async function showEditForm(producto) {
  const { value: formValues } = await Swal.fire({
    title: "Editar producto",
    html: `
      <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${producto.nombre}">
      <input id="swal-precio" type="number" class="swal2-input" placeholder="Precio" value="${producto.precio}">
      <input id="swal-stock" type="number" class="swal2-input" placeholder="Stock" value="${producto.stock}">
    `,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      return {
        nombre: document.getElementById("swal-nombre").value,
        precio: Number(document.getElementById("swal-precio").value),
        stock: Number(document.getElementById("swal-stock").value),
      };
    }
  });

  return formValues;
}
