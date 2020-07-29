var mongoose = require('mongoose');
const { isPositiveNumber } = require('../utils/schema-validator');
const messages = require('../utils/messages');
const { entity } = require('../constants');
var Schema = mongoose.Schema;

var stockSchema = new Schema({
	ticker:  { type: String, unique: true, required: true },
	currentPrice: { type: Number, required: true, validate: {
		validator: isPositiveNumber,
		message: messages.SHOULD_BE_POSITIVE
	}},
	quantity: {type: Number, required: true, validate: {
		validator: isPositiveNumber,
		message: messages.SHOULD_BE_POSITIVE(entity.STOCK)
	}},
});

module.exports = mongoose.model('Stocks', stockSchema);