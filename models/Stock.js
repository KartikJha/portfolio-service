var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockSchema = new Schema({
	ticker:  { type: String, unique: true },
	currentPrice: { type: String, required: true},
	quantity: {type: Number, required: true},
});

module.exports = mongoose.model('Stocks', stockSchema);