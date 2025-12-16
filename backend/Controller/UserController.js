const User  = require("../models/userschema.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");   
const path = require('path');
const fs = require('fs');
 const Poids = require("../models/poidsSchema"); 
const Objectif = require("../models/ObjectifSchema");


module.exports = {

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving users", error });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.status(200).json({ message: "Utilisateur supprimé avec succès", deletedUser });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression", error });
    }
  },

  addUser: async (req, res) => {
    try {
      const { email, motDePasse, role, image_user } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email déjà utilisé" });
      }

      const newUser = new User({ email, motDePasse, role, image_user });
      await newUser.save();

      res.status(201).json({ message: "Utilisateur ajouté avec succès", user: newUser });
    } catch (error) {
      console.error("❌ Error in addUser:", error);
      res.status(500).json({ message: "Erreur lors de l'ajout", error: error.message });
    }
  },
  updateUser: async (req, res) => {
  try {
    const userId = req.params.id.trim();
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const user = await User.findById(userId);
    if (!user) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Mise à jour dynamique des champs
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined && req.body[key] !== null && req.body[key] !== "") {
        user[key] = req.body[key];
      }
    });

    // Si le mot de passe a été fourni, marquer comme modifié pour trigger pre-save
    if (req.body.motDePasse) {
      user.markModified('motDePasse');
    }

    // Gestion de l'image
    if (req.file) {
      if (user.image_user && user.image_user !== "default.jpg") {
        const oldImagePath = path.join(__dirname, '../public/images', user.image_user);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      user.image_user = req.file.filename;
    }

    const updatedUser = await user.save(); // ⚡ save() déclenche pre("save") pour motDePasse

    res.status(200).json({ message: "Utilisateur mis à jour", user: updatedUser });
  } catch (error) {
    console.error("❌ Error in updateUser:", error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
},

getUserById: async (req, res) => {
  try {
    const userId = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 🔹 Utilisateur
    const user = await User.findById(userObjectId).lean();
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // 🔹 Objectif actif
    const objectifActif = await Objectif.findOne({
      utilisateur: userObjectId,
      statut: "actif"
    }).lean();

    // 🔹 Dernier poids mesuré
    const dernierPoids = await Poids.findOne({
      utilisateur: userObjectId
    })
      .sort({ dateMesure: -1, createdAt: -1 })
      .lean();

    // ✅ Résultat FINAL (tous les champs utilisateur inclus)
    const result = {
      ...user, // ⭐ TOUTES les infos utilisateur

      // Objectif

      poidsDepart: objectifActif ? objectifActif.poidsDepart : null,
      poidsCible: objectifActif ? objectifActif.poidsCible : null,
      rythemeKgparSemaine: objectifActif
        ? objectifActif.rythemeKgparSemaine
        : null,

      // Poids
      poidsActuel: dernierPoids ? dernierPoids.poidsActuel : null,
      dateDerniereMesure: dernierPoids
        ? dernierPoids.dateMesure
        : null
    };

    res.status(200).json(result);

  } catch (error) {
    console.error("❌ Error in getUserById:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération de l'utilisateur",
      error: error.message
    });
  }
},

  addUserWithImage: async (req, res) => {
    try {
      const { email, motDePasse, role } = req.body;
      let image_user = "default.jpg";

      if (req.file) {
        image_user = req.file.filename; 
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email déjà utilisé" });
      }

      const newUser = new User({ email, motDePasse, role, image_user });
      await newUser.save();

      res.status(201).json({ message: "Utilisateur ajouté avec succès", user: newUser });
    } catch (error) {
      console.error("❌ Error in addUserWithImage:", error);
      res.status(500).json({ message: "Erreur lors de l'ajout avec image", error: error.message });
    }
  },


};
