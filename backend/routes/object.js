const express = require("express");
const router = express.Router();
const objectifController = require("../Controller/ObjectControlleur");
const {requireAuthUser} = require("../middlewares/authmiddleares.js");


// Ajouter un objectif
router.post("/addObjectif", objectifController.addObjectif);

// Récupérer tous les objectifs d’un utilisateur

// Récupérer un objectif par ID
router.get("/getObjectifById/:utilisateurId", objectifController.getObjectifById);
router.delete("/deleteObjectif/:id",objectifController.deleteObjectif);
router.put("/updateSatutObjectif/:id",objectifController.updateSatutObjectif);
module.exports = router;
