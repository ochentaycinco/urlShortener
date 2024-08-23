require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const { url } = require('inspector');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({extended: false}))


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


function extractDomain(url) {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname
  } catch (error) {
    return null
  }
}

app.post('/api/shorturl', (req, res) => {
  
  const url = req.body.url;
  const domain = extractDomain(url)

  dns.lookup(domain, (err, addresses) =>{ 
    if (err || domain === null) {
      return res.json ({error: "invalid url"})
    }else{
      const short_url = Object.keys(addresses).length + 1
      addresses[short_url] = url
      res.json({
        original_url: `${url}`,
        short_url: short_url
      })
    }
  })
  
})

app.get("/api/shorturl/:url", (req, res) => {
  const { url } = req.params;
  res.redirect(addresses[url]);
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
