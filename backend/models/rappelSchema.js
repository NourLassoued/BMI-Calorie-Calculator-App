const mongoose = require("mongoose");

const rappelSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  frequence: {
    type: String,
    enum: ["quotidien", "hebdomadaire", "mensuel", "personnalise"],
    default: "quotidien",
  },
  heureRappel: { type: String, default: "08:00" },
  actif: { type: Boolean, default: true },
  message: {
    type: String,
    default: "N'oubliez pas de vous peser aujourd'hui !",
  },
  joursSemaine: {
    type: [Number],
    default: [1, 2, 3, 4, 5, 6, 7], // 1=Lundi, 7=Dimanche
  },
  jourMois: Number, // Pour les rappels mensuels
  derniereExecution: Date,
  createdAt: { type: Date, default: Date.now },
});
const Rappel = mongoose.model("Rappel", rappelSchema);
module.exports = Rappel;
