import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import spotifyRouter from "./routes/spotify.js";
import callbackRouter from "./routes/callback.js";
import lyricRouter from "./routes/lyrics.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Required for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve frontend FIRST
app.use(express.static(path.join(__dirname, "../widget")));

// ✅ API / OAuth routes
app.use("/", callbackRouter);
app.use("/", spotifyRouter);
app.use("/", lyricRouter);

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
