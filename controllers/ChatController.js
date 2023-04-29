const Account = require("../models/Account");
const fn = require("../middlewares/function");

exports.chat = async (req, res) => {
	try {
		let account = await Account.findById(req.params.id).select("-__v");

		if (account) {
			let chats = await fn.getChatsBetweenUsers(
				req.session.user.id,
				req.params.id
			);

			return res.status(200).render("chat", {
				title: "Chat",
				id: req.session.user.id,
				account,
				chats,
			});
		}
	} catch (error) {
		console.log(error);
	}

	return res.redirect(400, "/");
};
