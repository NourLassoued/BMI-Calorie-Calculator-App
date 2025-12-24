const express = require('express');
const router = express.Router();
const imcControlleur = require("../Controller/ImcControlleur.js");

router.delete('/imc/:resultatId', imcControlleur.deleteIMC);
router.get('/dernier/:utilisateurId', imcControlleur.getDernierIMC);


module.exports = router;
