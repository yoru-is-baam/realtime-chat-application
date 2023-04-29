const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const fn = require("./middlewares/function");
const Chat = require("./models/Chat");

const clients = {};

io.on("connection", (socket) => {
	let accountId;
	socket.on("login", async (id) => {
		accountId = id;
		// Associate the socket ID with the account ID
		clients[accountId] = socket.id;
		await fn.updateStatus(accountId, "Online");

		let account = await fn.getAccountById(accountId);
		socket.broadcast.emit("status", account);
	});

	socket.on("send-message", async (sendMessageObject) => {
		const { receiverId, message } = sendMessageObject;

		try {
			let chat = new Chat({ senderId: accountId, receiverId, message });
			await chat.save();

			const socketIdReceiver = clients[receiverId];
			const receiveMessageObject = { senderId: accountId, message };
			// Emit the chat message to the receiver
			io.to(socketIdReceiver).emit("receive-message", receiveMessageObject);
		} catch (error) {
			console.log(error);
		}
	});

	socket.on("disconnect", async () => {
		fn.updateStatus(accountId, "Offline");

		let account = await fn.getAccountById(accountId);
		socket.broadcast.emit("status", account);
	});
});

module.exports = { app, io, express, server };
