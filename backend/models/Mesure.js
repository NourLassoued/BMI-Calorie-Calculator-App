const mongoose = require("mongoose");

const mesureschema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //  Méthode US Navy - Mesures en cm
    cou: { type: Number, required: true },
    taille: { type: Number, required: true },
    hanches: { type: Number, default: 0 },
    hauteur: { type: Number, required: true },

    sexe: { type: String, enum: ["homme", "femme"], required: true },

    dateMesure: { type: Date, default: Date.now },
    pourcentageMasseGrasse: { type: Number },
  },
  { timestamps: true }
);

// Fonction de calcul (statique)
mesureschema.statics.calculerGrasseUSNavy = function (
  cou,
  taille,
  hanches,
  hauteur,
  sexe
) {
  const log10 = (x) => Math.log(x) / Math.log(10);
  let pourcentage;

  if (sexe === "homme") {
    pourcentage =
      495 /
        (1.0324 - 0.19077 * log10(taille - cou) + 0.15456 * log10(hauteur)) -
      450;
  } else if (sexe === "femme") {
    if (!hanches || hanches === 0) {
      throw new Error("Tour de hanches requis pour les femmes");
    }
    pourcentage =
      495 /
        (1.29579 -
          0.35004 * log10(taille + hanches - cou) +
          0.221 * log10(hauteur)) -
      450;
  }

  return Math.round(pourcentage * 10) / 10;
};

const Mesure = mongoose.model("Mesure", mesureschema);
module.exports = Mesure;
