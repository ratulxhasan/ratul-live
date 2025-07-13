const https = require('https');
const http = require('http');
const { URL } = require('url');

module.exports = (req, res) => {
  const { url } = req.query;

  if (!url) {
    res.status(400).send("Missing 'url' parameter");
    return;
  }

  const parsedUrl = new URL(url);
  const client = parsedUrl.protocol === 'https:' ? https : http;

  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Referer': url
    }
  };

  client.get(url, options, (proxyRes) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'application/octet-stream');

    proxyRes.pipe(res);
  }).on('error', (err) => {
    console.error('Proxy Error:', err.message);
    res.status(500).send('Proxy error: ' + err.message);
  });
};
