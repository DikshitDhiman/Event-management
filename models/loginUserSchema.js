var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var loginUserSchema = new Schema({
    usertype : {type : String},
    name:{type : String},
    username : {type : String},
    email : {type : String},
    password : {type : String}
}); 
 
var User = mongoose.model('loginUserInformation',loginUserSchema,'user');
module.exports = User;