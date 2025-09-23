document.getElementById('btnTest').addEventListener('click', async () => {
  const res = await fetch('http://localhost:3000/api/test');
  const data = await res.json();
  alert('Respuesta del backend: ' + data.message);
});
