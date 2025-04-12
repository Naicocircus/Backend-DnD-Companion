const CharacterSheet = require('../models/CharacterSheet');
const { uploadToCloudinary } = require('../utils/imageUpload');

// Crea una nuova scheda personaggio
const createCharacterSheet = async (req, res) => {
  try {
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
const getCharacterSheets = async (req, res) => {
  try {
    const sheets = await CharacterSheet.find({ user: req.user._id });
    res.json(sheets);
  } catch (error) {
    console.error('Error fetching character sheets:', error);
    res.status(500).json({ message: 'Error fetching character sheets' });
  }
};

// Ottieni una scheda personaggio specifica
const getCharacterSheet = async (req, res) => {
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
const updateCharacterSheet = async (req, res) => {
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
const deleteCharacterSheet = async (req, res) => {
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

// Aggiorna immagine (chiamata interna opzionale)
const updateCharacterImage = async (characterId, imageUrl, publicId) => {
  try {
    const characterSheet = await CharacterSheet.findByIdAndUpdate(
      characterId,
      {
        characterImage: {
          url: imageUrl,
          publicId: publicId
        }
      },
      { new: true }
    );
    if (!characterSheet) {
      throw new Error('Character sheet not found');
    }
    return characterSheet;
  } catch (error) {
    throw new Error(`Error updating character image: ${error.message}`);
  }
};

// Upload immagine personaggio (via file upload)
const uploadCharacterImage = async (req, res) => {
  try {
    const characterId = req.params.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Nessun file immagine ricevuto' });
    }

    const imageResult = await uploadToCloudinary(file);

    const updatedSheet = await CharacterSheet.findByIdAndUpdate(
      characterId,
      {
        characterImage: {
          url: imageResult.url,
          publicId: imageResult.publicId
        }
      },
      { new: true }
    );

    if (!updatedSheet) {
      return res.status(404).json({ error: 'Scheda personaggio non trovata' });
    }

    res.status(200).json({
      success: true,
      characterSheet: updatedSheet,
      image: imageResult
    });
  } catch (error) {
    console.error('❌ Errore uploadCharacterImage:', error);
    res.status(500).json({ error: 'Errore durante il salvataggio dell\'immagine' });
  }
};

module.exports = {
  createCharacterSheet,
  getCharacterSheets,
  getCharacterSheet,
  updateCharacterSheet,
  deleteCharacterSheet,
  updateCharacterImage,
  uploadCharacterImage
};








/*const CharacterSheet = require('../models/CharacterSheet');

// Crea una nuova scheda personaggio
const createCharacterSheet = async (req, res) => {
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
const getCharacterSheets = async (req, res) => {
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
const getCharacterSheet = async (req, res) => {
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
const updateCharacterSheet = async (req, res) => {
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
const deleteCharacterSheet = async (req, res) => {
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

// Aggiorna l'immagine del personaggio
const updateCharacterImage = async (characterId, imageUrl, publicId) => {
  try {
    const characterSheet = await CharacterSheet.findByIdAndUpdate(
      characterId,
      {
        characterImage: {
          url: imageUrl,
          publicId: publicId
        }
      },
      { new: true }
    );

    if (!characterSheet) {
      throw new Error('Character sheet not found');
    }

    return characterSheet;
  } catch (error) {
    throw new Error(`Error updating character image: ${error.message}`);
  }
};

module.exports = {
  createCharacterSheet,
  getCharacterSheets,
  getCharacterSheet,
  updateCharacterSheet,
  deleteCharacterSheet,
  updateCharacterImage
}; */