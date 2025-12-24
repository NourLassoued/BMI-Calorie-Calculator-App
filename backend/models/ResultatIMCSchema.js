const mongoose = require('mongoose');

const ResultatIMCSchema = new mongoose.Schema({
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  poids: Number,
  taille: Number,
  age: Number,
  sexe: String,
  niveauActivite: String,
  imc: {
    valeur: Number,
    classification: String,
    risque: String
  },
  calories: {
    bmr: Number,
    maintenance: Number,
    objectif: Number,
    typeObjectif: String
  },
  poidsIdeal: Number,
  poidsCible: Number,
  differencePoids: Number,
  actionPoids: String,
  dateCalcul: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ResultatIMC', ResultatIMCSchema);
