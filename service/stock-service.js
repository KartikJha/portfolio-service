const { wrapServiceResult } = require("../utils/common");
const Stocks = require("../models/Stock");
const messages = require("../utils/messages");
const { isEmpty } = require("lodash");
const { entity } = require("../constants");

const addStocks = async (stock) => {
	if (isEmpty(stock)) {
		return wrapServiceResult(null, [messages.CANNOT_BE_EMPTY(entity.STOCK)]);
	}
	const newStock = new Stocks(stock);
	const savedStock = await newStock.save();
	if (!savedStock) {
		return wrapServiceResult(null, [messages.FAILED_TO_ADD(entity.STOCK)]);
	}
	return wrapServiceResult(savedStock, []);
}

module.exports = {
	addStocks
}