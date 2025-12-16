const express = require("express");
const router = express.Router();
const Objectif = require("../models/ObjectifSchema.js");

exports.addObjectif = async (req, res) => {
  try {
    const {
      utilisateur,
      poidsDepart,
      poidsCible,
      typeObjectif,
      rythemeKgparSemaine,
    } = req.body;

    console.log("Body reçu :", req.body);

    if (
      !utilisateur ||
      !poidsDepart ||
      !poidsCible ||
      !typeObjectif ||
      !rythemeKgparSemaine
    ) {
      console.log("Champs manquants !");
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires" });
    }

    const differencePoids = Math.abs(poidsCible - poidsDepart);
    const nbSemaines = differencePoids / rythemeKgparSemaine;

    const dateDebut = new Date();
    const dateFinCible = new Date(
      dateDebut.getTime() + nbSemaines * 7 * 24 * 60 * 60 * 1000
    );

    console.log("Date cible calculée :", dateFinCible);

    const newObjectif = new Objectif({
      utilisateur,
      poidsDepart,
      poidsCible,
      rythemeKgparSemaine,
      dateDebut,
      dateFinCible,
      typeObjectif,
    });

    const savedObjectif = await newObjectif.save();
    console.log("Objectif sauvegardé :", savedObjectif);

    res.status(201).json(savedObjectif);
  } catch (err) {
    console.error("Erreur ajout objectif:", err);
    res.status(500).json({ message: "Erreur serveur", erreur: err.message });
  }
};

// Récupérer un objectif par ID
exports.getObjectifById = async (req, res) => {
  try {
    const objectif = await Objectif.find({
      utilisateur: req.params.utilisateurId,
    }).sort({ createdAt: -1 });
    if (!objectif || objectif.length === 0) {
      return res.status(404).json({ message: "Objectif non trouvé" });
    }
    res.status(200).json(objectif);
  } catch (err) {
    console.error("Erreur récupération objectif :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
exports.deleteObjectif = async (req, res) => {
  try {
    const deleteObjectif = await Objectif.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deleteObjectif) {
      return res.status(404).json({ message: "objectif non trouve " });
    }
    res.status(200).json({ message: "objectif supprimee avec succes" });
  } catch (err) {
    console.error("Erreur suppression objectif:", err);
    res.status(500).json({
      message: "Erreur serveur lors de la suppression de l'objectif",
      erreur: err.message,
    });
  }
};
exports.updateSatutObjectif = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;
    if (! ['actif', 'atteint', 'abandonne', 'expire'].includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" });
    }
    const updateSatutObjectif = await Objectif.findByIdAndUpdate(
      id,
      { statut: statut },
      { new: true }
    );
    if (!updateSatutObjectif) {
      return res.status(404).json({ message: "Objectif non trouve" });
    }
    res.json(updateSatutObjectif);
  } catch (err) {
    console.error("Erreur mise a jour statut objectif:", err);
    res.status(500).json({
      message: "Erreur serveur lors de la mise a jour du statut de l'objectif",
      erreur: err.message,
    });
  }
};
