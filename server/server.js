import express from "express";
import path from "path";
import { fileURLToPath } from "url";
// import loginRouter from "./routes/login.js";
import spotifyRouter from "./routes/spotify.js";
import callbackRouter from "./routes/callback.js";
import lyricRouter from "./routes/lyrics.js";

const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


app.use("/", callbackRouter);
app.use("/", spotifyRouter);
app.use("/", lyricRouter);

app.listen(PORT, () => console.log(`Server running at http://127.0.0.1:3000`));
