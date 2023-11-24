export const config = {
  'runtime': 'edge'
};

export default async function handler(req) {
   const urlQueryParam = req.url.includes('?') ? new URL(req.url).searchParams.get('url') : null;

  if (!urlQueryParam) {
    return Response.json({ status: 'error', message: 'Missing "url" query parameter', location: req.headers.get('x-vercel-ip-city') || 'world' });
  }

  const url = decodeURIComponent(urlQueryParam);

  try {
    const response = await fetch(url);

    if (response.ok) {
      // URL is valid
      return Response.json({ status: 'valid', location: req.headers.get('x-vercel-ip-city') || 'world' });
    } else if (response.status === 404) {
      // URL is broken (returns a 404 status)
      return Response.json({ status: 'broken', location: req.headers.get('x-vercel-ip-city') || 'world' });
    } else if (response.redirected) {
      // URL is redirected
      return Response.json({ status: 'redirected', location: req.headers.get('x-vercel-ip-city') || 'world' });
    } else {
      // Other error
      return Response.json({ status: 'error', location: req.headers.get('x-vercel-ip-city') || 'world' });
    }
  } catch (error) {
    // Fetch error
    return Response.json({ status: 'error', location: req.headers.get('x-vercel-ip-city') || 'world', error: error.message });
  }
}
