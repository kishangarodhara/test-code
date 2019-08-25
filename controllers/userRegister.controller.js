const userRegisterSchema = require('../models/userRegister.model');
var request = require("request");
const Bcrypt = require("bcryptjs");
var config = require('../config/config');
var crypto = require('crypto');
let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

async function profile_update(req,res){
        res.send("welcome");
}

async function user_data(req,res) {
    
    userRegisterSchema.find({}, function(err, userdata){
        res.status(200).json({
            "status": "200",
            "data": userdata
        });
    });
}


/**
* This method is used to checkEmail is exits or not. 
* 
* @param {JSON} email email  require
*  @returns {JSON} 200,400
*/
async function checkEmailExist(req, res) {

    req.checkBody("email", "Email is required").notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        res.status(400).json({
            "status": "400",
            "message": errors
        });
    } else {
        emailExist = await checkemailexist(req.body.email);
        if (emailExist === null) {
            res.status(403).json({
                "status": "403",
                "data": "email is exist already"
            });
        }
        else {
            res.status(200).json({
                "status": "200",
                "data": "you can use this email"
            });
        }
    }
}

/**
* This funcation will check for the email exits or not in database  
* 
* @param {JSON} email email  require
*  @returns {Boolean} null,true
*/
async function checkemailexist(email) {
    return new Promise((resolve) => {

        userRegisterSchema.findOne({ email: email }).then(function (result) {
            if (result !== null) {
                resolve(null);
            } else {
                resolve(true);
            }

        });
    });
}

/**
* This method is used  to create user 
* 
* @param {JSON} name name  require
* @param {JSON} password password require
* @param {JSON} email email require
*  @returns {JSON} 200,400
*/
async function user_create(req, res) {

    req.checkBody("name", "name is required").notEmpty();
    req.checkBody("password", "password is required").notEmpty();
    req.checkBody("email", "email is required").notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        res.status(400).json({
            "status": "400",
            "message": errors
        });
    }
    else {

        emailExist = await checkemailexist(req.body.email);
        if (emailExist === null) {
            res.status(403).json({
                "status": "403",
                "data": "email is exist already"
            });
        }
        else {
            var password = Bcrypt.hashSync(req.body.password, 10);

            let userRegister = new userRegisterSchema(
                {
                    name: req.body.name,
                    password: password,
                    email: req.body.email,
                    creation_date: Date.now(),
                });
            userRegister.save(function (err, userdata) {
                if (err) {
                    res.status(400).json({
                        "status": "400",
                        "message": error
                    });
                }
                else {
                    var token = jwt.sign({ id: userdata._id }, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                      });
                    res.status(200).json({
                        "status": "200",
                        "data": userdata//,token
                    });
                }
            });
        }
    }
}







module.exports = {
    user_create,
    checkEmailExist,
    checkemailexist,
    user_data,
    profile_update

};
