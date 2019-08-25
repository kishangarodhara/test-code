const express = require('express');
const router = express.Router();
const VerifyToken = require('../controllers/verifytoken');
// Require controler
const userRegistercontroller=require('../controllers/userRegister.controller');

// This route is used for  register  
router.post('/register', userRegistercontroller.user_create);

router.post('/profileupdate', VerifyToken, userRegistercontroller.profile_update);

router.get('/userdata', VerifyToken, userRegistercontroller.user_data);

router.post('/emailverify', userRegistercontroller.checkEmailExist);

module.exports=router;

