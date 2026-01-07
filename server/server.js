import express from "express";
import spotifyRouter from "./routes/spotify.js";
import callbackRouter from "./routes/callback.js";
import lyricRouter from "./routes/lyrics.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Health check
app.get("/", (req, res) => {
  res.send("LyricMan backend is running 🚀");
});

// Routes
app.use("/", callbackRouter);
app.use("/", spotifyRouter);
app.use("/", lyricRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
