import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/lyrics", async (req, res) => {
  const { artist, title } = req.query;

  if (!artist || !title) {
    return res.status(400).json({ error: "Artist and title required" });
  }

  try {
    const response = await fetch(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
    );

    if (!response.ok) {
      return res.status(404).json({ lyrics: "Lyrics not found 😢" });
    }

    const data = await response.json();
    res.json({ lyrics: data.lyrics || "Lyrics not found 😢" });
  } catch (err) {
    console.error("Lyrics error:", err);
    res.status(500).json({ error: "Failed to fetch lyrics" });
  }
});

export default router;  