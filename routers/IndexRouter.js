const express = require("express");
const router = express.Router();

const IndexController = require("../controllers/IndexController");
const redirector = require("../middlewares/redirector");

router.get(
	"/",
	redirector.redirectWhenNoSessionSet("/account/login"),
	IndexController.index
);

router.post("/search", IndexController.search);

module.exports = router;
