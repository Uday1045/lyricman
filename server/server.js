// import express from "express";
// import path from "path";
// import { fileURLToPath } from "url";

// import spotifyRouter from "./routes/spotify.js";
// import callbackRouter from "./routes/callback.js";
// import lyricRouter from "./routes/lyrics.js";

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Required for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ✅ Serve frontend FIRST
// app.use(express.static(path.join(__dirname, "../widget")));
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../widget/index.html"));
// });

// // ✅ API / OAuth routes
// app.use("/", callbackRouter);
// app.use("/", spotifyRouter);
// app.use("/", lyricRouter);

// // 🚀 Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import express from "express";
import spotifyRouter from "./routes/spotify.js";
import callbackRouter from "./routes/callback.js";
import lyricRouter from "./routes/lyrics.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("LyricMan backend is running 🚀");
});

app.use("/", callbackRouter);
app.use("/", spotifyRouter);
app.use("/", lyricRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
