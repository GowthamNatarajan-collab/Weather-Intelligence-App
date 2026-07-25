import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Proxy for Weather Data
  app.get("/api/weather-proxy", async (req, res) => {
    const targetUrl = req.query.url as string;

    if (!targetUrl) {
      return res.status(400).json({ error: "No URL provided" });
    }

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Local-Dev-Weather-Proxy'
        }
      });
      
      const contentType = response.headers.get('content-type') || '';
      
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ 
          error: `External API Error: ${response.status}`,
          details: errorText.slice(0, 200)
        });
      }

      if (contentType.includes('application/json')) {
        const data = await response.json();
        res.json(data);
      } else {
        const text = await response.text();
        res.status(500).json({ 
          error: "API returned non-JSON content",
          contentType,
          preview: text.slice(0, 100)
        });
      }
    } catch (error: any) {
      res.status(500).json({ 
        error: "Network error in proxy server",
        message: error.message 
      });
    }
  });

  // Vite middleware for development
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dev server running on http://localhost:${PORT}`);
  });
}

startServer();
