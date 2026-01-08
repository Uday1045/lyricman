import fetch from "node-fetch";
import express from "express";

const router = express.Router();


const client_id = "f7bdca0d4e774f9d89131731d65456de";
const client_secret = "72637a121666421b93b5fcc6332f2e5d";
const redirect_uri = "https://lyricman-1.onrender.com/callback";

let accessToken = "";
let refreshToken = "";
let tokenExpiry = 0; // timestamp in ms

export function getAccessToken() {
  return accessToken;
}

export function isTokenExpired() {
  return Date.now() > tokenExpiry - 60000;
}

router.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.redirect("/");

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirect_uri);
  params.append("client_id", client_id);
  params.append("client_secret", client_secret);

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const data = await response.json();
    accessToken = data.access_token;
    refreshToken = data.refresh_token;
    tokenExpiry = Date.now() + data.expires_in * 1000; // save expiry time

    console.log("✅ Access token obtained, expires in", data.expires_in, "seconds");

    res.redirect("/");
  } catch (err) {
    console.error("Error exchanging code:", err);
    res.status(500).send("Error during callback");
  }
});

router.get("/refresh-token", async (req, res) => {
  if (!refreshToken) return res.status(401).json({ error: "No refresh token available" });

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);
  params.append("client_id", client_id);
  params.append("client_secret", client_secret);

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + data.expires_in * 1000;

    console.log("♻️ Access token refreshed!");
    res.json({ success: true });
  } catch (err) {
    console.error("Error refreshing token:", err);
    res.status(500).send("Failed to refresh token");
  }
});
export default router;

export { accessToken, refreshToken, tokenExpiry };