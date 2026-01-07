import express from "express";
import fetch from "node-fetch";
import puppeteer from "puppeteer";

const router = express.Router();

// ⚠️ Replace with your Genius API token
const GENIUS_TOKEN = "9ZBN1btSf5_0KEqxGf9mvRsMrSmDE1I4husHuUlCFAItFydul17e8gnuiMiqyQXH";
 let browser;
async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
  headless: true,
      executablePath: puppeteer.executablePath(),

  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-first-run',
    '--no-zygote',
    '--single-process'
  ],
});
  }
  return browser;
}

router.get("/lyrics", async (req, res) => {
  const artist = req.query.artist;
  const title = req.query.title;

  if (!artist || !title)
    return res.status(400).json({ error: "Missing artist or title" });

  try {
    const searchRes = await fetch(
      `https://api.genius.com/search?q=${encodeURIComponent(artist + " " + title)}`,
      {
        headers: { Authorization: `Bearer ${GENIUS_TOKEN}` },
      }
    );

    if (!searchRes.ok)
      return res.status(searchRes.status).json({ error: "Genius API search failed" });

    const searchData = await searchRes.json();
    const hits = searchData.response.hits;
    if (!hits.length) return res.status(404).json({ error: "Lyrics not found" });

const songHit = hits.find(hit => hit.result.url.endsWith("-lyrics"));
if (!songHit) return res.status(404).json({ error: "Lyrics not found" });

const songUrl = songHit.result.url;

   
const browser = await getBrowser();

    const page = await browser.newPage();
    await page.setUserAgent(
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
);
    await page.goto(songUrl, { waitUntil: "networkidle2", timeout: 60000 });

    // Wait for the lyric containers to appear
await page.waitForSelector(
  'div[data-lyrics-container="true"], .Lyrics__Container-sc-1ynbvzw-6, .lyrics',
  { timeout: 15000 }
).catch(() => {});
await page.evaluate(() => {
  window.scrollBy(0, document.body.scrollHeight);
});
await new Promise(resolve => setTimeout(resolve, 2000));

  let lyrics = await page.$$eval('div[data-lyrics-container="true"]', divs =>
  divs.map(div => div.innerText).join("\n\n")
);

if (!lyrics || !lyrics.trim()) {
  const alt = await page.$eval('.lyrics', el => el.innerText).catch(() => "");
  lyrics = alt || "";
}


    await page.close();

    if (!lyrics || !lyrics.trim()) {
      return res.status(404).json({ error: "Lyrics not found in rendered page" });
    }

    // Step 4: Clean up lyrics text
    const cleanLyrics = lyrics
      .replace(/\s*\d+\s*Contributors?/gi, "") // remove contributor lines
      .replace(/Translations?/gi, "")
      .replace(/\n{3,}/g, "\n\n") // collapse multiple newlines
      .trim();

    res.json({ lyrics: cleanLyrics });
  } catch (err) {
    console.error("Lyrics fetch error:", err);
    res.status(500).json({ error: "Server error fetching lyrics" });
  }
});

export default router;
