const express = require('express');
const router = express.Router();
const characterSheetController = require('../controllers/characterSheet.controller');
const protect = require('../middleware/protect');
const { upload, uploadToCloudinary } = require('../utils/imageUpload');
const isAuthenticated = require('../middleware/auth');

// Tutte le route sono protette e richiedono autenticazione
router.use(protect);

// Upload immagine del personaggio
router.post('/:id/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file && !req.body.imageUrl) {
      return res.status(400).json({ message: 'Nessuna immagine fornita' });
    }

    console.log("Ricevuto imageUrl:", req.body.imageUrl);
    
    let imageResult;
    
    if (req.file) {
      // Se è un file caricato direttamente
      imageResult = await uploadToCloudinary(req.file);
    } else if (req.body.imageUrl) {
      // Se è un URL con data:image/png;base64,...
      if (req.body.imageUrl.startsWith('data:image')) {
        imageResult = await uploadToCloudinary({
          buffer: Buffer.from(req.body.imageUrl.split(',')[1], 'base64'),
          mimetype: 'image/png'
        });
      } else {
        // Se è un URL remoto (es. OpenAI)
        imageResult = await uploadToCloudinary(req.body.imageUrl);
      }
    }

    // Aggiorna il character sheet con l'URL dell'immagine
    const updatedSheet = await characterSheetController.updateCharacterImage(
      req.params.id,
      imageResult.url,
      imageResult.publicId
    );

    res.json({
      success: true,
      characterSheet: updatedSheet,
      image: {
        url: imageResult.url,
        publicId: imageResult.publicId
      }
    });
  } catch (error) {
    console.error('Errore upload immagine personaggio:', error);
    res.status(500).json({
      message: 'Errore durante il caricamento dell\'immagine',
      error: error.message
    });
  }
});

// Crea una nuova scheda personaggio
router.post('/', characterSheetController.createCharacterSheet);

// Ottieni tutte le schede personaggio dell'utente
router.get('/', characterSheetController.getCharacterSheets);

// Ottieni una scheda personaggio specifica
router.get('/:id', characterSheetController.getCharacterSheet);

// Aggiorna una scheda personaggio
router.put('/:id', characterSheetController.updateCharacterSheet);

// Elimina una scheda personaggio
router.delete('/:id', characterSheetController.deleteCharacterSheet);

module.exports = router; 