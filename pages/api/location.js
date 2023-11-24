export const config = {
  'runtime': 'edge'
};

export default async function handler(req) {
  const urlQueryParam = req.url.includes('?') ? new URL(req.url).searchParams.get('url') : null;

  if (!urlQueryParam) {
    return new Response(JSON.stringify({ status: 'error', message: 'Missing "url" query parameter', location: req.headers.get('x-vercel-ip-city') || 'world' }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const url = decodeURIComponent(urlQueryParam);

  try {
    const response = await fetch(url);
    
    if (response.ok) {
      // URL is valid
      return new Response(JSON.stringify({ status: 'valid', location: req.headers.get('x-vercel-ip-city') || 'world' }), {
        status:  200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } else if (response.status === 404) {
      // URL is broken (returns a 404 status)
      return new Response(JSON.stringify({ status: 'broken', location: req.headers.get('x-vercel-ip-city') || 'world' }), {
        status:  404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } else if (response.redirected) {
      // URL is redirected
      return new Response(JSON.stringify({ status: 'redirected', location: req.headers.get('x-vercel-ip-city') || 'world' }), {
        status:  307,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } else {
      // Other error
      return new Response(JSON.stringify({ status: 'error', location: req.headers.get('x-vercel-ip-city') || 'world' }), {
        status:  404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  } catch (error) {
    // Fetch error
    return new Response(JSON.stringify({ status: 'error', location: req.headers.get('x-vercel-ip-city') || 'world', error: error.message }), {
      status:  400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
