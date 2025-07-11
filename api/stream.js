import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    res.status(400).send("Missing 'url' query.");
    return;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': url
      }
    });

    if (!response.ok) {
      return res.status(response.status).send('Failed to fetch stream');
    }

    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');

    response.body.pipe(res);
  } catch (error) {
    res.status(500).send('Proxy error: ' + error.message);
  }
}
