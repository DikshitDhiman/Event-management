var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newBooking = new Schema({
	cust : { type: Schema.Types.ObjectId, ref: 'customer' },
	srvc : { type: Schema.Types.ObjectId, ref: 'serviceprovider' }
});

var BookedEvents = mongoose.model('newBooking Events' , newBooking , 'bookedevents');
module.exports = BookedEvents;