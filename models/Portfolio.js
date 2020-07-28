var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var portfolioSchema = new Schema({
	name:  { type: String, required: true },
	stocks: { type: mongoose.Types.Array, required: true},
	userId: { type: String, required: true }
});

module.exports = mongoose.model('Portfolios', portfolioSchema);