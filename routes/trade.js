var express = require("express");
const logger = require("../utils/logger");
var router = express.Router();
const tradeService = require("../service/trade-service");
const { withFailSafe, sendResponse } = require("../utils/common");
const messages = require("../utils/messages");
const { isEmpty } = require("lodash");

/* GET users listing. */
router.get("/", (req, res) =>
  withFailSafe(
    [],
    messages.FAILED_TO_FETCH_USERS
  )(async (req, res) => {
    // const { value, errors } = await tradeService.addTrade(req.query);
    // if (isEmpty(errors)) {
    //   return sendResponse(res, 200, messages.SUCCESS, {}, [], value);
    // }
    // return sendResponse(res, 400, messages.SUCCESS, {}, errors, []);
  })(req, res)
);

router.post("/", (req, res) =>
  withFailSafe(
    null,
    messages.TRADE_FAILED
  )(async (req, res) => {
    const { value, errors } = await tradeService.addTrade(req.body);
    if (isEmpty(errors)) {
      return sendResponse(res, 201, messages.TRADE_PLACED, {}, [], value);
    }
    return sendResponse(res, 500, messages.UNKNOWN_ERROR, {}, errors, {});
  })(req, res)
);

module.exports = router;
