import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Proxy and Error Handling for Open-Meteo
app.get("/api/weather-proxy", async (req, res) => {
  try {
    const url = req.query.url as string;
    if (!url) return res.status(400).json({ error: "No URL provided" });

    const response = await fetch(url);
    
    if (!response.ok) {
      const text = await response.text();
      // Handle cases where 404 returns HTML instead of JSON
      if (text.startsWith("<!doctype") || text.startsWith("<html")) {
        return res.status(response.status).json({ 
          error: `API returned HTML error: ${response.status}`,
          isHtml: true 
        });
      }
      return res.status(response.status).json({ error: `API Error: ${response.status}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: "Network error fetching weather data" });
  }
});

// Vite Middleware for Dev
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
