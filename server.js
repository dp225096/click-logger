const express = require('express');
const axios = require('axios');
const app = express();

const SHEET_WEBHOOK_URL = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

app.get('/', async (req, res) => {
  const data = {
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    userAgent: req.headers['user-agent'],
    referrer: req.get('referer') || req.get('referrer') || 'none',
    query: req.url
  };

  try {
    await axios.post(SHEET_WEBHOOK_URL, data);
  } catch (err) {
    console.error('❌ Failed to log to Google Sheets:', err.message);
  }

  // Redirect to your real destination
  res.redirect('https://your-website.com');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
