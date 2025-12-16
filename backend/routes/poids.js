var express = require('express');
var router = express.Router();
const poidsControlleur=require("../Controller/poidsControlleur");
const { requireAuthUser } = require("../middlewares/authmiddleares");
router.post('/add/:userId'  ,poidsControlleur.addPoids);
router.get('/getPoidsByUser/:userId', requireAuthUser,poidsControlleur.getPoidsByUser);
router.put("/update/:userId", poidsControlleur.updateUser);
router.delete("/delete/:poidsId", poidsControlleur.deletePoids);

module.exports=router;