const userRegisterSchema = require('../models/userRegister.model');
const Bcrypt = require("bcryptjs");
const config = require('../config/config');
let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
/**
 * This method is used to login to the user 
 * 
 * @param {JSON} Email  email id 
 * @param {JSON} password password  require
 *  @returns {JSON} 200,400
 */
exports.login = function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    userRegisterSchema.findOne({ email: email, isverified: true }, function (err, user) {
        if (err) {
            console.log(err)
        }
        if (!user) {
            return res.status(404).json({
                "status": "404",
                "message": "crediantials are worng"
            });
        }
        if (!Bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({
                "status": "400",
                "message": "The password is invalid"
            });
        }
        userRegisterSchema.findOneAndUpdate({ email: req.body.email }, { $set: { last_login_date: Date() } }, { new: true }, function (err, userdata) {
            if (err) {
                console.log(err);
            }
            else {
                req.session.user = user;
                var token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                  });
                return res.status(200).json({
                    "status": "200",
                    "message": user//token
                });
                console.log(userdata);
           }
       });

    });
};

/**
 * This method will logout user from the application 
 * 
 *  @returns {JSON} 200,400
 */





 exports.logout = function (req, res) {

//    res.status(200).send({ auth: false, token: null });

    req.session.destroy();
    return res.status(200).json({
        
        "status": "200",
        "message": "logout scuccesfully",
        token:null

    });
}