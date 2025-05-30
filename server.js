const express = require('express');
const app = express();
const cors = require('cors');
const flightRouter = require('./getFlightSuggestions');

// Ortam değişkenlerini okuyalım
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Uçuş API router'ını bağla
app.use('/api', flightRouter);

// Test endpoint (isteğe bağlı)
app.get('/', (req, res) => {
  res.send('Backend çalışıyor! 🚀');
});

// Server başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor 🚀`);
});
const getAccessToken = require('./getAccessToken');
