const CharacterSheet = require('../models/CharacterSheet');

// Crea una nuova scheda personaggio
exports.createCharacterSheet = async (req, res) => {
  try {
    // Aggiungi l'ID dell'utente dalla richiesta autenticata
    const characterData = {
      ...req.body,
      user: req.user._id
    };

    const newSheet = new CharacterSheet(characterData);
    await newSheet.save();

    res.status(201).json(newSheet);
  } catch (error) {
    console.error('Error creating character sheet:', error);
    res.status(500).json({ message: 'Error creating character sheet' });
  }
};

// Ottieni tutte le schede personaggio dell'utente
exports.getCharacterSheets = async (req, res) => {
  try {
    // Filtra per l'ID dell'utente dalla richiesta autenticata
    const sheets = await CharacterSheet.find({ user: req.user._id });
    res.json(sheets);
  } catch (error) {
    console.error('Error fetching character sheets:', error);
    res.status(500).json({ message: 'Error fetching character sheets' });
  }
};

// Ottieni una scheda personaggio specifica
exports.getCharacterSheet = async (req, res) => {
  try {
    const sheet = await CharacterSheet.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!sheet) {
      return res.status(404).json({ message: 'Character sheet not found' });
    }

    res.json(sheet);
  } catch (error) {
    console.error('Error fetching character sheet:', error);
    res.status(500).json({ message: 'Error fetching character sheet' });
  }
};

// Aggiorna una scheda personaggio
exports.updateCharacterSheet = async (req, res) => {
  try {
    const sheet = await CharacterSheet.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      req.body,
      { new: true }
    );

    if (!sheet) {
      return res.status(404).json({ message: 'Character sheet not found' });
    }

    res.json(sheet);
  } catch (error) {
    console.error('Error updating character sheet:', error);
    res.status(500).json({ message: 'Error updating character sheet' });
  }
};

// Elimina una scheda personaggio
exports.deleteCharacterSheet = async (req, res) => {
  try {
    const sheet = await CharacterSheet.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!sheet) {
      return res.status(404).json({ message: 'Character sheet not found' });
    }

    res.json({ message: 'Character sheet deleted successfully' });
  } catch (error) {
    console.error('Error deleting character sheet:', error);
    res.status(500).json({ message: 'Error deleting character sheet' });
  }
}; 