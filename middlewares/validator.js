const { body } = require("express-validator");

exports.loginValidation = () => {
	const Account = require("../models/Account");
	const bcrypt = require("bcrypt");

	return [
		body("email")
			.isEmail()
			.withMessage("Invalid email")
			.custom(async (email) => {
				return Account.findOne({ email }).then((account) => {
					if (!account) {
						throw new Error("Invalid email");
					}
				});
			}),
		body("password")
			.isLength({ min: 1 })
			.withMessage("Please enter your password")
			.custom(async (password, { req }) => {
				const { email } = req.body;

				return Account.findOne({ email }).then(async (account) => {
					if (!account) {
						throw new Error("Invalid password");
					}

					const isMatched = await bcrypt.compare(password, account.password);

					if (!isMatched) {
						throw new Error("Invalid password");
					}

					req.account = {
						id: account._id,
						name: account.name,
					};
				});
			})
			.exists(),
	];
};

exports.registerValidation = () => {
	const Account = require("../models/Account");

	return [
		body("name")
			.isLength({ min: 5 })
			.withMessage("Name must be at least 5 characters")
			.trim(),
		body("email")
			.isEmail()
			.withMessage("Invalid email")
			.custom((email) => {
				return Account.findOne({ email }).then((account) => {
					if (account) {
						throw new Error("This email is already in use");
					}
				});
			}),
		body("password")
			.isLength({ min: 5 })
			.withMessage("Password must be at least 5 characters")
			.exists(),
		body("confirmPassword")
			.custom(
				(confirmPassword, { req }) => confirmPassword === req.body.password
			)
			.withMessage("Confirm password does not match"),
	];
};
