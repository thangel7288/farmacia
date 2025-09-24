document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  app.innerHTML = "<h2>Hola desde app.js (Electron)</h2>";
  console.log("JS cargado en Electron ✅");
});
