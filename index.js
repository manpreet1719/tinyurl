const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');


const app =  express();

const PORT = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


const urlStore = {};

function generateShortUrl(longUrl){
    const hash = crypto.createHash('md5').update(longUrl).digest('hex');
    return hash.slice(0, 7);
}

app.post('/shorten',(req,res)=>{
    const longUrl = req.body.longUrl;
    if (!longUrl) {
        return res.status(400).json({ error: 'Long URL is required' });
    }
    const shortUrl = generateShortUrl(longUrl);
    urlStore[shortUrl] = longUrl;
  
    const shortenedUrl = `http://localhost:${PORT}/${shortUrl}`;
    res.json({ shortenedUrl });

});


app.get('/:shortUrl', (req, res) => {
    const shortUrl = req.params.shortUrl;
    const longUrl = urlStore[shortUrl];
  
    if (!longUrl) {
      return res.status(404).json({ error: 'URL not found' });
    }
  
    res.redirect(301,longUrl);
  });
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });