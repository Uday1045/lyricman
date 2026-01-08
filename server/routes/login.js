import express from "express";
const router = express.Router();

const client_id = "f7bdca0d4e774f9d89131731d65456de";
const redirect_uri = "https://lyricman-1.onrender.com/callback";
const scope = "user-read-currently-playing user-read-playback-state";

router.get("/login", (req, res) => {
  const auth_url = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${encodeURIComponent(
    redirect_uri
  )}&scope=${encodeURIComponent(scope)}`;
  res.redirect(auth_url);
});

export default router;
