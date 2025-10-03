// main.js
const { app: electronApp, BrowserWindow, dialog } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'frontend/index.html'));
  // Ya no necesitamos abrir las DevTools aquí, la ventana de error es más directa.
  // mainWindow.webContents.openDevTools(); 
}

electronApp.whenReady().then(() => {
  try {
    // --- INTENTAMOS ARRANCAR EL BACKEND ---
    const backendApp = require('./backend/server'); 
    const PORT = 3000;

    backendApp.listen(PORT, () => {
      console.log(`🚀 Servidor backend interno iniciado en http://localhost:${PORT}`);
      createWindow();
    });

  } catch (error) {
    // --- ¡AQUÍ ESTÁ LA TRAMPA! ---
    // Si algo falla al cargar o iniciar el backend (como un require('sqlite3') fallido),
    // se mostrará una ventana de error del sistema con el detalle.
    dialog.showErrorBox(
      'Error Crítico al Iniciar',
      `Ocurrió un error fatal en el proceso principal:\n\n${error.stack || error}`
    );
    electronApp.quit(); // Cierra la app si no puede arrancar el backend.
  }

  electronApp.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

electronApp.on('window-all-closed', function () {
  if (process.platform !== 'darwin') electronApp.quit();
});