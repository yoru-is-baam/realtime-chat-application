exports.redirectWhenNoSessionSet = (path) => {
	return (req, res, next) => {
		if (!req.session.user) {
			return res.redirect(path);
		}

		next();
	};
};

exports.redirectWhenSessionSet = (path) => {
	return (req, res, next) => {
		if (req.session.user) {
			return res.redirect(path);
		}

		next();
	};
};
