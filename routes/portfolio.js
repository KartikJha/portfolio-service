var express = require("express");
const logger = require("../utils/logger");
var router = express.Router();
const portfolioService = require("../service/portfolio-service");
const { withFailSafe, sendResponse } = require("../utils/common");
const messages = require("../utils/messages");
const { isEmpty } = require("lodash");
const { entity } = require("../constants");

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
    const { value, errors } = await portfolioService.addPortfolios(req.body);
    if (isEmpty(errors)) {
      return sendResponse(res, 201, messages.SUCCESS, {}, [], value);
    }
    return sendResponse(res, 500, messages.UNKNOWN_ERROR, {}, errors, {});
  })(req, res)
);

module.exports = router;
