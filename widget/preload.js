import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("spotify", {
  login: () => ipcRenderer.invoke("spotify-login"),
  getCurrentTrack: () => ipcRenderer.invoke("get-current-track"),
  getLyrics: (artist, song) =>
    ipcRenderer.invoke("get-lyrics", artist, song),
  close: () => ipcRenderer.send("close-widget"),
    closeWindow: () => ipcRenderer.send("close-window")

});
