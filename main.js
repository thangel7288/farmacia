const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "main", "preload.js"),
    },
  });

  // Cargar tu index.html (el frontend)
  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

  // Abrir DevTools (opcional en desarrollo)
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
