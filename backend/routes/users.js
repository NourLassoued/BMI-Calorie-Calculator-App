var express = require('express');
var router = express.Router();
const userController = require("../Controller/UserController");
const uploadfile = require("../middlewares/UploadFils")
const {requireAuthUser} = require("../middlewares/authmiddleares.js");



router.get('/getAllUsers', requireAuthUser ,userController.getAllUsers);

router.post('/addUser', userController.addUser);
router.delete('/deleteUser/:id', requireAuthUser ,userController.deleteUser);
router.put('/updateUser/:id' ,uploadfile.single('image_user'),userController.updateUser);
router.get('/getUserById/:id' ,userController.getUserById);
router.post('/calculate/:id', userController.calculateCaloriesByActivity);

module.exports = router;

