var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customerSchema = new Schema({
    name:{type : String},
    username : {type : String},
    email : {type : String},
    address : {type : String},
    deleteflag : {type : Boolean}
}); 
 
var ServiceProvider = mongoose.model('customerInformation',customerSchema,'customer');
module.exports = ServiceProvider;  