const mongoose = require("mongoose");

const progressionSchema = new mongoose.Schema({
  utilisateur: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  objectif: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Objectif', 
    required: true 
  },
  poidsPerdu: { type: Number, default: 0 },
  poidsGagne: { type: Number, default: 0 },
  pourcentageProgression: { type: Number, default: 0 },
  dateMiseAJour: { type: Date, default: Date.now },
  historique: [{
    date: { type: Date, default: Date.now },
    poids: Number,
    pourcentage: Number
  }]
});
const Progression = mongoose.model("Progression", progressionSchema);
module.exports = Progression;