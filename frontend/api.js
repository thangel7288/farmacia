const API_URL = "http://localhost:3000/api";
const TOKEN = "mi-token-supersecreto";

async function fetchData(endpoint) {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    headers: { "Authorization": `Bearer ${TOKEN}` }
  });
  if (!res.ok) throw new Error(`Error en ${endpoint}`);
  return res.json();
}

export const getProductos = () => fetchData("productos");
export const getVentas = () => fetchData("ventas");
