const Account = require("../models/Account");
const Chat = require("../models/Chat");

exports.updateStatus = async (accountId, status) => {
	try {
		await Account.findByIdAndUpdate(accountId, { status });
	} catch (error) {
		console.log(error);
	}
};

exports.getNewestMessages = async (accountId) => {
	try {
		let chats = await Chat.aggregate([
			{ $match: { receiverId: accountId } },
			{ $sort: { timestamp: -1 } },
			{
				$group: {
					_id: "$senderId",
					message: { $first: "$message" },
					timestamp: { $first: "$timestamp" },
				},
			},
		]).exec();

		return chats;
	} catch (error) {
		console.log(error);
	}

	return [];
};

exports.getChatById = (chats, accountId) => {
	let chat = chats.find((chat) => chat._id === accountId.toString());

	return chat;
};

exports.getChatsBetweenUsers = async (currentUserId, currentPartnerId) => {
	let chats = await Chat.find({
		$or: [
			{
				senderId: currentUserId,
				receiverId: currentPartnerId,
			},
			{
				senderId: currentPartnerId,
				receiverId: currentUserId,
			},
		],
	}).select("-__v");

	return chats;
};

exports.getAccountById = async (id) => {
	let account = [];

	try {
		account = await Account.findById(id).select("-__v -password");
	} catch (error) {
		console.log(error);
	}

	return account;
};
