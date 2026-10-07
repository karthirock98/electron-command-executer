// oxlint-disable eslint-plugin-unicorn/no-empty-file
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

console.log("from preload.ts");

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  runCommand: (userCommands: string, directoryInput: string) => {
    console.log("Hello from preload");
    return ipcRenderer.invoke("run-command", userCommands, directoryInput);
  },
  openFolder: () => {
    return ipcRenderer.invoke("select-folder");
  },
  onCommandOutput: (callback: (data: any) => void) => {
    ipcRenderer.on("command-output", (_event, data) => {
      callback(data);
    });
  },
});
