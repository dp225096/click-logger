

const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyjLJSSvLVGGOxT_65hCQ36jTzjToMXRXpugnRB60w-Dvu7PMt2vSCqA5g9cDlt-s1h/exec';
const REDIRECT_URL = 'https://your-website.com';

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Log initial click and show form
app.get('/', async (req, res) => {
  const data = {
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    userAgent: req.headers['user-agent'],
    referrer: req.get('referer') || req.get('referrer') || 'none',
    query: req.url,
    name: '',
    phone: '',
    timestamp: new Date().toISOString()
  };

  try {
    await axios.post(SHEET_WEBHOOK_URL, data);
  } catch (err) {
    console.error('❌ Failed to log click:', err.message);
  }

  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Log name/phone and redirect
app.post('/submit', async (req, res) => {
  const data = {
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    userAgent: req.headers['user-agent'],
    referrer: req.get('referer') || req.get('referrer') || 'none',
    query: req.url,
    name: req.body.name,
    phone: req.body.phone,
    timestamp: new Date().toISOString()
  };

  try {
    await axios.post(SHEET_WEBHOOK_URL, data);
  } catch (err) {
    console.error('❌ Failed to log form data:', err.message);
  }

  res.redirect(REDIRECT_URL);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

