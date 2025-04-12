const express = require('express');
const router = express.Router();
const characterSheetController = require('../controllers/characterSheet.controller');
const protect = require('../middleware/protect');
const { upload, uploadToCloudinary } = require('../utils/imageUpload');

// Tutte le route sono protette e richiedono autenticazione
router.use(protect);

// Upload immagine del personaggio (accetta sia file che base64/url)
router.post('/:id/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file && !req.body.imageUrl) {
      return res.status(400).json({ message: 'Nessuna immagine fornita' });
    }

    console.log("Ricevuto imageUrl:", req.body.imageUrl);

    let imageResult;

    if (req.file) {
      // Se è un file caricato direttamente (es. upload utente)
      imageResult = await uploadToCloudinary(req.file);
    } else if (req.body.imageUrl) {
      // Se è un'immagine base64 (data:image/...) o un URL remoto
      if (req.body.imageUrl.startsWith('data:image')) {
        imageResult = await uploadToCloudinary({
          buffer: Buffer.from(req.body.imageUrl.split(',')[1], 'base64'),
          mimetype: 'image/png'
        });
      } else {
        imageResult = await uploadToCloudinary(req.body.imageUrl);
      }
    }

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

// CRUD schede personaggio
router.post('/', characterSheetController.createCharacterSheet);
router.get('/', characterSheetController.getCharacterSheets);
router.get('/:id', characterSheetController.getCharacterSheet);
router.put('/:id', characterSheetController.updateCharacterSheet);
router.delete('/:id', characterSheetController.deleteCharacterSheet);

module.exports = router;
