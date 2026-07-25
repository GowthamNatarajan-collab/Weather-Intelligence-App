/// <reference types="@cloudflare/workers-types" />

export interface Env {
  ASSETS: { fetch: typeof fetch };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Handle Weather Proxy API
    if (url.pathname === "/api/weather-proxy") {
      const targetUrl = url.searchParams.get("url");

      if (!targetUrl) {
        return new Response(JSON.stringify({ error: "No URL provided" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      try {
        const response = await fetch(targetUrl, {
          headers: {
            "User-Agent": "Cloudflare-Worker-Weather-Intelligence",
          },
        });

        const contentType = response.headers.get("content-type") || "";

        if (!response.ok) {
          const errorText = await response.text();
          return new Response(
            JSON.stringify({
              error: `External API Error: ${response.status}`,
              details: errorText.slice(0, 200),
            }),
            {
              status: response.status,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        if (contentType.includes("application/json")) {
          const data = await response.json();
          return new Response(JSON.stringify(data), {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
        } else {
          const text = await response.text();
          return new Response(
            JSON.stringify({
              error: "API returned non-JSON content",
              contentType,
              preview: text.slice(0, 100),
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      } catch (error: any) {
        return new Response(
          JSON.stringify({
            error: "Network error in worker",
            message: error.message,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Default: Serve static assets (React app)
    return env.ASSETS.fetch(request);
  },
};
