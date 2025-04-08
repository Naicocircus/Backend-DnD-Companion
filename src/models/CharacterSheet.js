const mongoose = require('mongoose');

const characterSheetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  basic: {
    name: String,
    class: String,
    level: String,
    background: String,
    playerName: String,
    race: String,
    alignment: String,
    experiencePoints: String
  },
  abilityScores: {
    strength: String,
    dexterity: String,
    constitution: String,
    intelligence: String,
    wisdom: String,
    charisma: String
  },
  savingThrows: {
    proficiencies: {
      strength: Boolean,
      dexterity: Boolean,
      constitution: Boolean,
      intelligence: Boolean,
      wisdom: Boolean,
      charisma: Boolean
    }
  },
  combat: {
    armorClass: String,
    initiative: String,
    speed: String,
    maxHp: String,
    currentHp: String,
    temporaryHp: String,
    hitDice: String,
    deathSaves: {
      successes: Number,
      failures: Number
    }
  },
  skills: {
    acrobatics: { proficient: Boolean, value: Number },
    animalHandling: { proficient: Boolean, value: Number },
    arcana: { proficient: Boolean, value: Number },
    athletics: { proficient: Boolean, value: Number },
    deception: { proficient: Boolean, value: Number },
    history: { proficient: Boolean, value: Number },
    insight: { proficient: Boolean, value: Number },
    intimidation: { proficient: Boolean, value: Number },
    investigation: { proficient: Boolean, value: Number },
    medicine: { proficient: Boolean, value: Number },
    nature: { proficient: Boolean, value: Number },
    perception: { proficient: Boolean, value: Number },
    performance: { proficient: Boolean, value: Number },
    persuasion: { proficient: Boolean, value: Number },
    religion: { proficient: Boolean, value: Number },
    sleightOfHand: { proficient: Boolean, value: Number },
    stealth: { proficient: Boolean, value: Number },
    survival: { proficient: Boolean, value: Number }
  },
  personality: {
    personalityTraits: String,
    ideals: String,
    bonds: String,
    flaws: String
  },
  attacks: [{
    name: String,
    bonus: String,
    damage: String
  }],
  equipment: [String],
  features: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  characterImage: {
    url: String,
    publicId: String
  },
});

// Aggiorna updatedAt prima di ogni salvataggio
characterSheetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CharacterSheet', characterSheetSchema); 