const { wrapServiceResult } = require("../utils/common");
const Trades = require("../models/Trade");
const messages = require("../utils/messages");
const { isEmpty } = require("lodash");
const { tradeType } = require('../constants');
const portfolioService = require('../service/portfolio-service')


const addTrade = async (trade, user) => {
	if (isEmpty(trade)) {
		return wrapServiceResult(null, ["Trade body cannot be empty or null"]);
	}
	let isValidUser = await portfolioService.isValidUser(user, trade.portfolioId);
	// portfolio doesn't belong to user
	if (!isValidUser) {
		return wrapServiceResult(null, ["User not allowed to trade on this portfolio"]);
	}
	// user is trying to sell more than what is available for a particular stock
	if (trade.type == tradeType.SELL ) {
		let availableStocks = await portfolioService.getAvailableStock(trade);
		if (availableStocks < trade.quantity) 
			return wrapServiceResult(null, [messages.STOCK_TRADE_AVAILABILITY(availableStocks, trade.quantity)]);
	}
	const newTrade = new Trades(trade);
	const savedTrade = await newTrade.save();
	if (!savedTrade) {
		return wrapServiceResult(null, ["Trade cannot be placed"]);
	}
	const {value, errors} = portfolioService.addTradeToPortfolio(trade);
	if (!isEmpty(errors)) {
		return wrapServiceResult(null, errors);
	}
	return wrapServiceResult(savedTrade, []);
}



module.exports = {
	addTrade
}