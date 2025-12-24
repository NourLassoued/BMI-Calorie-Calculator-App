const User  = require("../models/userschema.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");   
const path = require('path');
const fs = require('fs');
 const Poids = require("../models/poidsSchema"); 
const Objectif = require("../models/ObjectifSchema");
const IMC = require("../models/imc");
const ResultatIMC = require('../models/ResultatIMCSchema.js'); 




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
      console.error(" Error in addUser:", error);
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

    if (req.body.motDePasse) {
      user.markModified('motDePasse');
    }

    
    if (req.file) {
      if (user.image_user && user.image_user !== "default.jpg") {
        const oldImagePath = path.join(__dirname, '../public/images', user.image_user);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      user.image_user = req.file.filename;
    }

    const updatedUser = await user.save(); 

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

    const user = await User.findById(userObjectId).lean();
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const objectifActif = await Objectif.findOne({
      utilisateur: userObjectId,
      statut: "actif"
    }).lean();

    const dernierPoids = await Poids.findOne({
      utilisateur: userObjectId
    })
      .sort({ dateMesure: -1, createdAt: -1 })
      .lean();

    const result = {
      ...user, 


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
/*
  calculateCaloriesByActivity: async (req, res) => {
    try {
      const userId = req.params.id?.trim();
      
      if (!userId) {
        return res.status(400).json({ 
          success: false,
          message: "ID utilisateur manquant" 
        });
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ 
          success: false,
          message: "Format d'ID invalide" 
        });
      }

      const { niveauActivite } = req.body;
      const niveauxValides = ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active', 'Extra Active'];
      
      if (!niveauActivite) {
        return res.status(400).json({ 
          success: false,
          message: "Niveau d'activité requis",
          niveauxDisponibles: niveauxValides
        });
      }

      if (!niveauxValides.includes(niveauActivite)) {
        return res.status(400).json({ 
          success: false,
          message: "Niveau d'activité invalide",
          niveauxDisponibles: niveauxValides
        });
      }

      const user = await User.findById(userId).lean();
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: "Utilisateur non trouvé" 
        });
      }

      if (!user.taille || !user.dateNaissance || !user.sexe) {
        return res.status(400).json({ 
          success: false,
          message: "Profil incomplet",
          donneesManquantes: {
            taille: !user.taille,
            dateNaissance: !user.dateNaissance,
            sexe: !user.sexe
          }
        });
      }

      const dernierPoids = await Poids.findOne({ utilisateur: userId })
        .sort({ dateMesure: -1, createdAt: -1 })
        .lean();

      if (!dernierPoids || !dernierPoids.poidsActuel) {
        return res.status(400).json({ 
          success: false,
          message: "Aucun poids enregistré pour cet utilisateur" 
        });
      }

      const objectifActif = await Objectif.findOne({
        utilisateur: userId,
        statut: "actif",
      });

      // Préparation des données
      const poids = dernierPoids.poidsActuel;
      const taille = user.taille;
      const dateNaissance = new Date(user.dateNaissance);
      const aujourdhui = new Date();
      const age = Math.floor((aujourdhui - dateNaissance) / (365.25 * 24 * 60 * 60 * 1000));
      const sexe = user.sexe.toLowerCase();
      const typeObjectif = objectifActif?.typeObjectif?.toLowerCase() || "maintien";
      const rythemeKgparSemaine = objectifActif?.rythemeKgparSemaine || null;

      // Validation des valeurs
      if (age < 10 || age > 120) {
        return res.status(400).json({ 
          success: false,
          message: "Âge invalide calculé à partir de la date de naissance" 
        });
      }

      if (poids <= 0 || poids > 500) {
        return res.status(400).json({ 
          success: false,
          message: "Poids invalide" 
        });
      }

      if (taille <= 0 || taille > 300) {
        return res.status(400).json({ 
          success: false,
          message: "Taille invalide" 
        });
      }

      // Utilisation de la classe IMC
      let imcCalculator;
      try {
        imcCalculator = new IMC(poids, taille, age, sexe, niveauActivite);
      } catch (error) {
        return res.status(400).json({ 
          success: false,
          message: "Erreur lors de l'initialisation du calcul",
          details: error.message
        });
      }

      // Calculs de base
      const imc = imcCalculator.calculIMC();
      const classificationIMC = imcCalculator.classificationIMC();
      const bmr = Math.round(imcCalculator.calculBMR());
      const caloriesMaintenance = imcCalculator.caloriesMaintenance();
      
      // Calcul des calories selon le rythme de l'objectif
      let caloriesObjectif;
      let detailsRythme = null;

      try {
        if (objectifActif && rythemeKgparSemaine) {
          // Utiliser le rythme spécifique de l'objectif
          caloriesObjectif = imcCalculator.caloriesObjectifAvecRythme(typeObjectif, rythemeKgparSemaine);
          detailsRythme = imcCalculator.detailsPlanRythme(typeObjectif, rythemeKgparSemaine);
        } else {
          // Utiliser le calcul par défaut (±500 kcal)
          caloriesObjectif = imcCalculator.caloriesObjectif(typeObjectif);
        }
      } catch (error) {
        console.warn("Erreur lors du calcul des calories objectif:", error.message);
        caloriesObjectif = caloriesMaintenance;
      }

      // Calcul du poids idéal et recommandations
      const poidsIdeal = Math.round(imcCalculator.poidsIdeal() * 10) / 10;
      const poidsObjectif = imcCalculator.poidsAAtteindre();

      // Construction de la réponse enrichie
      const responseData = {
        success: true,
        data: {
          utilisateur: {
            id: userId,
            poids: poids,
            taille: taille,
            age: age,
            sexe: sexe,
            niveauActivite: niveauActivite
          },
          imc: {
            valeur: imc,
            classification: classificationIMC.label,
            risque: classificationIMC.risque
          },
          calories: {
            bmr: bmr,
            maintenance: caloriesMaintenance,
            objectif: caloriesObjectif,
            typeObjectif: typeObjectif
          },
          recommandations: {
            poidsIdeal: poidsIdeal,
            poidsCible: poidsObjectif.poidsCible,
            difference: Math.abs(poidsObjectif.difference),
            action: poidsObjectif.type,
            message: poidsObjectif.type === 'perdre' 
              ? `Vous devriez perdre environ ${Math.abs(poidsObjectif.difference)} kg`
              : poidsObjectif.type === 'gagner'
              ? `Vous devriez prendre environ ${Math.abs(poidsObjectif.difference)} kg`
              : 'Votre poids est optimal'
          },
          objectifActuel: objectifActif ? {
            id: objectifActif._id,
            type: objectifActif.typeObjectif,
            poidsDepart: objectifActif.poidsDepart,
            poidsCible: objectifActif.poidsCible,
            rythemeKgparSemaine: objectifActif.rythemeKgparSemaine,
            dateDebut: objectifActif.dateDebut,
            dateFinCible: objectifActif.dateFinCible,
            statut: objectifActif.statut
          } : null
        },
        timestamp: new Date().toISOString()
      };

      // Ajouter les détails du rythme si disponibles
      if (detailsRythme) {
        responseData.data.planRythme = {
          rythme: detailsRythme.rythme,
          ajustementCalorique: {
            journalier: detailsRythme.calories.ajustementJournalier,
            hebdomadaire: detailsRythme.calories.ajustementHebdomadaire
          }
        };
      }

      //  Ajouter un résumé du plan si objectif actif
      if (objectifActif && rythemeKgparSemaine) {
        const differencePoidsTotal = Math.abs(objectifActif.poidsCible - objectifActif.poidsDepart);
        const dureeEstimeeSemaines = Math.ceil(differencePoidsTotal / rythemeKgparSemaine);
        const dureeEstimeeJours = dureeEstimeeSemaines * 7;
        const dateFinEstimee = new Date(objectifActif.dateDebut);
        dateFinEstimee.setDate(dateFinEstimee.getDate() + dureeEstimeeJours);

        responseData.data.progressionEstimee = {
          poidsActuel: poids,
          poidsDepart: objectifActif.poidsDepart,
          poidsCible: objectifActif.poidsCible,
          poidsRestant: Math.abs(objectifActif.poidsCible - poids),
          progressionPourcent: Math.round(
            (Math.abs(objectifActif.poidsDepart - poids) / differencePoidsTotal) * 100
          ),
          dureeEstimee: {
            semaines: dureeEstimeeSemaines,
            jours: dureeEstimeeJours,
            dateFinEstimee: dateFinEstimee.toISOString()
          }
        };
      }

      res.status(200).json(responseData);

    } catch (error) {
      console.error("Erreur dans calculateCaloriesByActivity:", error);
      
      // Gestion des erreurs spécifiques
      if (error.name === 'CastError') {
        return res.status(400).json({ 
          success: false,
          message: "Erreur de format de données",
          error: error.message 
        });
      }

      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
          success: false,
          message: "Erreur de validation",
          error: error.message 
        });
      }

      // Erreur générique
      res.status(500).json({ 
        success: false,
        message: "Erreur serveur lors du calcul des calories",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
*/
 calculateCaloriesByActivity :async (req, res) => {
  try {
    const userId = req.params.id?.trim();
    if (!userId) {
      return res.status(400).json({ success: false, message: "ID utilisateur manquant" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Format d'ID invalide" });
    }

    const { niveauActivite } = req.body;
    const niveauxValides = ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active', 'Extra Active'];
    if (!niveauActivite) {
      return res.status(400).json({ 
        success: false,
        message: "Niveau d'activité requis",
        niveauxDisponibles: niveauxValides
      });
    }
    if (!niveauxValides.includes(niveauActivite)) {
      return res.status(400).json({ 
        success: false,
        message: "Niveau d'activité invalide",
        niveauxDisponibles: niveauxValides
      });
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    if (!user.taille || !user.dateNaissance || !user.sexe) {
      return res.status(400).json({ 
        success: false,
        message: "Profil incomplet",
        donneesManquantes: {
          taille: !user.taille,
          dateNaissance: !user.dateNaissance,
          sexe: !user.sexe
        }
      });
    }

    const dernierPoids = await Poids.findOne({ utilisateur: userId })
      .sort({ dateMesure: -1, createdAt: -1 })
      .lean();
    if (!dernierPoids || !dernierPoids.poidsActuel) {
      return res.status(400).json({ success: false, message: "Aucun poids enregistré pour cet utilisateur" });
    }

    const objectifActif = await Objectif.findOne({
      utilisateur: userId,
      statut: "actif",
    });

    // Préparer les données
    const poids = dernierPoids.poidsActuel;
    const taille = user.taille;
    const dateNaissance = new Date(user.dateNaissance);
    const aujourdhui = new Date();
    const age = Math.floor((aujourdhui - dateNaissance) / (365.25 * 24 * 60 * 60 * 1000));
    const sexe = user.sexe.toLowerCase();
    const typeObjectif = objectifActif?.typeObjectif?.toLowerCase() || "maintien";
    const rythemeKgparSemaine = objectifActif?.rythemeKgparSemaine || null;

    if (age < 10 || age > 120) {
      return res.status(400).json({ success: false, message: "Âge invalide calculé à partir de la date de naissance" });
    }
    if (poids <= 0 || poids > 500) {
      return res.status(400).json({ success: false, message: "Poids invalide" });
    }
    if (taille <= 0 || taille > 300) {
      return res.status(400).json({ success: false, message: "Taille invalide" });
    }

    // Initialiser IMC
    let imcCalculator;
    try {
      imcCalculator = new IMC(poids, taille, age, sexe, niveauActivite);
    } catch (error) {
      return res.status(400).json({ success: false, message: "Erreur lors de l'initialisation du calcul", details: error.message });
    }

    const imc = imcCalculator.calculIMC();
    const classificationIMC = imcCalculator.classificationIMC();
    const bmr = Math.round(imcCalculator.calculBMR());
    const caloriesMaintenance = imcCalculator.caloriesMaintenance();

    // Calories objectif
    let caloriesObjectif;
    let detailsRythme = null;
    try {
      if (objectifActif && rythemeKgparSemaine) {
        caloriesObjectif = imcCalculator.caloriesObjectifAvecRythme(typeObjectif, rythemeKgparSemaine);
        detailsRythme = imcCalculator.detailsPlanRythme(typeObjectif, rythemeKgparSemaine);
      } else {
        caloriesObjectif = imcCalculator.caloriesObjectif(typeObjectif);
      }
    } catch (error) {
      console.warn("Erreur lors du calcul des calories objectif:", error.message);
      caloriesObjectif = caloriesMaintenance;
    }

    const poidsIdeal = Math.round(imcCalculator.poidsIdeal() * 10) / 10;
    const poidsObjectif = imcCalculator.poidsAAtteindre();

    // Enregistrer dans la base
    const resultat = new ResultatIMC({
      utilisateur: userId,
      poids: poids,
      taille: taille,
      age: age,
      sexe: sexe,
      niveauActivite: niveauActivite,
      imc: {
        valeur: imc,
        classification: classificationIMC.label,
        risque: classificationIMC.risque
      },
      calories: {
        bmr: bmr,
        maintenance: caloriesMaintenance,
        objectif: caloriesObjectif,
        typeObjectif: typeObjectif
      },
      poidsIdeal: poidsIdeal,
      poidsCible: poidsObjectif.poidsCible,
      differencePoids: Math.abs(poidsObjectif.difference),
      actionPoids: poidsObjectif.type,
      dateCalcul: new Date()
    });

    if (detailsRythme) {
      resultat.planRythme = detailsRythme; // optionnel, à ajouter dans ton schéma si besoin
    }

    await resultat.save();

    // Réponse au client
    const responseData = {
      success: true,
      data: {
        utilisateur: { id: userId, poids, taille, age, sexe, niveauActivite },
        imc: { valeur: imc, classification: classificationIMC.label, risque: classificationIMC.risque },
        calories: { bmr, maintenance: caloriesMaintenance, objectif: caloriesObjectif, typeObjectif },
        recommandations: {
          poidsIdeal,
          poidsCible: poidsObjectif.poidsCible,
          difference: Math.abs(poidsObjectif.difference),
          action: poidsObjectif.type,
          message: poidsObjectif.type === 'perdre' 
            ? `Vous devriez perdre environ ${Math.abs(poidsObjectif.difference)} kg`
            : poidsObjectif.type === 'gagner'
            ? `Vous devriez prendre environ ${Math.abs(poidsObjectif.difference)} kg`
            : 'Votre poids est optimal'
        },
        planRythme: detailsRythme ? {
          rythme: detailsRythme.rythme,
          ajustementCalorique: {
            journalier: detailsRythme.calories.ajustementJournalier,
            hebdomadaire: detailsRythme.calories.ajustementHebdomadaire
          }
        } : null
      },
      timestamp: new Date().toISOString()
    };

    res.status(200).json(responseData);

  } catch (error) {
    console.error("Erreur dans calculateCaloriesByActivity:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur lors du calcul des calories",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
 }
}

