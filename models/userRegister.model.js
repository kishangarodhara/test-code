const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/* This schema will store the user Registration detail */ 
let userRegisterSchema = new Schema({
	name : {type: String, max:50},
	password: {type: String},
	email : {type: String},
	isverified: { type: Boolean, default: 1 },
    creation_date: { type: Date, default: Date.now},
	last_login_date:{type: Date, default: Date.now}
});
 
// Exports the model
module.exports = mongoose.model('userRegister', userRegisterSchema);
