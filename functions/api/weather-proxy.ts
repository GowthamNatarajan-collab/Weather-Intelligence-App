/// <reference types="@cloudflare/workers-types" />

interface Env {}

export const onRequestGet: any = async (context: { request: Request; env: Env }) => {
  const { searchParams } = new URL(context.request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new Response(JSON.stringify({ error: "No URL provided" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Cloudflare-Worker-Weather-Proxy'
      }
    });
    
    const contentType = response.headers.get('content-type') || '';
    
    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ 
        error: `External API Error: ${response.status}`,
        details: errorText.slice(0, 200)
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Ensure we are returning JSON
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } else {
      const text = await response.text();
      return new Response(JSON.stringify({ 
        error: "API returned non-JSON content",
        contentType,
        preview: text.slice(0, 100)
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: "Network error in proxy function",
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
