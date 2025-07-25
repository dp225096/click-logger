
const express = require('express');
const axios = require('axios');
const app = express();

const SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwlasnZWH9RAV6h4D4ZTfMhK-MmH1q9cpcWQsC_ZKQRr6U72v60Px7texmVtnHrKYoi/exec';
const REDIRECT_URL = 'https://www.webpagetest.org/blank.html';

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
    console.error('❌ Failed to log to Google Sheets:', err.message);
  }

  res.redirect(REDIRECT_URL);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
