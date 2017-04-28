






var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var serviceProviderSchema = new Schema({
    name : {type : String},
    username : {type : String},
    email : {type : String},
    servicetype : {type : String},
    servicecharge : {type : Number},
    deleteflag : {type : Boolean}
}); 
 
var ServiceProvider = mongoose.model('serviceProviderInformation',serviceProviderSchema,'serviceprovider');
module.exports = ServiceProvider;