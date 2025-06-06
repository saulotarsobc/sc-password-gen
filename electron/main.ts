import { app, BrowserWindow, shell } from "electron";
import { join } from "node:path";

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow;

async function createWindow() {
  win = new BrowserWindow({
    title: `SC - Password Gen - v0.0.1`,
    width: 400,
    minWidth: 400,
    maxWidth: 400,
    height: 600,
    minHeight: 600,
    maxHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, "preload.js"),
    },
  });

  win.setMenu(null);

  if (app.isPackaged) {
    win.loadFile(join(__dirname, "..", "..", "dist", "frontend", "index.html"));
  } else {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  };

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.on("activate", () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
      allWindows[0].focus();
    } else {
      createWindow();
    }
  });
}

app.whenReady().then(createWindow);
