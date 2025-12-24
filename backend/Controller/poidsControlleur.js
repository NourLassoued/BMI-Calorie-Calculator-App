const Poids = require("../models/poidsSchema");
const User = require("../models/userschema");
const bcrypt = require("bcrypt"); 
const mongoose = require("mongoose");

exports.addPoids = async (req, res) => {
  try {
    const { userId } = req.params;
    const { poidsActuel, note } = req.body;

    if (!poidsActuel) {
      return res.status(400).json({ message: "Le poids actuel est requis" });
    }

    const poids = await Poids.create({
      utilisateur: userId,
      poidsActuel,
      note,
    });

    res.status(201).json({
      message: "Poids ajouté avec succès",
      poids,
    });
  } catch (err) {
    console.error("Erreur ajout poids:", err);
    res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};


exports.getPoidsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const poidsList = await Poids.find({ utilisateur: userId }).sort({
      date: -1,
    });
    res.status(200).json(poidsList);
  } catch (err) {
    console.error("Erreur get poids by user:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      nom,
      prenom,
      email,
      motDePasse,
      dateNaissance,
      sexe,
      taille,
      telephone,
      role,
      estActif,
      image_user,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (nom) user.nom = nom;
    if (prenom) user.prenom = prenom;
    if (email) user.email = email;
    if (dateNaissance) user.dateNaissance = dateNaissance;
    if (sexe) user.sexe = sexe;
    if (taille) user.taille = taille;
    if (telephone) user.telephone = telephone;
    if (role) user.role = role;
    if (typeof estActif !== "undefined") user.estActif = estActif;
    if (image_user) user.image_user = image_user;

    // Mettre à jour le mot de passe si fourni
    if (motDePasse) {
      const salt = await bcrypt.genSalt(10);
      user.motDePasse = await bcrypt.hash(motDePasse, salt);
    }

    // Sauvegarder les modifications
    await user.save();

    res.status(200).json({ message: "Utilisateur mis à jour", user });
  } catch (error) {
    console.error("Erreur updateUser:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
exports.deletePoids = async (req, res) => {
  try {
    const { poidsId } = req.params;
    const deletedPoids = await Poids.findById(poidsId);
    if (!deletedPoids) {
      return res.status(404).json({ message: "Poids non trouvé" });
    }
    await Poids.findByIdAndDelete(poidsId);
    res
      .status(200)
      .json({ message: "Poids supprimé avec succès", deletedPoids });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};
