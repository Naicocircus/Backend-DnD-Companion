const axios = require('axios');

exports.generateImage = async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      process.env.OPENAI_API_URL,
      {
        prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'url',
        model: 'dall-e-3',
        quality: 'hd',
        style: 'vivid'
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const imageUrl = response.data.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Errore generazione immagine:', error.response?.data || error.message);
    res.status(500).json({ message: 'Errore durante la generazione dell\'immagine' });
  }
};