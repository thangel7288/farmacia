// frontend/js/app.js
import { renderProductosUI } from "./productosUI.js";

document.addEventListener("DOMContentLoaded", () => {
  renderProductosUI();

  Swal.fire({
    title: "Bienvenido 👋",
    text: "La app de Farmacia está lista",
    icon: "success",
    confirmButtonText: "Entrar"
  });
});
