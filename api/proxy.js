const https = require('https');
const http = require('http');
const { URL } = require('url');

module.exports = (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("❌ Missing 'url' parameter");

  try {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    client.get(parsedUrl, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return module.exports({ query: { url: response.headers.location } }, res);
      }

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', response.headers['content-type'] || 'text/plain');
      response.pipe(res);
    }).on('error', (err) => {
      res.status(500).send("Proxy error: " + err.message);
    });
  } catch {
    res.status(500).send("Invalid URL");
  }
};
