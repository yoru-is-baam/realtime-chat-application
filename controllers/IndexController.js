const Account = require("../models/Account");
const fn = require("../middlewares/function");

exports.index = async (req, res) => {
	let accounts = await Account.find({
		_id: { $ne: req.session.user.id },
	}).select("-__v");

	let chats = [];
	if (accounts) {
		chats = await fn.getNewestMessages(req.session.user.id);
	}

	return res.status(200).render("index", {
		title: "Chat Application",
		...req.session.user,
		accounts,
		chats,
		getChatById: fn.getChatById,
	});
};

exports.search = async (req, res) => {
	let searchString = req.body.searchString.toLowerCase();
	try {
		let accounts = await Account.find({
			name: {
				$regex: new RegExp(searchString, "i"),
				$ne: req.session.user.name,
			},
		}).select("-__v");

		return res.status(200).json({ accounts });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: "Something wrong" });
	}
};
