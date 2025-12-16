const mongoose = require("mongoose");

const statistiqueSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  poidsMoyen: { type: Number, default: 0 },
  poidsMin: { type: Number, default: 0 },
  poidsMax: { type: Number, default: 0 },
  imc: { type: Number, default: 0 },
  categorieIMC: { type: String },
  periode: {
    type: String,
    enum: ["semaine", "mois", "trimestre", "annee"],
    default: "mois",
  },
  dateDebut: Date,
  dateFin: Date,
  nombreMesures: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
const Statistique = mongoose.model("Statistique", statistiqueSchema);
module.exports = Statistique;
