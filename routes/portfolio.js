var express = require("express");
const logger = require("../utils/logger");
var router = express.Router();
const portfolioService = require("../service/portfolio-service");
const { withFailSafe, sendResponse } = require("../utils/common");
const messages = require("../utils/messages");
const { isEmpty } = require("lodash");
const { entity } = require("../constants");
const tradeService = require("../service/trade-service");

/* GET users listing. */
router.get("/", (req, res) =>
  withFailSafe(
    [],
    messages.FAILED_TO_FETCH(entity.PORTFOLIO)
  )(async (req, res) => {
    return sendResponse(res, 400, messages.SUCCESS, {}, errors, []);
  })(req, res)
);

router.post("/", (req, res) =>
  withFailSafe(
    null,
    messages.FAILED_TO_ADD(entity.PORTFOLIO)
  )(async (req, res) => {
    const { value, errors } = await portfolioService.addPortfolios(
      req.body,
      req.user
    );
    if (isEmpty(errors)) {
      return sendResponse(res, 201, messages.SUCCESS, {}, [], value);
    }
    return sendResponse(res, 500, messages.UNKNOWN_ERROR, {}, errors, {});
  })(req, res)
);

router.patch("/", (req, res) =>
  withFailSafe(
    null,
    messages.UPDATE_FAILED(entity.PORTFOLIO)
  )(async (req, res) => {
    const portfolio = req.body;
    if (!portfolio._id) {
      return sendResponse(
        res,
        400,
        "",
        {},
        [messages.ID_REQUIRED_FOR_UPDATE(entity.PORTFOLIO)],
        {}
      );
    }
    const { value, errors } = await portfolioService.updatePortfolios(req.body);
    if (isEmpty(errors)) {
      return sendResponse(res, 200, messages.SUCCESS, {}, [], value);
    }
    return sendResponse(res, 400, "", {}, errors, {});
  })(req, res)
);

router.get("/:portfolioId", (req, res) =>
  withFailSafe(
    null,
    messages.FAILED_TO_FETCH(entity.PORTFOLIO)
  )(async (req, res) => {
    const { portfolioId } = req.params;
    if (!portfolioId) {
      return sendResponse(
        res,
        400,
        "",
        {},
        [messages.ID_REQUIRED_FOR_FETCH(entity.PORTFOLIO)],
        {}
      );
    }
    const { value, errors } = await portfolioService.getPortfolioById(
      portfolioId,
      req.user
    );
    if (!isEmpty(errors)) {
      return sendResponse(
        res,
        500,
        message.FAILED_TO_FETCH(entity.PORTFOLIO),
        {},
        errors,
        null
      );
    }
    const {
      value: tradeList,
      errors: tradeFetchErrors,
    } = await tradeService.getTradeByPortfolioId(portfolioId);
    if (!isEmpty(tradeFetchErrors)) {
      return sendResponse(
        res,
        500,
        [messages.FAILED_TO_FETCH(entity.TRADE)],
        {},
        tradeFetchErrors,
        null
      );
    }
    return sendResponse(res, 200, messages.SUCCESS, {}, [], {
      ...value.toObject(),
      tradeList,
    });
  })(req, res)
);

router.get("/:portfolioId/holdings", (req, res) =>
  withFailSafe(
    null,
    "Failed to fetch portfolio holdings"
  )(async (req, res) => {
    const { portfolioId } = req.params;
    if (!portfolioId) {
      return sendResponse(
        res,
        400,
        "",
        {},
        [messages.ID_REQUIRED_FOR_FETCH(entity.PORTFOLIO)],
        {}
      );
    }
    const { value, errors } = await portfolioService.getPortfolioById(
      portfolioId,
      req.user
    );
    if (!isEmpty(errors)) {
      return sendResponse(
        res,
        500,
        messages.FAILED_TO_FETCH(entity.PORTFOLIO),
        {},
        errors,
        null
      );
    }
    return sendResponse(res, 200, messages.SUCCESS, {}, [], value.stocks);
  })(req, res)
);

router.get("/:portfolioId/returns", (req, res) =>
  withFailSafe(
    null,
    "Failed to fetch portfolio returns"
  )(async (req, res) => {
    const { portfolioId } = req.params;
    if (!portfolioId) {
      return sendResponse(
        res,
        400,
        "",
        {},
        [messages.ID_REQUIRED_FOR_FETCH(entity.PORTFOLIO)],
        {}
      );
    }
    const { value, errors } = await portfolioService.getPortfolioReturn(
      portfolioId,
      req.user
    );
    if (!isEmpty(errors)) {s
      return sendResponse(
        res,
        500,
        messages.FAILED_TO_FETCH(entity.PORTFOLIO),
        {},
        errors,
        null
      );
    }
    return sendResponse(res, 200, messages.SUCCESS, {}, [], value);
  })(req, res)
);
module.exports = router;
