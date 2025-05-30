const express = require('express');
const router = express.Router();
const getAccessToken = require('./getAccessToken');
const fetch = require('node-fetch');

router.post('/getFlightSuggestions', async (req, res) => {
  try {
    const { message } = req.body;

    // Örnek sabit veriler (geliştirilecek)
    const origin = 'IST';
    const destination = 'PEK';
    const departureDate = '2025-07-01';

    const token = await getAccessToken();

    const response = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=1&currencyCode=TRY&max=3`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const flight = data.data[0];
      const price = flight.price.total;
      const airline = flight.validatingAirlineCodes[0];
      res.json({ reply: `En uygun uçuş: ${airline} → ${origin} - ${destination}, Fiyat: ${price} TL` });
    } else {
      res.json({ reply: 'Uygun uçuş bulunamadı.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: 'Uçuşları çekerken hata oluştu.' });
  }
});

module.exports = router;
