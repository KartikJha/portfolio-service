const { wrapServiceResult } = require("../utils/common");
const Portfolios = require("../models/Portfolio");
const messages = require("../utils/messages");
const { isEmpty } = require("lodash");
const { entity } = require("../constants");

const addPortfolios = async (portfolio) => {
	if (isEmpty(portfolio)) {
		return wrapServiceResult(null, [messages.CANNOT_BE_EMPTY(entity.PORTFOLIO)]);
	}
	const newPortfolio = new Portfolios(portfolio);
	const savedPortfolio = await newPortfolio.save();
	if (!savedPortfolio) {
		return wrapServiceResult(null, [messages.FAILED_TO_ADD(entity.PORTFOLIO)]);
	}
	return wrapServiceResult(savedPortfolio, []);
}

module.exports = {
	addPortfolios
}