import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronApi", {
  call: (event: string, ...args: any[]) => ipcRenderer.send(event, args),
  get: (event: string, ...args: any[]) => ipcRenderer.invoke(event, args),
});
