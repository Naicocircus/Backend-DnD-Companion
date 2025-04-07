const express = require('express');
const router = express.Router();
const characterSheetController = require('../controllers/characterSheet.controller');
const protect = require('../middleware/protect');

// Tutte le route sono protette e richiedono autenticazione
router.use(protect);

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