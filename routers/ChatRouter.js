const express = require("express");
const router = express.Router();

const ChatController = require("../controllers/ChatController");
const redirector = require("../middlewares/redirector");

router.get(
	"/:id",
	redirector.redirectWhenNoSessionSet("/account/login"),
	ChatController.chat
);

module.exports = router;
