const mongoose = require("mongoose");
const objectifSchema = new mongoose.Schema({
  utilisateur: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  poidsDepart: { type: Number, required: true },
  poidsCible: { type: Number, required: true },
  rythemeKgparSemaine:{type:Number,enum:[0.5,0.8,1], required:true},
  dateDebut: { type: Date, default: Date.now },
  dateFinCible: { type: Date, required: true },
  typeObjectif: { 
    type: String, 
    enum: ['perte', 'gain', 'maintien'], 
    required: true 
  },
  statut: { 
    type: String, 
    enum: ['actif', 'atteint', 'abandonne', 'expire'], 
    default: 'actif' 
  },
  createdAt: { type: Date, default: Date.now }
});
const Objectif = mongoose.model("Objectif", objectifSchema);
module.exports = Objectif;