const { wrapServiceResult } = require("../utils/common");
const Users = require("../models/Users");
const messages = require("../utils/messages");

const saveUser = async (user) => {
	if (!user.username) {
		user.username = user.email;
	}
	const userDoc = new Users(user);
	const savedUser = await userDoc.save();
	if (!savedUser) {
		return wrapServiceResult({}, [messages.USER_CREATION_FAILED]);
	}
	return wrapServiceResult(savedUser, []);
};

const getUsers = async (query) => {
	if (query && query.token) {
		// fetch from redis
		return wrapServiceResult([], ["Not implemented yet"]);
	}
	const userList = await Users.find({});
	return wrapServiceResult(userList, []);
}

module.exports = {
	saveUser,
	getUsers
}

