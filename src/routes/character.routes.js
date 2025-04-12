const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Placeholder per i controller dei personaggi
// TODO: Implementare i controller effettivi
const characterController = {
  getAllCharacters: (req, res) => {
    res.json({ message: "Get all characters" });
  },
  getCharacterById: (req, res) => {
    res.json({ message: "Get character by id" });
  },
  createCharacter: (req, res) => {
    res.json({ message: "Create character" });
  },
  updateCharacter: (req, res) => {
    res.json({ message: "Update character" });
  },
  deleteCharacter: (req, res) => {
    res.json({ message: "Delete character" });
  }
};

// Rotte dei personaggi
router.get('/', auth, characterController.getAllCharacters);
router.get('/:id', auth, characterController.getCharacterById);
router.post('/', auth, characterController.createCharacter);
router.put('/:id', auth, characterController.updateCharacter);
router.delete('/:id', auth, characterController.deleteCharacter);



module.exports = router; 