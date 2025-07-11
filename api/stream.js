// api/stream.js
export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    res.status(400).send("Missing 'url' query.");
    return;
  }

  try {
    const proxyReq = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': url
      }
    });

    if (!proxyReq.ok) throw new Error("Stream fetch failed");

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', proxyReq.headers.get("content-type"));
    proxyReq.body.pipe(res);
  } catch (err) {
    res.status(500).send('Proxy Error: ' + err.message);
  }
}
