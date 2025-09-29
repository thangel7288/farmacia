// frontend/js/utils/alerts.js
export function showSuccess(message) {
  Swal.fire({
    icon: "success",
    title: "Éxito",
    text: message,
    showConfirmButton: false, // Es mejor que los mensajes de éxito se vayan solos
    timer: 1500
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

// 👇 FUNCIÓN CORREGIDA
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
  // Devuelve el objeto de resultado COMPLETO
  return result; 
}

export async function showEditForm(producto) {
  const { value: formValues } = await Swal.fire({
    title: "Editar producto",
    html: `
      <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${producto.nombre}">
      <input id="swal-codigo" class="swal2-input" placeholder="Código de Barras" value="${producto.codigo_barras}">
      <input id="swal-precio" type="number" class="swal2-input" placeholder="Precio" value="${producto.precio}">
      <input id="swal-stock" type="number" class="swal2-input" placeholder="Stock" value="${producto.stock}">
    `,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      // (Añadí validación aquí para más seguridad)
      const nombre = document.getElementById("swal-nombre").value;
      const precio = document.getElementById("swal-precio").value;
      const stock = document.getElementById("swal-stock").value;
      if (!nombre || !precio || !stock) {
        Swal.showValidationMessage('Todos los campos son requeridos');
        return false;
      }
      return {
        nombre: nombre,
        // (Añadí el código de barras que faltaba)
        codigo_barras: document.getElementById("swal-codigo").value,
        precio: Number(precio),
        stock: Number(stock),
      };
    }
  });

  return formValues;
}