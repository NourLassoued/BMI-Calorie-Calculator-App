const mongoose = require('mongoose');
const ResultatIMC = require('../models/ResultatIMCSchema'); 

const deleteIMC = async (req, res) => {
  try {
    const { resultatId } = req.params;

    if (!resultatId) {
      return res.status(400).json({ success: false, message: "ID du résultat manquant" });
    }

    if (!mongoose.Types.ObjectId.isValid(resultatId)) {
      return res.status(400).json({ success: false, message: "ID du résultat invalide" });
    }

    const resultat = await ResultatIMC.findById(resultatId);

    if (!resultat) {
      return res.status(404).json({ success: false, message: "Résultat IMC non trouvé" });
    }

    await ResultatIMC.findByIdAndDelete(resultatId);

    return res.status(200).json({
      success: true,
      message: "Résultat IMC supprimé avec succès",
      idSupprime: resultatId
    });

  } catch (error) {
    console.error("Erreur dans deleteIMC:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la suppression du résultat IMC",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
const getDernierIMC = async (req, res) => {
  try {
    const { utilisateurId } = req.params;

    if (!utilisateurId) {
      return res.status(400).json({ success: false, message: "ID utilisateur manquant" });
    }

    if (!mongoose.Types.ObjectId.isValid(utilisateurId)) {
      return res.status(400).json({ success: false, message: "ID utilisateur invalide" });
    }

    const dernierIMC = await ResultatIMC.findOne({ utilisateur: utilisateurId })
      .sort({ dateCalcul: -1 }) 
      .lean();

    if (!dernierIMC) {
      return res.status(404).json({ success: false, message: "Aucun IMC trouvé pour cet utilisateur" });
    }

    return res.status(200).json({
      success: true,
      data: dernierIMC
    });

  } catch (error) {
    console.error("Erreur dans getDernierIMC:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération du dernier IMC",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { deleteIMC ,getDernierIMC};
