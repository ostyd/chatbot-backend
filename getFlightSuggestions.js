const fetch = require('node-fetch');
const getAccessToken = require('./getAccessToken');

async function getFlightSuggestions(req, res) {
  const userInput = req.body.message;

  // Örnek: "IST PEK" şeklinde iki IATA kodu bekliyoruz
  const [origin, destination] = userInput.trim().split(' ');

  if (!origin || !destination) {
    return res.json({ reply: 'Lütfen iki şehir kodu gir (örn: IST PEK)' });
  }

  try {
    const token = await getAccessToken();

    const response = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=2024-07-01&adults=1&nonStop=false&max=3`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return res.json({ reply: 'Uçuş bulunamadı. Farklı kodlar dene.' });
    }

    const replyLines = data.data.map((offer, index) => {
      const price = offer.price.total;
      const airline = offer.validatingAirlineCodes[0];
      const departure = offer.itineraries[0].segments[0].departure.iataCode;
      const arrival = offer.itineraries[0].segments.slice(-1)[0].arrival.iataCode;
      const stops = offer.itineraries[0].segments.length - 1;

      return `✈️ Seçenek ${index + 1}: ${departure} ➡ ${arrival}, ${stops > 0 ? `${stops} aktarma` : 'direkt'}, ${airline} ile → ${price} EUR`;
    });

    res.json({ reply: replyLines.join('\n\n') });

  } catch (error) {
    console.error('Uçuş hatası:', error);
    res.status(500).json({ reply: 'Uçuşlar alınırken bir hata oluştu. Lütfen tekrar dene.' });
  }
}

module.exports = getFlightSuggestions;
