// server/routes/spotify.js
import express from "express";
import fetch from "node-fetch";
import { accessToken, refreshToken, tokenExpiry } from "./callback.js";

const router = express.Router();


router.get("/current-track", async (req, res) => {
  try {
    // Refresh token if expired
    if (Date.now() > tokenExpiry - 60000 && refreshToken) {
      console.log("⚠️ Token expired, refreshing...");
      await fetch(`http://127.0.0.1:3000/refresh-token`);
    }

    const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const text = await response.text();
    if (!text) return res.status(204).send(); 
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Spotify returned non-JSON:", text);
      return res.status(500).send("Invalid Spotify response");
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching current track:", err);
    res.status(500).send("Error fetching track");
  }
});
export default router;
