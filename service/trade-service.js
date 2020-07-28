const { wrapServiceResult } = require("../utils/common");
const Trades = require("../models/Trade");
const messages = require("../utils/messages");

const saveUser = async (user) => {
	if (!user.username) {
		user.username = user.email;
	}
	const userDoc = new Trades(user);
	const savedUser = await userDoc.save();
	if (!savedUser) {
		return wrapServiceResult({}, [messages.USER_CREATION_FAILED]);
	}
	return wrapServiceResult(savedUser, []);
};

const getTrades = async (query) => {
	if (query && query.token) {
		// fetch from redis
		return wrapServiceResult([], ["Not implemented yet"]);
	}
	const userList = await Trades.find({});
	return wrapServiceResult(userList, []);
}

module.exports = {
	saveUser,
	getTrades
}

