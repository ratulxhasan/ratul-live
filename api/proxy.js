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
        'Referer': url,
      },
    };

    client.get(url, options, (response) => {
      const { statusCode, headers } = response;

      // Redirect হলে ফলো করো
      if (statusCode >= 300 && statusCode < 400 && headers.location) {
        return module.exports({ query: { url: headers.location } }, res);
      }

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', headers['content-type'] || 'text/plain');

      response.pipe(res);
    }).on('error', (e) => {
      res.status(500).send('Proxy error: ' + e.message);
    });
  } catch (err) {
    res.status(500).send('❌ Invalid URL or server error');
  }
};
