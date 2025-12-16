var express = require('express');
var router = express.Router();
const authController = require("../Controller/authControlleur");
const uploadfile = require("../middlewares/UploadFils")


router.post('/register',uploadfile.single('image_user'), authController.register);
router.get('/logout', authController.logoutUser);

router.post('/login', authController.loginUser);
module.exports = router;

