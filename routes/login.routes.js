const express = require('express');
const router = express.Router();
//const userprofileSchema = require('../models/user.model');

// Require controler
const logincontroller=require('../controllers/login.controller');

// login routes
router.post('/login',logincontroller.login);

// logout routes
router.get('/logout',logincontroller.logout);

module.exports=router;