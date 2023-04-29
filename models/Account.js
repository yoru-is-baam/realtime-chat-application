const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	status: {
		default: "Offline",
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("accounts", accountSchema);
