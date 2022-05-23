import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";

import destroyConnection from "./ipc/destroy-connection";
import establishConnection from "./ipc/establish-connection";
import sqlHandler from "./ipc/sql-handler";
import validateConnection from "./ipc/validate-connection";
import { activeConnection, setConnection } from "./state";

function createWindow() {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    frame: false,
    darkTheme: true,
    movable: true,
    show: false,
    webPreferences: {
      preload: path.resolve(__dirname, "contextBridge.js"),
    },
  });

  window.loadFile("index.html");

  window.on("ready-to-show", () => window.show());
}

app.whenReady().then(() => {
  ipcMain.handle("validate-connection", validateConnection);
  ipcMain.on("establish-connection", establishConnection);
  ipcMain.on("destroy-connection", destroyConnection);
  ipcMain.handle("sql", sqlHandler);

  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

process.on("beforeExit", () => {
  if (activeConnection) {
    activeConnection.destroy();
    setConnection(undefined);
  }
});
