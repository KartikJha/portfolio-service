var mongoose = require("mongoose");
const { isPositiveNumber } = require("../utils/schema-validator");
const messages = require("../utils/messages");
var Schema = mongoose.Schema;

var tradeSchema = new Schema({
  userId: { type: String, required: true, index: true },
  stockId: { type: String, required: true },
  quantity: {
    type: Number,
    required: true,
    validate: {
      validator: isPositiveNumber,
      message: "Quantity should be a number >= 0",
    },
  },
  price: {
    type: String,
    required: true,
    validate: {
      validator: isPositiveNumber,
      message: messages.SHOULD_BE_POSITIVE,
    },
  },
  type: { type: String, required: true, enum: ["Buy", "Sell"] },
  portfolioId: { type: String, required: true, index: true },
  state: {
    type: String,
    enum: ["Pending", "Completed", "Failed", "Canceled"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Trades", tradeSchema);
