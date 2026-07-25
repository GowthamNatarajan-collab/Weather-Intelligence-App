export const onRequestGet: PagesFunction = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new Response(JSON.stringify({ error: "No URL provided" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const text = await response.text();
      // Handle cases where API might return HTML error pages
      if (text.startsWith("<!doctype") || text.startsWith("<html")) {
        return new Response(JSON.stringify({ 
          error: `API returned HTML error: ${response.status}`,
          isHtml: true 
        }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ error: `API Error: ${response.status}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Network error fetching weather data" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
