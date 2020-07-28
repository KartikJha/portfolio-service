const { wrapServiceResult } = require("../utils/common");
const Trades = require("../models/Trade");
const messages = require("../utils/messages");
const { isEmpty } = require("lodash");

const addTrade = async (trade) => {
	if (isEmpty(trade)) {
		return wrapServiceResult(null, ["Trade body cannot be empty or null"]);
	}
	const newTrade = new Trades(trade);
	const savedTrade = await newTrade.save();
	if (!savedTrade) {
		return wrapServiceResult(null, ["Trade cannot be placed"]);
	}
	return wrapServiceResult(savedTrade, []);
}

module.exports = {
	addTrade
}