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
    const response = await fetch(url, { redirect: 'manual' });

    if (response.status >= 300 && response.status < 400 && response.headers.has('Location')) {
      // Handle redirect and return the target URL
      const targetUrl = response.headers.get('Location');
      return new Response(JSON.stringify({ status: response.status, redirected: true, targetUrl }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Expose-Headers': '*',
        },
      });
    } else {
      // No redirect, return the original response
      return new Response(JSON.stringify({ status: response.status, redirected: false }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Expose-Headers': '*',
        },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ status: 'error', message: error.message }), {
      status: 500, // or choose an appropriate status code
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': '*',
      },
    });
  }
}
