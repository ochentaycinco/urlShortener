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

urlCounter = 1
urlDatabase = []

app.post('/api/shorturl', (req, res) => {
  
  const url = req.body.url;
  const hostname = new URL(url).hostname
  dns.lookup(hostname, (err, address) => {
      if (err) {
        return res.json({ error: 'invalid url' });
      }
      const shortUrl = urlCounter++;
      urlDatabase.push({ original_url: url, short_url: shortUrl });

      res.json({ original_url: url, short_url: shortUrl });
    });
})
app.get('/api/shorturl/:short_url', (req,res)=>{
  const shortUrl = parseInt(req.params.short_url)
  const entry = urlDatabase.find(item => item.short_url == shortUrl)
  if (entry){
    res.redirect(entry.original_url)
  }else{
    res.json({error:"Url not found"})
  }
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
