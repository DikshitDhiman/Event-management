var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userQuerySchema = new Schema({
    name : {type : String},
    email : {type : String},
    message : {type : String}
});

var userQuery = mongoose.model('userQueryInformation',userQuerySchema,'userquery');

module.exports = userQuery;