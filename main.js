// main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,   // necesario para JS plano
      contextIsolation: false, // habilita require en frontend si lo usa
    },
  });

  // 👉 Cargar el index.html desde la carpeta frontend
  mainWindow.loadFile(path.join(__dirname, "frontend", "index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
    if (backendProcess) {
      backendProcess.kill(); // cierra el backend al salir
    }
  });
}

app.on("ready", () => {
  // 🚀 Iniciar backend automáticamente
  const serverPath = path.join(__dirname, "backend", "server.js");

  backendProcess = spawn("node", [serverPath], {
    stdio: "inherit", // muestra logs en la terminal
    shell: true,
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
