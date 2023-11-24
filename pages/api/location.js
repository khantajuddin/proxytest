import axios from 'axios';

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
    const response = await axios.get(url);

    return new Response(JSON.stringify({ status: response.status }), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': '*',
      },
    });
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
