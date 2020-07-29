const { wrapServiceResult } = require("../utils/common");
const Portfolios = require("../models/Portfolio");
const messages = require("../utils/messages");
const { isEmpty, get, wrap } = require("lodash");
const { entity } = require("../constants");
const stockService = require("./stock-service");

const addPortfolios = async (portfolio, user) => {
  if (isEmpty(portfolio)) {
    return wrapServiceResult(null, [
      messages.CANNOT_BE_EMPTY(entity.PORTFOLIO),
    ]);
  }
  portfolio.userId = user;
  const newPortfolio = new Portfolios(portfolio);
  const savedPortfolio = await newPortfolio.save();
  if (!savedPortfolio) {
    return wrapServiceResult(null, [messages.FAILED_TO_ADD(entity.PORTFOLIO)]);
  }
  return wrapServiceResult(savedPortfolio, []);
};

const isValidUser = async (user, portfolioId) => {
  const portfolio = await Portfolios.findById(portfolioId);
  if (portfolio && user.id == portfolio.userId) {
    return true;
  }
  return false;
};

const getAvailableStock = async (trade) => {
  const portfolio = await Portfolios.findById(trade.portfolioId);
  if (!portfolio) {
    return 0;
  }
  return get(
    portfolio.stocks.find((s) => trade.stockId == s.id),
    ["quantity"],
    0
  );
};

const addTradeToPortfolio = async (trade) => {
  const portfolio = await Portfolios.findById(trade.portfolioId);
  if (!portfolio) {
    return wrapServiceResult(null, [
      messages.FAILED_TO_FETCH(entity.PORTFOLIO),
    ]);
  }
  const [stock] = portfolio.stocks.filter((s) => trade.stockId == s.stockId);
  // this stock doesn't exists yet
  if (isEmpty(stock)) {
    let { value: newStock, errors } = await stockService.getStockById(
      trade.stockId
    );
    portfolio.stocks = [getPortfolioStock(newStock, trade, 0, 0)];
  } else {
    portfolio.stocks = [
      ...portfolio.stocks,
      getPortfolioStock(stock, trade, stock.quantity, stock.price),
    ];
  }
  const savedPortfolio = await portfolio.save();
  if (!savedPortfolio) {
    return wrapServiceResult(null, ["Failed to update the portfolio"]);
  }
  return wrapServiceResult(savedPortfolio, []);
};

const getPortfolioStock = (stock, trade, oldQuantity, oldAvgPrice, isSell) => {
  return {
    ticker: stock.ticker,
    quantity: isSell ? oldQuantity - trade.price : oldQuantity + trade.price,
    price: isSell
      ? oldAvgPrice
      : (oldQuantity * oldAvgPrice + trade.price * trade.quantity) /
        (oldQuantity + trade.quantity),
    stockId: stock.stockId,
  };
};

const updatePortfolios = async (portfolioUpdatePayload) => {
  const portfolio = await Portfolios.findById(portfolioUpdatePayload._id);
  if (!portfolio) {
    return wrapServiceResult(null, [
      messages.FAILED_TO_FETCH(entity.PORTFOLIO),
    ]);
  }
  if (!isEmpty(portfolioUpdatePayload.stocks)) {
    return wrapServiceResult(null, [
      messages.UPDATE_FAILED(entity.PORTFOLIO),
      "Stocks cannot be updated directly",
    ]);
  }
  const updatedPortfolio = await portfolio.save({
    ...portfolio.toObject(),
    ...portfolioUpdatePayload,
  });
  if (!updatedPortfolio) {
    return wrapServiceResult(null, [messages.UPDATE_FAILED(entity.PORTFOLIO)]);
  }
  return wrapServiceResult(updatedPortfolio, []);
};

const getPortfolioById = async (portfolioId, user) => {
  let isValid = await isValidUser(user, portfolioId);
  // can be modified to use portfolioId and user as filter then we don't need to valiate every time we access a portfolio
  if (!isValid) {
    return wrapServiceResult(null, "User cannot read this portfolio");
  }
  const portfolio = await Portfolios.findById(portfolioId);
  if (!portfolio) {
    return wrapServiceResult(null, messages.FAILED_TO_FETCH(entity.PORTFOLIO));
  }
  return wrapServiceResult(portfolio, []);
};

const calculateReturns = (stocks) => {
	let result = 0
	for (let i = 0; i < stocks.length; i++) {
		result += ((100 - stocks[i].price) * stocks[i].quantity)
	}
	return result;
}

const getPortfolioReturn = async (portfolioId, user) => {
	const {value, errors } = await getPortfolioById(portfolioId, user);
	if (!isEmpty(errors)) {
		return wrapServiceResult(null, errors);
	}
	const returns =  calculateReturns(value.stocks);
	return wrapServiceResult(returns, []);
}

module.exports = {
  addPortfolios,
  isValidUser,
  getAvailableStock,
  addTradeToPortfolio,
  updatePortfolios,
	getPortfolioById,
	getPortfolioReturn
};
