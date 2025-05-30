const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/getFlightSuggestions', (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  let reply = "Uygun uçuşları araştırıyorum...";

  if (userMessage.includes('çin')) {
    reply = "Pekin'e gitmek istiyorsun, anladım. Ne zaman seyahat etmek istersin?";
  } else if (userMessage.includes('temmuz')) {
    reply = "Temmuz için baktım, işte bazı opsiyonlar:\n" +
            "- THY direkt: 17.200 TL\n" +
            "- Qatar aktarmalı (15 saat Doha): 12.000 TL\n" +
            "- Kuwait aktarmalı (15 saat): 9.800 TL\n" +
            "İstersen aktarma şehirlerinde gezilecek yerleri de gösterebilirim.";
  } else if (userMessage.includes('kuveyt')) {
    reply = "Kuveyt'te gezebileceğin yerler:\n- Grand Mosque\n- Kuwait Towers\n- Souk Al-Mubarakiya";
  }

  res.json({ reply });
});
const flightRouter = require('./getFlightSuggestions');
app.use('/api', flightRouter);

app.listen(PORT, () => {
  console.log(`API çalışıyor: http://localhost:${PORT}`);
});
