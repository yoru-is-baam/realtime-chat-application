const { validationResult } = require("express-validator");
const Account = require("../models/Account");

exports.register_get = (req, res) => {
	return res.status(200).render("register", {
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		error: "",
		title: "Register",
	});
};

exports.register_post = async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(401).render("register", {
			...req.body,
			error: errors.array()[0].msg,
			title: "Register",
		});
	}

	// register
	const { name, email, password } = req.body;
	const bcrypt = require("bcrypt");
	const saltRounds = 10;

	try {
		const hashedPass = await bcrypt.hash(password, saltRounds);
		const account = new Account({ name, email, password: hashedPass });

		await account.save();

		return res.redirect("/account/login");
	} catch (error) {
		return res
			.status(400)
			.render("register", { error: "Something wrong", title: "Register" });
	}
};

exports.login_get = (req, res) => {
	return res.status(200).render("login", {
		title: "Login",
		error: "",
		email: "",
		password: "",
	});
};

exports.login_post = async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(401).render("login", {
			...req.body,
			error: errors.array()[0].msg,
			title: "Login",
		});
	}

	req.session.user = {
		...req.account,
	};

	// set session expire
	if (req.body.remember) {
		req.session.cookie.maxAge = 1000 * 60 * 60;
	}

	// login
	return res.redirect("/");
};

exports.logout = (req, res) => {
	req.session.destroy();

	return res.redirect("/account/login");
};
