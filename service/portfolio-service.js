const { wrapServiceResult } = require("../utils/common");
const Portfolios = require("../models/Portfolio");
const messages = require("../utils/messages");
const { isEmpty, get } = require("lodash");
const { entity } = require("../constants");
const stockService = require("./stock-service");

const addPortfolios = async (portfolio) => {
  if (isEmpty(portfolio)) {
    return wrapServiceResult(null, [
      messages.CANNOT_BE_EMPTY(entity.PORTFOLIO),
    ]);
  }
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

module.exports = {
  addPortfolios,
  isValidUser,
  getAvailableStock,
  addTradeToPortfolio,
};
