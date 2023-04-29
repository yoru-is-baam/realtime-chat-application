const express = require("express");
const router = express.Router();

const AccountController = require("../controllers/AccountController");
const validator = require("../middlewares/validator");
const redirector = require("../middlewares/redirector");

router.get(
	"/register",
	redirector.redirectWhenSessionSet("/"),
	AccountController.register_get
);

router.post(
	"/register",
	validator.registerValidation(),
	AccountController.register_post
);

router.get(
	"/login",
	redirector.redirectWhenSessionSet("/"),
	AccountController.login_get
);

router.post(
	"/login",
	validator.loginValidation(),
	AccountController.login_post
);

router.get(
	"/logout",
	redirector.redirectWhenNoSessionSet("/account/login"),
	AccountController.logout
);

module.exports = router;
