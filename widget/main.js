import { app, BrowserWindow, ipcMain, screen } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { pathToFileURL } from "url";

// recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win;

// dynamically load ESM lyrics module
async function loadLyricsModule() {
  const modulePath = path.join(
    app.getAppPath(),
    "server",
    "routes",
    "lyrics.js"
  );

  const moduleUrl = pathToFileURL(modulePath).href;
  const module = await import(moduleUrl);

  return module.default || module;
}

async function createWindow() {
  win = new BrowserWindow({
    width: 300,
    height: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  const { width } = screen.getPrimaryDisplay().workAreaSize;
  win.setPosition(width - 300, 100);
  win.setOpacity(0.9);

  // load frontend INSIDE electron
  win.loadFile(
    path.join(__dirname, "frontend", "index.html")
  );

  // optional: preload backend
  try {
    const fetchLyrics = await loadLyricsModule();
    console.log("Lyrics module loaded");
  } catch (err) {
    console.error("Lyrics load failed:", err);
  }
}

// IPC example (recommended)
ipcMain.handle("fetch-lyrics", async (_, song, artist) => {
  const fetchLyrics = await loadLyricsModule();
  return fetchLyrics(song, artist);
});

ipcMain.on("close-widget", () => {
  if (win) win.close();
});
ipcMain.on("close-window", () => {
  if (win) {
    win.close();
  }
});

app.whenReady()
  .then(createWindow)
  .catch(console.error);
