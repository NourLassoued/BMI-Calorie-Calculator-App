const express = require("express");
const router = express.Router();
const mesureController = require("../Controller/MeseurController.js");
const { requireAuthUser } = require("../middlewares/authmiddleares.js");

router.post("/addMesure/:userId", mesureController.addMesure);
router.get("/getDerniereMesure/:userId", mesureController.getDerniereMesure);
router.delete('/deleteMesure/:mesureId', mesureController.deleteMesure);


module.exports = router;
