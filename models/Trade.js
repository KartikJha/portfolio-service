var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tradeSchema = new Schema({
	userId:  { type: String, required: true},
	stockId: { type: String, required: true},
	quantity: {type: Number, required: true},
	type: {type: String, required: true}
});

module.exports = mongoose.model('Trades', tradeSchema);