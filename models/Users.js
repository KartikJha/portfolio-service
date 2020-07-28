var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username:  { type: String, unique: true },
	password: { type: String, required: true},
	email: {type: String, required: true, unique: true, index: true },
});

module.exports = mongoose.model('Users', userSchema);