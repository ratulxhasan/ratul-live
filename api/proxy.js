const https = require('https');
const http = require('http');
const { URL } = require('url');

module.exports = (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("❌ Missing 'url' parameter");

  try {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      }
    };

    client.get(parsedUrl, options, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        req.query.url = response.headers.location;
        return module.exports(req, res);
      }

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', response.headers['content-type'] || 'text/plain');
      response.pipe(res);
    }).on('error', (err) => {
      res.status(500).send("❌ Proxy error: " + err.message);
    });
  } catch (err) {
    res.status(500).send("❌ Invalid URL: " + err.message);
  }
};
