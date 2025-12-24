const User = require("../models/userschema");
const Mesure = require("../models/Mesure");

// Ajouter une mesure US Navy
exports.addMesure = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Validation des données requises
    const { cou, taille, hauteur, hanches, dateMesure } = req.body;

    if (!cou || !taille || !hauteur) {
      return res.status(400).json({
        message: "Mesures incomplètes : cou, taille et hauteur sont requis",
      });
    }

    // Pour les femmes, vérifier les hanches
    if (user.sexe === "femme" && (!hanches || hanches === 0)) {
      return res.status(400).json({
        message: "Tour de hanches requis pour les femmes",
      });
    }

    // CALCUL DU POURCENTAGE ICI
    const pourcentageMasseGrasse = Mesure.calculerGrasseUSNavy(
      Number(cou),
      Number(taille),
      Number(hanches) || 0,
      Number(hauteur),
      user.sexe
    );

    // Créer la nouvelle mesure avec le pourcentage déjà calculé
    const nouvelleMesure = new Mesure({
      utilisateur: user._id,
      cou: Number(cou),
      taille: Number(taille),
      hanches: Number(hanches) || 0,
      hauteur: Number(hauteur),
      sexe: user.sexe,
      pourcentageMasseGrasse,
      dateMesure: req.body.dateMesure
        ? new Date(req.body.dateMesure)
        : Date.now(),
    });

    await nouvelleMesure.save();

    res.status(201).json(nouvelleMesure);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getDerniereMesure = async (req, res) => {
  try {
    const userId = req.params.userId;

    const derniereMesure = await Mesure.findOne({ utilisateur: userId }).sort({
      dateMesure: -1,
      _id: -1,
    });

    if (!derniereMesure) {
      return res.status(404).json({ message: "Aucune mesure trouvée" });
    }

    res.status(200).json({
      plis: derniereMesure.plis,
      densite: derniereMesure.densite,
      pourcentageMasseGrasse: derniereMesure.pourcentageMasseGrasse,
      dateMesure: derniereMesure.dateMesure,
    });
  } catch (err) {
    console.error("ERREUR getDerniereMesure :", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllMesures = async (req, res) => {
  try {
    const userId = req.params.userId;
    const mesures = await Mesure.find({ utilisateur: userId }).sort({
      dateMesure: -1,
    });

    res.status(200).json(mesures);
  } catch (err) {
    console.error(" ERREUR getAllMesures :", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMesure = async (req, res) => {
  try {
    const mesureId = req.params.mesureId;
    const mesure = await Mesure.findById(mesureId);

    if (!mesure) {
      return res.status(404).json({ message: "Mesure non trouvée" });
    }

    await Mesure.findByIdAndDelete(mesureId);
    res.status(200).json({ message: "Mesure supprimée avec succès" });
  } catch (err) {
    console.error("ERREUR deleteMesure :", err);
    res.status(500).json({ message: err.message });
  }
};

